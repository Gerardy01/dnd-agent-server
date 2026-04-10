import { Request, Response } from 'express';

// exceptions
import { DataNotFound } from '@/utils/exceptions';

// orchestration
import { spellOrchestration } from '@/orchestration';

class WorkshopSpellController {

    static async getSpells(req: Request, res: Response) {
        try {
            const accountId = req.user?.accountId || "";
            const data = await spellOrchestration.getSpells(accountId);

            return res.status(200).json({
                "status": "success",
                "message": "Spells fetched successfully",
                "userMessage": "",
                "data": data,
            });

        } catch (e) {
            return res.status(500).json({
                "status": "failed",
                "message": "Internal server error",
                "userMessage": "500",
                "errors": e,
            });
        }
    }

    static async getOneSpell(req: Request, res: Response) {
        try {
            const accountId = req.user?.accountId || "";
            const data = await spellOrchestration.getOneSpell(Number(req.params.id), accountId);

            return res.status(200).json({
                "status": "success",
                "message": "Spell fetched successfully",
                "userMessage": "",
                "data": data,
            });

        } catch (e) {
            if (e instanceof DataNotFound) {
                return res.status(404).json({
                    "status": "failed",
                    "message": "Spell not found",
                    "userMessage": e.message,
                });
            }

            return res.status(500).json({
                "status": "failed",
                "message": "Internal server error",
                "userMessage": "500",
                "errors": e,
            });
        }
    }

    static async createSpell(req: Request, res: Response) {
        try {
            const accountId = req.user?.accountId || "";
            const data = await spellOrchestration.createSpell(req.body, accountId);

            return res.status(201).json({
                "status": "success",
                "message": "Spell created successfully",
                "userMessage": "",
                "data": data,
            });

        } catch (e) {
            return res.status(500).json({
                "status": "failed",
                "message": "Internal server error",
                "userMessage": "500",
                "errors": e,
            });
        }
    }

    static async editSpell(req: Request, res: Response) {
        try {
            const accountId = req.user?.accountId || "";
            const data = await spellOrchestration.editSpell(req.body, accountId);

            return res.status(200).json({
                "status": "success",
                "message": "Spell updated successfully",
                "userMessage": "",
                "data": data,
            });

        } catch (e) {
            if (e instanceof DataNotFound) {
                return res.status(404).json({
                    "status": "failed",
                    "message": "Spell not found",
                    "userMessage": e.message,
                });
            }

            return res.status(500).json({
                "status": "failed",
                "message": "Internal server error",
                "userMessage": "500",
                "errors": e,
            });
        }
    }

    static async deleteSpell(req: Request, res: Response) {
        try {
            const accountId = req.user?.accountId || "";
            await spellOrchestration.deleteSpell(Number(req.params.id), accountId);

            return res.status(200).json({
                "status": "success",
                "message": "Spell deleted successfully",
                "userMessage": "",
            });

        } catch (e) {
            if (e instanceof DataNotFound) {
                return res.status(404).json({
                    "status": "failed",
                    "message": "Spell not found",
                    "userMessage": e.message,
                });
            }

            return res.status(500).json({
                "status": "failed",
                "message": "Internal server error",
                "userMessage": "500",
                "errors": e,
            });
        }
    }

}

export default WorkshopSpellController;
