import { Message } from '../../../../modules/messages/models/Message.model.js';
import { asyncHandler } from '../../middlewares/asyncHandler.js';

export const contactController = {
  create: asyncHandler(async (req, res) => {
    const { name, email, phone, company, subject, message } = req.body;
    const userId = req.user?.userId || null;

    await Message.create({
      name,
      email,
      phone: phone || '',
      company: company || '',
      subject: subject || '',
      message,
      userId,
      isGuest: !userId,
      status: 'new'
    });

    return res.status(200).json({ success: true });
  })
};
