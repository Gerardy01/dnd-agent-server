import { Request, Response } from 'express';

// exceptions
import { WrongFormat, DataNotFound } from '@/utils/exceptions';

// orchestration
import { monsterOrchestration } from '@/orchestration';

class WorkshopMonsterController {

    static async getMonsters(req: Request, res: Response) {
        try {
            const accountId = req.user?.accountId || "";
            const data = await monsterOrchestration.getMonsters(accountId);

            return res.status(200).json({
                "status": "success",
                "message": "Monsters fetched successfully",
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

    static async getOneMonster(req: Request, res: Response) {
        try {
            const accountId = req.user?.accountId || "";
            const data = await monsterOrchestration.getOneMonster(Number(req.params.id), accountId);

            return res.status(200).json({
                "status": "success",
                "message": "Monster fetched successfully",
                "userMessage": "",
                "data": data
            });

        } catch (e) {
            if (e instanceof DataNotFound) {
                return res.status(404).json({
                    "status": "failed",
                    "message": "Monster not found",
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

    static async createMonster(req: Request, res: Response) {
        try {
            const accountId = req.user?.accountId || "";
            const data = await monsterOrchestration.createMonster(req.body, accountId);

            return res.status(201).json({
                "status": "success",
                "message": "Monster created successfully",
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

    static async editMonster(req: Request, res: Response) {
        try {
            const accountId = req.user?.accountId || "";
            const data = await monsterOrchestration.editMonster(req.body, accountId);

            return res.status(200).json({
                "status": "success",
                "message": "Monster updated successfully",
                "userMessage": "",
                "data": data
            });

        } catch (e) {
            if (e instanceof DataNotFound) {
                return res.status(404).json({
                    "status": "failed",
                    "message": "Monster not found",
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

    static async deleteMonster(req: Request, res: Response) {
        try {
            const accountId = req.user?.accountId || "";
            await monsterOrchestration.deleteMonster(Number(req.params.id), accountId);

            return res.status(200).json({
                "status": "success",
                "message": "Monster deleted successfully",
                "userMessage": "",
            });

        } catch (e) {
            if (e instanceof DataNotFound) {
                return res.status(404).json({
                    "status": "failed",
                    "message": "Monster not found",
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

export default WorkshopMonsterController;
