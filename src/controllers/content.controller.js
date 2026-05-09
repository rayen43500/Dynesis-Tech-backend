import * as contentService from "../services/content.service.js";

export async function getPortfolio(_req, res, next) {
  try {
    const rows = await contentService.listPortfolio();
    return res.json(rows);
  } catch (e) {
    return next(e);
  }
}

export async function postPortfolio(req, res, next) {
  try {
    const row = await contentService.createPortfolioProject(req.body);
    return res.status(201).json(row);
  } catch (e) {
    return next(e);
  }
}

export async function getReviews(_req, res, next) {
  try {
    const rows = await contentService.listApprovedReviews();
    return res.json(rows);
  } catch (e) {
    return next(e);
  }
}

export async function postReview(req, res, next) {
  try {
    const row = await contentService.createReview(req.body);
    return res.status(201).json(row);
  } catch (e) {
    return next(e);
  }
}

export async function moderateReview(req, res, next) {
  try {
    const row = await contentService.moderateReview(req.params.id, req.body.isApproved);
    return res.json(row);
  } catch (e) {
    if (e.statusCode === 404) {
      return res.status(404).json({ message: e.message });
    }
    return next(e);
  }
}

export async function getFaq(_req, res, next) {
  try {
    const rows = await contentService.listPublishedFaq();
    return res.json(rows);
  } catch (e) {
    return next(e);
  }
}

export async function postFaq(req, res, next) {
  try {
    const row = await contentService.createFaq(req.body);
    return res.status(201).json(row);
  } catch (e) {
    return next(e);
  }
}

export async function newsletterSubscribe(req, res, next) {
  try {
    const result = await contentService.subscribeNewsletter(req.body.email);
    return res.json(result);
  } catch (e) {
    return next(e);
  }
}
