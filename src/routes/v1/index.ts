import { Router } from 'express';

// routes
import authRoutes from '@/routes/v1/authRoutes';
import accountRoutes from '@/routes/v1/accountRoutes';
import itemRoutes from '@/routes/v1/itemRoutes';

const v1Api = Router();

v1Api.use("/", authRoutes);
v1Api.use("/account", accountRoutes);
v1Api.use("/item", itemRoutes);

export default v1Api;