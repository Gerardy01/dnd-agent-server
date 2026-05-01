import { Router } from 'express';

// middlewares
import { authenticate, validateRequest } from '@/utils/middleware';

// schema
import { CreateFactionSchema, UpdateFactionSchema } from '@/schema/factionSchema';

// controller
import WorkshopFactionController from '@/controller/workshopFactionController';

const workshopFactionRoutes = Router();

workshopFactionRoutes.get(
    '/',
    authenticate,
    WorkshopFactionController.getFactions,
);
workshopFactionRoutes.get(
    '/:id',
    authenticate,
    WorkshopFactionController.getOneFaction,
);
workshopFactionRoutes.post(
    '/',
    authenticate,
    validateRequest(CreateFactionSchema),
    WorkshopFactionController.createFaction,
);
workshopFactionRoutes.put(
    '/',
    authenticate,
    validateRequest(UpdateFactionSchema),
    WorkshopFactionController.editFaction,
);
workshopFactionRoutes.delete(
    '/:id',
    authenticate,
    WorkshopFactionController.deleteFaction,
);

export default workshopFactionRoutes;
