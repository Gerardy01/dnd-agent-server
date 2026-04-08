import { Router } from 'express';

// middlewares
import { authenticate, validateRequest } from '@/utils/middleware';

// schema
import { CreateWorkshopFeatSchema, UpdateWorkshopFeatSchema } from '@/schema/featSchema';

// controller
import WorkshopFeatController from '@/controller/workshopFeatController';

const workshopFeatRoutes = Router();

workshopFeatRoutes.get(
    '/',
    authenticate,
    WorkshopFeatController.getFeats,
);
workshopFeatRoutes.get(
    '/:id',
    authenticate,
    WorkshopFeatController.getOneFeat,
);
workshopFeatRoutes.post(
    '/',
    authenticate,
    validateRequest(CreateWorkshopFeatSchema),
    WorkshopFeatController.createFeat,
);
workshopFeatRoutes.put(
    '/',
    authenticate,
    validateRequest(UpdateWorkshopFeatSchema),
    WorkshopFeatController.editFeat,
);
workshopFeatRoutes.delete(
    '/:id',
    authenticate,
    WorkshopFeatController.deleteFeat,
);

export default workshopFeatRoutes;
