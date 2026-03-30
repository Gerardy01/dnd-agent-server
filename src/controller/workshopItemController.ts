import { Request, Response } from 'express';

// exceptions
import { WrongFormat, ExistData, DataNotFound, NotValid } from '@/utils/exceptions';

// orchestration
import { itemOrchestration } from '@/orchestration';

class WorkshopItemController {

    static async getItems(req: Request, res: Response) {

        try {
            const accountId = req.user?.accountId || "";
            const data = await itemOrchestration.getItems(accountId);

            return res.status(200).json({
                "status": "success",
                "message": "Items fetched successfully",
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

    static async getOneItem(req: Request, res: Response) {
        try {
            const accountId = req.user?.accountId || "";
            const data = await itemOrchestration.getOneItem(Number(req.params.id), accountId);

            return res.status(200).json({
                "status": "success",
                "message": "Item fetched successfully",
                "userMessage": "",
                "data": data
            });

        } catch (e) {

            if (e instanceof DataNotFound) {
                return res.status(404).json({
                    "status": "failed",
                    "message": "Item not found",
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

    static async createItem(req: Request, res: Response) {
        try {
            const accountId = req.user?.accountId || "";
            const data = await itemOrchestration.createItem(req.body, accountId);

            return res.status(201).json({
                "status": "success",
                "message": "Item created successfully",
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

    static async editItem(req: Request, res: Response) {
        try {
            const accountId = req.user?.accountId || "";
            const data = await itemOrchestration.editItem(req.body, accountId);

            return res.status(200).json({
                "status": "success",
                "message": "Item updated successfully",
                "userMessage": "",
                "data": data
            });

        } catch (e) {

            if (e instanceof DataNotFound) {
                return res.status(404).json({
                    "status": "failed",
                    "message": "Item not found",
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

    static async deleteItem(req: Request, res: Response) {
        try {
            const accountId = req.user?.accountId || "";
            await itemOrchestration.deleteItem(Number(req.params.id), accountId);

            return res.status(200).json({
                "status": "success",
                "message": "Item deleted successfully",
                "userMessage": "",
            });

        } catch (e) {

            if (e instanceof DataNotFound) {
                return res.status(404).json({
                    "status": "failed",
                    "message": "Item not found",
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

export default WorkshopItemController;
