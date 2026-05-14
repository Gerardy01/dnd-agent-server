import { Router } from 'express';

// middlewares
import { authenticate, validateRequest } from '@/utils/middleware';

// schema
import { CreateWorkshopRaceSchema, UpdateWorkshopRaceSchema, AddTraitsSchema, EditTraitsSchema, DeleteTraitsSchema } from '@/schema/raceSchema';

// controller
import WorkshopRaceController from '@/controller/workshopRaceController';

const workshopRaceRoutes = Router();

workshopRaceRoutes.get(
    '/',
    authenticate,
    WorkshopRaceController.getRaces,
);

workshopRaceRoutes.get(
    '/:id',
    authenticate,
    WorkshopRaceController.getOneRace,
);

workshopRaceRoutes.get(
    '/:id/detailed',
    authenticate,
    WorkshopRaceController.getDetailedRace,
);

workshopRaceRoutes.post(
    '/',
    authenticate,
    validateRequest(CreateWorkshopRaceSchema),
    WorkshopRaceController.createRace,
);

workshopRaceRoutes.put(
    '/',
    authenticate,
    validateRequest(UpdateWorkshopRaceSchema),
    WorkshopRaceController.editRace,
);

workshopRaceRoutes.delete(
    '/:id',
    authenticate,
    WorkshopRaceController.deleteRace,
);

workshopRaceRoutes.post(
    '/action/trait',
    authenticate,
    validateRequest(AddTraitsSchema),
    WorkshopRaceController.addTrait,
);

workshopRaceRoutes.put(
    '/action/trait',
    authenticate,
    validateRequest(EditTraitsSchema),
    WorkshopRaceController.editTrait,
);

workshopRaceRoutes.delete(
    '/action/trait',
    authenticate,
    validateRequest(DeleteTraitsSchema),
    WorkshopRaceController.deleteTrait,
);


export default workshopRaceRoutes;
