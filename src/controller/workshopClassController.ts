import { Request, Response } from 'express';

// exceptions
import { WrongFormat, DataNotFound } from '@/utils/exceptions';

// orchestration
import { classOrchestration } from '@/orchestration';

class WorkshopClassController {

    static async getClasses(req: Request, res: Response) {
        try {
            const accountId = req.user?.accountId || "";
            const data = await classOrchestration.getClasses(accountId);

            return res.status(200).json({
                "status": "success",
                "message": "Classes fetched successfully",
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

    static async getOneClass(req: Request, res: Response) {
        try {
            const accountId = req.user?.accountId || "";
            const data = await classOrchestration.getOneClass(Number(req.params.id), accountId);

            return res.status(200).json({
                "status": "success",
                "message": "Class fetched successfully",
                "userMessage": "",
                "data": data
            });

        } catch (e) {
            if (e instanceof DataNotFound) {
                return res.status(404).json({
                    "status": "failed",
                    "message": "Class not found",
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

    static async getDetailedClass(req: Request, res: Response) {
        try {
            const accountId = req.user?.accountId || "";
            const data = await classOrchestration.getDetailedClass(Number(req.params.id), accountId);

            return res.status(200).json({
                "status": "success",
                "message": "Class fetched successfully",
                "userMessage": "",
                "data": data
            });

        } catch (e) {
            if (e instanceof DataNotFound) {
                return res.status(404).json({
                    "status": "failed",
                    "message": "Class not found",
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

    static async createClass(req: Request, res: Response) {
        try {
            const accountId = req.user?.accountId || "";
            const data = await classOrchestration.createClass(req.body, accountId);

            return res.status(201).json({
                "status": "success",
                "message": "Class created successfully",
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

            if (e instanceof DataNotFound) {
                return res.status(404).json({
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

    static async editClass(req: Request, res: Response) {
        try {
            const accountId = req.user?.accountId || "";
            const data = await classOrchestration.editClass(req.body, accountId);

            return res.status(200).json({
                "status": "success",
                "message": "Class updated successfully",
                "userMessage": "",
                "data": data
            });

        } catch (e) {
            if (e instanceof DataNotFound) {
                return res.status(404).json({
                    "status": "failed",
                    "message": "Class not found",
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

    static async deleteClass(req: Request, res: Response) {
        try {
            const accountId = req.user?.accountId || "";
            await classOrchestration.deleteClass(Number(req.params.id), accountId);

            return res.status(200).json({
                "status": "success",
                "message": "Class deleted successfully",
                "userMessage": "",
            });

        } catch (e) {
            if (e instanceof DataNotFound) {
                return res.status(404).json({
                    "status": "failed",
                    "message": "Class not found",
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

export default WorkshopClassController;
