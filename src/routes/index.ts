import { Router } from 'express';

// routes version
import v1Api from '@/routes/v1';

// middleware
import { apiRateLimiter } from '@/utils/middleware';

const api = Router();

api.use(apiRateLimiter);
api.use("/v1", v1Api);

export default api;