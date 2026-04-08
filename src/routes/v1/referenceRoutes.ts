import { Router } from 'express';

// middlewares
import { authenticate } from '@/utils/middleware';

// controller
import ReferenceController from '@/controller/referenceController';

const referenceRoutes = Router();

referenceRoutes.get(
    '/item-options',
    authenticate,
    ReferenceController.getItemOptions,
);

referenceRoutes.get(
    '/effect-options',
    authenticate,
    ReferenceController.getEffectOptions,
);

referenceRoutes.get(
    '/feat-options',
    authenticate,
    ReferenceController.getFeatOptions,
);

export default referenceRoutes;
