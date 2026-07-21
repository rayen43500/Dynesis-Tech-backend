import { Router } from 'express';

import { processChatbotMessage } from '../../../../modules/chatbot/chatbot.service.js';
import { asyncHandler } from '../../middlewares/asyncHandler.js';
import { sendSuccess } from '../../../../shared/http/apiResponse.js';
import { ApiError } from '../../../../shared/http/apiErrors.js';

export const chatbotPublicRouter = Router();

/**
 * POST /api/v1/public/chatbot/message
 * Body: { message: string }
 * RGPD: no personal data stored, no session, message not logged.
 */
chatbotPublicRouter.post(
  '/message',
  asyncHandler(async (req, res) => {
    const { message } = req.body;

    if (!message || typeof message !== 'string') {
      throw new ApiError({ statusCode: 400, code: 'VALIDATION_ERROR', message: 'message is required' });
    }

    const result = processChatbotMessage(message);

    return sendSuccess(res, {
      data: {
        response: result.response,
        matched: result.matched
      }
    });
  })
);
