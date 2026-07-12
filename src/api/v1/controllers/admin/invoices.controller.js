import { asyncHandler } from '../../middlewares/asyncHandler.js';
import { sendSuccess } from '../../../../shared/http/apiResponse.js';
import { parsePagination } from '../../../../shared/http/pagination.js';
import { invoicesService } from '../../../../modules/invoices/services/invoices.service.js';

export const invoicesAdminController = {
  list: asyncHandler(async (req, res) => {
    const { page, limit, skip } = parsePagination(req.query);
    const filter = {};
    if (req.query.clientId) filter.clientId = req.query.clientId;
    if (req.query.status) filter.status = req.query.status;
    const result = await invoicesService.list(filter, { page, limit, skip });
    return sendSuccess(res, { data: result.items, meta: { page, limit, total: result.total } });
  }),

  getById: asyncHandler(async (req, res) => {
    const doc = await invoicesService.getById(req.params.id);
    return sendSuccess(res, { data: doc });
  }),

  create: asyncHandler(async (req, res) => {
    const doc = await invoicesService.create(req.body);
    return sendSuccess(res, { data: doc });
  }),

  update: asyncHandler(async (req, res) => {
    const doc = await invoicesService.update(req.params.id, req.body);
    return sendSuccess(res, { data: doc });
  })
};
