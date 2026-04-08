import { Request, Response } from 'express';

// exceptions
import { WrongFormat, DataNotFound } from '@/utils/exceptions';

// orchestration
import { featOrchestration } from '@/orchestration';

class WorkshopFeatController {

    static async getFeats(req: Request, res: Response) {
        try {
            const accountId = req.user?.accountId || "";
            const data = await featOrchestration.getFeats(accountId);

            return res.status(200).json({
                "status": "success",
                "message": "Feats fetched successfully",
                "userMessage": "",
                "data": data
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

    static async getOneFeat(req: Request, res: Response) {
        try {
            const accountId = req.user?.accountId || "";
            const data = await featOrchestration.getOneFeat(Number(req.params.id), accountId);

            return res.status(200).json({
                "status": "success",
                "message": "Feat fetched successfully",
                "userMessage": "",
                "data": data
            });

        } catch (e) {
            if (e instanceof DataNotFound) {
                return res.status(404).json({
                    "status": "failed",
                    "message": "Feat not found",
                    "userMessage": e.message,
                });
            }

            return res.status(500).json({
                "status": "failed",
                "message": "Internal server error",
                "userMessage": "500",
                "errors": e
            });
        }
    }

    static async createFeat(req: Request, res: Response) {
        try {
            const accountId = req.user?.accountId || "";
            const data = await featOrchestration.createFeat(req.body, accountId);

            return res.status(201).json({
                "status": "success",
                "message": "Feat created successfully",
                "userMessage": "",
                "data": data
            });

        } catch (e) {
            if (e instanceof WrongFormat) {
                return res.status(422).json({
                    "status": "failed",
                    "message": e.message,
                    "userMessage": "",
                });
            }

            return res.status(500).json({
                "status": "failed",
                "message": "Internal server error",
                "userMessage": "500",
                "errors": e
            });
        }
    }

    static async editFeat(req: Request, res: Response) {
        try {
            const accountId = req.user?.accountId || "";
            const data = await featOrchestration.editFeat(req.body, accountId);

            return res.status(200).json({
                "status": "success",
                "message": "Feat updated successfully",
                "userMessage": "",
                "data": data
            });

        } catch (e) {
            if (e instanceof DataNotFound) {
                return res.status(404).json({
                    "status": "failed",
                    "message": "Feat not found",
                    "userMessage": e.message,
                });
            }

            if (e instanceof WrongFormat) {
                return res.status(422).json({
                    "status": "failed",
                    "message": e.message,
                    "userMessage": "",
                });
            }

            return res.status(500).json({
                "status": "failed",
                "message": "Internal server error",
                "userMessage": "500",
                "errors": e
            });
        }
    }

    static async deleteFeat(req: Request, res: Response) {
        try {
            const accountId = req.user?.accountId || "";
            await featOrchestration.deleteFeat(Number(req.params.id), accountId);

            return res.status(200).json({
                "status": "success",
                "message": "Feat deleted successfully",
                "userMessage": "",
            });

        } catch (e) {
            if (e instanceof DataNotFound) {
                return res.status(404).json({
                    "status": "failed",
                    "message": "Feat not found",
                    "userMessage": e.message,
                });
            }

            return res.status(500).json({
                "status": "failed",
                "message": "Internal server error",
                "userMessage": "500",
                "errors": e
            });
        }
    }
}

export default WorkshopFeatController;
