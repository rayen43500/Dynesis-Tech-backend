export function invitationEmailTemplate({ displayName, role, invitationLink }) {
  const safeName = displayName?.trim() ? displayName : 'there';
  const roleLabel = role === 'admin' ? 'Admin' : 'Client';

  const subject = `You're invited to Dynesis Tech as ${roleLabel}`;
  const text = `Hello ${safeName},\n\nYou have been invited to join Dynesis Tech as ${roleLabel}.\n\nClick here to accept the invitation:\n${invitationLink}\n\nThis invitation will expire soon.`;

  const html = `
    <div>
      <p>Hello ${safeName},</p>
      <p>You have been invited to join <strong>Dynesis Tech</strong> as <strong>${roleLabel}</strong>.</p>
      <p><a href="${invitationLink}">Accept invitation</a></p>
      <p>This invitation will expire soon.</p>
    </div>
  `;

  return { subject, text, html };
}

export function activationEmailTemplate({ activationLink }) {
  const subject = 'Activate your Dynesis Tech account';
  const text = `Welcome to Dynesis Tech!\n\nClick the link below to activate your account. This link expires in 24 hours.\n${activationLink}\n\nIf you didn't create an account, ignore this email.`;
  const html = `
    <div style="font-family: Inter, Arial, sans-serif; background:#f5f7f6; padding:24px;">
      <div style="max-width:560px; margin:0 auto; background:#ffffff; border-radius:12px; padding:28px 24px; border:1px solid #e8ece9;">
        <div style="font-family: Lora, Georgia, serif; font-size:22px; color:#1a1a1a; margin-bottom:8px;">
          Dynesis Tech
        </div>
        <h2 style="margin:0 0 12px; font-size:24px; color:#1a1a1a;">Welcome to Dynesis Tech!</h2>
        <p style="margin:0 0 22px; color:#4f5a53; line-height:1.6;">
          Click the button below to activate your account. This link expires in 24 hours.
        </p>
        <a
          href="${activationLink}"
          style="display:inline-block; background:#3A8A3A; color:#ffffff; text-decoration:none; padding:12px 22px; border-radius:8px; font-weight:600;"
        >
          Activate My Account
        </a>
        <p style="margin:22px 0 0; color:#6d756f; font-size:13px;">
          If you didn't create an account, ignore this email.
        </p>
      </div>
    </div>
  `;

  return { subject, text, html };
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function quoteBriefSummaryBlock({ projectType, budget, timeline, wantsDiscoveryCall }) {
  const discovery = wantsDiscoveryCall ? 'Yes' : 'No';
  return `
        <hr style="border:none; border-top:1px solid #e8ece9; margin:0 0 16px;" />
        <p style="margin:0 0 12px; font-size:12px; letter-spacing:1.5px; color:#8a8a9a;">YOUR BRIEF SUMMARY</p>
        <p style="margin:0 0 6px; color:#444444; line-height:1.6;"><strong>Project:</strong> ${escapeHtml(projectType)}</p>
        <p style="margin:0 0 6px; color:#444444; line-height:1.6;"><strong>Budget:</strong> ${escapeHtml(budget)}</p>
        <p style="margin:0 0 6px; color:#444444; line-height:1.6;"><strong>Timeline:</strong> ${escapeHtml(timeline)}</p>
        <p style="margin:0 0 24px; color:#444444; line-height:1.6;"><strong>Discovery call:</strong> ${discovery}</p>`;
}

function quoteBriefEmailShell({ safeName, summaryHtml, ctaHtml, ctaText }) {
  const subject = 'We received your brief — Dynesis Tech';
  const text = `Hi ${safeName},\n\nWe've received your project brief. Our team will review it and get back to you within 24 hours.\n\n${ctaText}\n\n— The Dynesis Tech Team\nhello@dynesistech.com`;

  const html = `
    <div style="font-family: Inter, Arial, sans-serif; background:#f5f7f6; padding:24px;">
      <div style="max-width:560px; margin:0 auto; background:#ffffff; border-radius:12px; padding:28px 24px; border:1px solid #e8ece9;">
        <p style="margin:0 0 16px; color:#1a1a1a; line-height:1.6;">Hi ${safeName},</p>
        <p style="margin:0 0 24px; color:#4f5a53; line-height:1.7;">
          We've received your project brief. Our team will review it and get back to you within 24 hours.
        </p>
        ${summaryHtml}
        ${ctaHtml}
        <p style="margin:24px 0 0; color:#6d756f; font-size:14px; line-height:1.6;">
          — The Dynesis Tech Team<br />
          hello@dynesistech.com
        </p>
      </div>
    </div>
  `;

  return { subject, text, html };
}

const quoteCtaButtonStyle =
  'display:inline-block; background:#3A8A3A; color:#ffffff; text-decoration:none; padding:14px 28px; border-radius:8px; font-weight:500;';

export function quoteBriefReceivedExistingUserEmailTemplate({
  name,
  projectType,
  budget,
  timeline,
  wantsDiscoveryCall,
  loginUrl
}) {
  const safeName = escapeHtml(name?.trim() ? name : 'there');
  const summaryHtml = quoteBriefSummaryBlock({ projectType, budget, timeline, wantsDiscoveryCall });
  const ctaHtml = `
        <p style="margin:0 0 20px; color:#4f5a53; line-height:1.7;">
          You already have an account with us. Sign in to track your request and receive your proposal on your dashboard.
        </p>
        <a href="${loginUrl}" style="${quoteCtaButtonStyle}">
          Sign In →
        </a>`;
  const ctaText = `Sign in to track your request: ${loginUrl}`;

  return quoteBriefEmailShell({ safeName, summaryHtml, ctaHtml, ctaText });
}

export function quoteBriefReceivedNewUserEmailTemplate({
  name,
  projectType,
  budget,
  timeline,
  wantsDiscoveryCall,
  registerUrl
}) {
  const safeName = escapeHtml(name?.trim() ? name : 'there');
  const summaryHtml = quoteBriefSummaryBlock({ projectType, budget, timeline, wantsDiscoveryCall });
  const ctaHtml = `
        <p style="margin:0 0 12px; font-size:12px; letter-spacing:1.5px; color:#8a8a9a;">CREATE YOUR ACCOUNT</p>
        <p style="margin:0 0 20px; color:#4f5a53; line-height:1.7;">
          Create a free account to track your request and receive your proposal directly on your dashboard.
        </p>
        <a href="${registerUrl}" style="${quoteCtaButtonStyle}">
          Create My Account →
        </a>`;
  const ctaText = `Create your account: ${registerUrl}`;

  return quoteBriefEmailShell({ safeName, summaryHtml, ctaHtml, ctaText });
}

