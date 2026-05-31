import crypto from 'crypto';

import { ApiError } from '../../../shared/http/apiErrors.js';
import { sha256Hex } from '../../../shared/security/tokenHash.js';
import { User } from '../../users/models/User.model.js';
import { Invitation } from '../models/Invitation.model.js';
import { authService } from '../../auth/services/auth.service.js';

import { env } from '../../../config/env.js';
import { sendEmail } from '../../../infrastructure/mail/mailer.js';
import { invitationEmailTemplate } from '../../../infrastructure/mail/emailTemplates.js';

const INVITATION_TTL_DAYS = 7;

function getDefaultFrontendUrl() {
  return env.FRONTEND_URL.split(',')[0]?.trim();
}

function generateInvitationToken() {
  // Random raw token; store only a hash.
  return crypto.randomBytes(32).toString('hex');
}

export const invitationService = {
  async createInvitation({ createdBy, email, role }) {
    if (!email) throw new ApiError({ statusCode: 400, code: 'VALIDATION_ERROR', message: 'Email is required' });

    const existing = await User.findOne({ email });
    if (existing) {
      throw new ApiError({ statusCode: 409, code: 'AUTH_EMAIL_ALREADY_REGISTERED', message: 'Email already registered' });
    }

    const token = generateInvitationToken();
    const tokenHash = sha256Hex(token);
    const expiresAt = new Date(Date.now() + INVITATION_TTL_DAYS * 24 * 60 * 60 * 1000);

    const invitation = await Invitation.create({
      email,
      tokenHash,
      role,
      createdBy,
      expiresAt
    });

    const invitationLink = `${getDefaultFrontendUrl()}/accept-invitation?token=${token}`;
    const { subject, text, html } = invitationEmailTemplate({
      displayName: '',
      role,
      invitationLink
    });

    await sendEmail({
      to: email,
      subject,
      text,
      html
    });

    return { invitationId: invitation._id };
  },

  async acceptInvitation({ token, email, password, displayName }) {
    const tokenHash = sha256Hex(token);

    const invitation = await Invitation.findOne({
      tokenHash,
      usedAt: null,
      expiresAt: { $gt: new Date() }
    });

    if (!invitation) {
      throw new ApiError({ statusCode: 400, code: 'INVITATION_INVALID_OR_EXPIRED', message: 'Invitation invalid or expired' });
    }

    if (email && invitation.email.toLowerCase() !== email.toLowerCase()) {
      throw new ApiError({ statusCode: 400, code: 'INVITATION_EMAIL_MISMATCH', message: 'Email mismatch' });
    }

    // Create user if missing. If user exists, we only allow setting password if it’s not set.
    let user = await User.findOne({ email: invitation.email });
    if (!user) {
      user = await User.create({
        email: invitation.email,
        role: invitation.role,
        displayName: displayName || '',
        passwordHash: undefined,
        isActivated: true
      });
    }

    if (user.role !== invitation.role) {
      // Role drift indicates an issue; disallow.
      throw new ApiError({ statusCode: 409, code: 'INVITATION_ROLE_CONFLICT', message: 'Invitation role conflict' });
    }

    await authService.setPasswordForUser({ userId: user._id, password });
    await User.updateOne(
      { _id: user._id },
      { $set: { displayName: displayName || user.displayName, isActivated: true, activationToken: undefined, activationTokenExpires: undefined } }
    );

    invitation.usedAt = new Date();
    await invitation.save();

    // Issue new access + refresh tokens.
    return authService.loginWithPassword({ email: invitation.email, password });
  }
};

