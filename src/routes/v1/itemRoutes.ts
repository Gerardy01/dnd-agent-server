import { Router } from 'express';

// middlewares
import { authenticate, validateRequest } from '@/utils/middleware';

// schema
import { CreateItemSchema } from '@/schema/itemSchema';

// controller
import ItemController from '@/controller/itemController';

const itemRoutes = Router();

itemRoutes.get(
    '/',
    authenticate,
    ItemController.getItems,
);
itemRoutes.get(
    '/:id',
    authenticate,
    ItemController.getOneItem,
);
itemRoutes.post(
    '/',
    authenticate,
    validateRequest(CreateItemSchema),
    ItemController.createItem,
);

export default itemRoutes;
