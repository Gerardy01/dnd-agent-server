import { Router } from 'express';

// routes
import authRoutes from '@/routes/v1/authRoutes';
import accountRoutes from '@/routes/v1/accountRoutes';
import workshopItemRoutes from './workshopItemRoutes';
import workshopFeatRoutes from './workshopFeatRoutes';
import workshopSpellRoutes from './workshopSpellRoutes';
import workshopFactionRoutes from './workshopFactionRoutes';
import workshopMonsterRoutes from './workshopMonsterRoutes';
import workshopClassRoutes from './workshopClassRoutes';
import workshopRaceRoutes from './workshopRaceRoutes';
import referenceRoutes from '@/routes/v1/referenceRoutes';
import fileRoutes from '@/routes/v1/fileRoutes';

const v1Api = Router();

v1Api.use("/", authRoutes);
v1Api.use("/account", accountRoutes);
v1Api.use("/workshop-item", workshopItemRoutes);
v1Api.use("/workshop-feat", workshopFeatRoutes);
v1Api.use("/workshop-spell", workshopSpellRoutes);
v1Api.use("/workshop-faction", workshopFactionRoutes);
v1Api.use("/workshop-monster", workshopMonsterRoutes);
v1Api.use("/workshop-class", workshopClassRoutes);
v1Api.use("/workshop-race", workshopRaceRoutes);
v1Api.use("/reference", referenceRoutes);
v1Api.use("/file", fileRoutes);

export default v1Api;