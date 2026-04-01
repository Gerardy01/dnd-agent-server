import { Request, Response } from 'express';

// orchestration
import { fileOrchestration } from '@/orchestration';

class FileController {
    static async getUploadPresignedUrl(req: Request, res: Response) {
        try {

            const accountId = req.user?.accountId || "";
            const data = await fileOrchestration.generateUploadUrl(req.body, accountId);

            return res.status(200).json({
                status: "success",
                message: "presigned url generated",
                userMessage: "",
                data: data,
            });

        } catch (e) {

            return res.status(500).json({
                "status": "failed",
                "message": "Internal server error",
                "userMessage": "500",
                "errors": e
            });
        }
    }
}

export default FileController;
