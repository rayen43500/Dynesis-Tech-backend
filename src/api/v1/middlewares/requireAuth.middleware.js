export { authJwt as requireAuth } from './authJwt.middleware.js';
export { requireRoles } from './rbac.middleware.js';

import { authJwt } from './authJwt.middleware.js';
import { requireRoles } from './rbac.middleware.js';

export const requireAdmin = [authJwt, requireRoles(['admin'])];
export const requireClient = [authJwt, requireRoles(['client'])];
export const requireDeveloper = [authJwt, requireRoles(['developer'])];
export const requireProjectManager = [authJwt, requireRoles(['project_manager'])];
