import { Router } from 'express';

// middlewares
import { authenticate, validateRequest } from '@/utils/middleware';

// schema
import { CreateWorkshopClassSchema, UpdateWorkshopClassSchema, AddFeatureSchema, EditFeatureSchema, DeleteFeatureSchema, AddResourceSchema, EditResourceSchema, DeleteResourceSchema } from '@/schema/classSchema';

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

workshopClassRoutes.post(
    '/action/feature',
    authenticate,
    validateRequest(AddFeatureSchema),
    WorkshopClassController.addFeature,
);

workshopClassRoutes.put(
    '/action/feature',
    authenticate,
    validateRequest(EditFeatureSchema),
    WorkshopClassController.editFeature,
);

workshopClassRoutes.delete(
    '/action/feature',
    authenticate,
    validateRequest(DeleteFeatureSchema),
    WorkshopClassController.deleteFeature,
);

workshopClassRoutes.post(
    '/action/resource',
    authenticate,
    validateRequest(AddResourceSchema),
    WorkshopClassController.addResource,
);

workshopClassRoutes.put(
    '/action/resource',
    authenticate,
    validateRequest(EditResourceSchema),
    WorkshopClassController.editResource,
);

workshopClassRoutes.delete(
    '/action/resource',
    authenticate,
    validateRequest(DeleteResourceSchema),
    WorkshopClassController.deleteResource,
);

export default workshopClassRoutes;
