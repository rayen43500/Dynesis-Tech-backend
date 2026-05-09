import * as subscriptionService from "../services/subscription.service.js";

export async function mine(req, res, next) {
  try {
    const rows = await subscriptionService.listMine(req.user.sub);
    return res.json(rows);
  } catch (e) {
    return next(e);
  }
}

export async function selectPlan(req, res, next) {
  try {
    const sub = await subscriptionService.selectPlan(req.user.sub, req.body.plan);
    return res.status(201).json(sub);
  } catch (e) {
    return next(e);
  }
}
