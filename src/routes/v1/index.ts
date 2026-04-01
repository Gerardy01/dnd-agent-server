import { Router } from 'express';

// routes
import authRoutes from '@/routes/v1/authRoutes';
import accountRoutes from '@/routes/v1/accountRoutes';
import workshopItemRoutes from './workshopItemRoutes';
import referenceRoutes from '@/routes/v1/referenceRoutes';
import fileRoutes from '@/routes/v1/fileRoutes';

const v1Api = Router();

v1Api.use("/", authRoutes);
v1Api.use("/account", accountRoutes);
v1Api.use("/workshop-item", workshopItemRoutes);
v1Api.use("/reference", referenceRoutes);
v1Api.use("/file", fileRoutes);

export default v1Api;