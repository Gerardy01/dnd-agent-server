import { Router } from 'express';

// middlewares
import { authenticate, validateRequest } from '@/utils/middleware';

// schema
import { CreateWorkshopSpellSchema, UpdateWorkshopSpellSchema } from '@/schema/spellSchema';

// controller
import WorkshopSpellController from '@/controller/workshopSpellController';

const workshopSpellRoutes = Router();

workshopSpellRoutes.get(
    '/',
    authenticate,
    WorkshopSpellController.getSpells,
);
workshopSpellRoutes.get(
    '/:id',
    authenticate,
    WorkshopSpellController.getOneSpell,
);
workshopSpellRoutes.post(
    '/',
    authenticate,
    validateRequest(CreateWorkshopSpellSchema),
    WorkshopSpellController.createSpell,
);
workshopSpellRoutes.put(
    '/',
    authenticate,
    validateRequest(UpdateWorkshopSpellSchema),
    WorkshopSpellController.editSpell,
);
workshopSpellRoutes.delete(
    '/:id',
    authenticate,
    WorkshopSpellController.deleteSpell,
);

export default workshopSpellRoutes;
