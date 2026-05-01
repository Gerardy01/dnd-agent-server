import { Request, Response } from 'express';

// orchestration
import { referenceOrchestration } from '@/orchestration';

class ReferenceController {

    static async getItemOptions(req: Request, res: Response) {

        try {

            const data = await referenceOrchestration.getItemOptions();

            return res.status(200).json({
                "status": "success",
                "message": "Item options fetched successfully",
                "userMessage": "",
                "data": data,
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

    static async getEffectOptions(req: Request, res: Response) {

        try {

            const data = await referenceOrchestration.getEffectOptions();

            return res.status(200).json({
                "status": "success",
                "message": "Effect options fetched successfully",
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

    static async getFeatOptions(req: Request, res: Response) {

        try {

            const data = await referenceOrchestration.getFeatOptions();

            return res.status(200).json({
                "status": "success",
                "message": "Feat options fetched successfully",
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

    static async getSpellOptions(req: Request, res: Response) {

        try {

            const data = await referenceOrchestration.getSpellOptions();

            return res.status(200).json({
                "status": "success",
                "message": "Spell options fetched successfully",
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

    static async getMonsterOptions(req: Request, res: Response) {

        try {

            const data = await referenceOrchestration.getMonsterOptions();

            return res.status(200).json({
                "status": "success",
                "message": "Monster options fetched successfully",
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

}

export default ReferenceController;
