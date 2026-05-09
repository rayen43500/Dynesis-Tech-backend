import * as paymentService from "../services/payment.service.js";

export async function checkoutSession(req, res, next) {
  try {
    const result = await paymentService.createCheckoutSession(req.user.sub, req.body.plan);
    return res.json(result);
  } catch (e) {
    if (e.statusCode === 400) {
      return res.status(400).json({ message: e.message });
    }
    return next(e);
  }
}

export async function history(req, res, next) {
  try {
    const rows = await paymentService.listPaymentHistory(req.user.sub);
    return res.json(rows);
  } catch (e) {
    return next(e);
  }
}
