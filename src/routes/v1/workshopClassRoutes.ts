import { Router } from 'express';

// middlewares
import { authenticate, validateRequest } from '@/utils/middleware';

// schema
import { CreateWorkshopClassSchema, UpdateWorkshopClassSchema } from '@/schema/classSchema';

// controller
import WorkshopClassController from '@/controller/workshopClassController';

const workshopClassRoutes = Router();

workshopClassRoutes.get(
    '/',
    authenticate,
    WorkshopClassController.getClasses,
);

workshopClassRoutes.get(
    '/:id',
    authenticate,
    WorkshopClassController.getOneClass,
);

workshopClassRoutes.get(
    '/:id/detailed',
    authenticate,
    WorkshopClassController.getDetailedClass,
);

workshopClassRoutes.post(
    '/',
    authenticate,
    validateRequest(CreateWorkshopClassSchema),
    WorkshopClassController.createClass,
);

workshopClassRoutes.put(
    '/',
    authenticate,
    validateRequest(UpdateWorkshopClassSchema),
    WorkshopClassController.editClass,
);

workshopClassRoutes.delete(
    '/:id',
    authenticate,
    WorkshopClassController.deleteClass,
);

export default workshopClassRoutes;
