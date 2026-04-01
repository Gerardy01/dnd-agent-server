import { Router } from 'express';

// middlewares
import { authenticate, validateRequest } from '@/utils/middleware';

// schema
import { GetUploadUrlSchema } from '@/schema/fileSchema';

// controller
import FileController from '@/controller/fileController';

const fileRoutes = Router();

fileRoutes.post(
    "/upload-presigned-url",
    authenticate,
    validateRequest(GetUploadUrlSchema),
    FileController.getUploadPresignedUrl,
);

export default fileRoutes;