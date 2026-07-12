import { Router } from 'express';
import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const docsRouter = Router();

docsRouter.get('/openapi.json', (_req, res) => {
  const specPath = path.join(__dirname, '../../../docs/openapi.json');
  const spec = JSON.parse(readFileSync(specPath, 'utf8'));
  res.status(200).json(spec);
});

docsRouter.get('/', (_req, res) => {
  res.status(200).type('html').send(`<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/><title>Dynesis Tech API</title></head>
<body style="font-family:Inter,sans-serif;padding:24px;max-width:960px;margin:0 auto;">
  <h1>Dynesis Tech API</h1>
  <p>OpenAPI specification: <a href="/api/v1/docs/openapi.json">/api/v1/docs/openapi.json</a></p>
  <p>Version: v1</p>
</body></html>`);
});
