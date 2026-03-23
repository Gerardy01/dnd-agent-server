import { Router } from 'express';

// middlewares
import { authenticate, validateRequest } from '@/utils/middleware';

// schema
import { CreateWorkshopItemSchema, UpdateWorkshopItemSchema } from '@/schema/itemSchema';

// controller
import WorkshopItemController from '@/controller/workshopItemController';

const workshopItemRoutes = Router();

workshopItemRoutes.get(
    '/',
    authenticate,
    WorkshopItemController.getItems,
);
workshopItemRoutes.get(
    '/:id',
    authenticate,
    WorkshopItemController.getOneItem,
);
workshopItemRoutes.post(
    '/',
    authenticate,
    validateRequest(CreateWorkshopItemSchema),
    WorkshopItemController.createItem,
);
workshopItemRoutes.put(
    '/',
    authenticate,
    validateRequest(UpdateWorkshopItemSchema),
    WorkshopItemController.editItem,
);
workshopItemRoutes.delete(
    '/:id',
    authenticate,
    WorkshopItemController.deleteItem,
);

export default workshopItemRoutes;
