import { AuditLog } from '../../../modules/audit/models/AuditLog.model.js';

const MUTATING_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

function sanitizeBodyKeys(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return [];
  return Object.keys(body).slice(0, 25);
}

function pickResourceFromPath(path) {
  // /api/v1/admin/services/123 -> services
  const parts = String(path).split('/').filter(Boolean);
  const adminIndex = parts.indexOf('admin');
  if (adminIndex >= 0 && parts[adminIndex + 1]) return parts[adminIndex + 1];
  return '';
}

export function auditAdminAction(req, res, next) {
  if (!MUTATING_METHODS.has(req.method)) {
    return next();
  }

  const startedAt = Date.now();
  const method = req.method;
  const path = req.originalUrl || req.path || '';
  const requestId = req.requestId || '';
  const resource = pickResourceFromPath(path);
  const targetId = req.params?.id ? String(req.params.id) : '';
  const actorUserId = req.user?.userId || null;
  const actorRole = req.user?.role || '';
  const bodyKeys = sanitizeBodyKeys(req.body);

  res.on('finish', () => {
    // Skip noisy auth failures; keep successful/validation/auditable attempts.
    if (res.statusCode < 200 || res.statusCode >= 500) return;

    AuditLog.create({
      actorUserId,
      actorRole,
      action: `${method} ${path}`,
      resource,
      targetId,
      requestId,
      method,
      path,
      statusCode: res.statusCode,
      metadata: {
        durationMs: Date.now() - startedAt,
        bodyKeys
      }
    }).catch(() => {
      // Never block admin APIs on audit write failures.
    });
  });

  return next();
}

