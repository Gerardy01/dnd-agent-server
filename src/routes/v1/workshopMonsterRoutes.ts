import { Router } from 'express';

// middlewares
import { authenticate, validateRequest } from '@/utils/middleware';

// schema
import { CreateWorkshopMonsterSchema, UpdateWorkshopMonsterSchema } from '@/schema/monsterSchema';

// controller
import WorkshopMonsterController from '@/controller/workshopMonsterController';

const workshopMonsterRoutes = Router();

workshopMonsterRoutes.get(
    '/',
    authenticate,
    WorkshopMonsterController.getMonsters,
);
workshopMonsterRoutes.get(
    '/:id',
    authenticate,
    WorkshopMonsterController.getOneMonster,
);
workshopMonsterRoutes.post(
    '/',
    authenticate,
    validateRequest(CreateWorkshopMonsterSchema),
    WorkshopMonsterController.createMonster,
);
workshopMonsterRoutes.put(
    '/',
    authenticate,
    validateRequest(UpdateWorkshopMonsterSchema),
    WorkshopMonsterController.editMonster,
);
workshopMonsterRoutes.delete(
    '/:id',
    authenticate,
    WorkshopMonsterController.deleteMonster,
);

export default workshopMonsterRoutes;
