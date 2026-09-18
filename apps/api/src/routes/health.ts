import { Router, Request, Response } from 'express';

export const healthRouter = Router();

const startTime = Date.now();

healthRouter.get('/', (_req: Request, res: Response) => {
  const uptimeSeconds = Math.floor((Date.now() - startTime) / 1000);

  res.json({
    status: 'UP',
    service: 'ecommerce-api-backend',
    uptimeSeconds,
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});
