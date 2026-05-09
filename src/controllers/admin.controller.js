import * as adminService from "../services/admin.service.js";
import * as quoteService from "../services/quote.service.js";

export async function overview(_req, res, next) {
  try {
    const data = await adminService.getOverview();
    return res.json(data);
  } catch (e) {
    return next(e);
  }
}

export async function listQuotes(_req, res, next) {
  try {
    const rows = await quoteService.listQuotes();
    return res.json(rows);
  } catch (e) {
    return next(e);
  }
}

export async function listContacts(req, res, next) {
  try {
    const { limit, skip } = req.query;
    const data = await adminService.listContactsPaginated(limit, skip);
    return res.json(data);
  } catch (e) {
    return next(e);
  }
}

export async function patchContact(req, res, next) {
  try {
    const row = await adminService.setContactStatus(req.params.id, req.body.status);
    return res.json(row);
  } catch (e) {
    if (e.statusCode === 404) {
      return res.status(404).json({ message: e.message });
    }
    return next(e);
  }
}

export async function deletePortfolio(req, res, next) {
  try {
    const result = await adminService.removePortfolio(req.params.id);
    return res.json(result);
  } catch (e) {
    if (e.statusCode === 404) {
      return res.status(404).json({ message: e.message });
    }
    return next(e);
  }
}

export async function updatePortfolio(req, res, next) {
  try {
    const row = await adminService.patchPortfolio(req.params.id, req.body);
    return res.json(row);
  } catch (e) {
    if (e.statusCode === 404) {
      return res.status(404).json({ message: e.message });
    }
    return next(e);
  }
}
