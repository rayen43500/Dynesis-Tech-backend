export function parsePagination({ page, limit, maxLimit = 100 }) {
  const p = page ? Number(page) : 1;
  const l = limit ? Number(limit) : 10;

  const pageNumber = Number.isFinite(p) && p > 0 ? Math.floor(p) : 1;
  const limitNumber = Number.isFinite(l) && l > 0 ? Math.min(Math.floor(l), maxLimit) : 10;

  const skip = (pageNumber - 1) * limitNumber;
  return { page: pageNumber, limit: limitNumber, skip };
}

