import { Request, Response } from 'express';

// exceptions
import { WrongFormat, DataNotFound } from '@/utils/exceptions';

// orchestration
import { factionOrchestration } from '@/orchestration';

class WorkshopFactionController {

    static async getFactions(req: Request, res: Response) {
        try {
            const accountId = req.user?.accountId || "";
            const data = await factionOrchestration.getFactions(accountId);

            return res.status(200).json({
                "status": "success",
                "message": "Factions fetched successfully",
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

    static async getOneFaction(req: Request, res: Response) {
        try {
            const accountId = req.user?.accountId || "";
            const data = await factionOrchestration.getOneFaction(Number(req.params.id), accountId);

            return res.status(200).json({
                "status": "success",
                "message": "Faction fetched successfully",
                "userMessage": "",
                "data": data
            });

        } catch (e) {
            if (e instanceof DataNotFound) {
                return res.status(404).json({
                    "status": "failed",
                    "message": "Faction not found",
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

    static async createFaction(req: Request, res: Response) {
        try {
            const accountId = req.user?.accountId || "";
            const data = await factionOrchestration.createFaction(req.body, accountId);

            return res.status(201).json({
                "status": "success",
                "message": "Faction created successfully",
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

    static async editFaction(req: Request, res: Response) {
        try {
            const accountId = req.user?.accountId || "";
            const data = await factionOrchestration.editFaction(req.body, accountId);

            return res.status(200).json({
                "status": "success",
                "message": "Faction updated successfully",
                "userMessage": "",
                "data": data
            });

        } catch (e) {
            if (e instanceof DataNotFound) {
                return res.status(404).json({
                    "status": "failed",
                    "message": "Faction not found",
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

    static async deleteFaction(req: Request, res: Response) {
        try {
            const accountId = req.user?.accountId || "";
            await factionOrchestration.deleteFaction(Number(req.params.id), accountId);

            return res.status(200).json({
                "status": "success",
                "message": "Faction deleted successfully",
                "userMessage": "",
            });

        } catch (e) {
            if (e instanceof DataNotFound) {
                return res.status(404).json({
                    "status": "failed",
                    "message": "Faction not found",
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

export default WorkshopFactionController;
