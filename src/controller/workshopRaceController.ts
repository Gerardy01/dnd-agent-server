import { Request, Response } from 'express';

// exceptions
import { WrongFormat, DataNotFound } from '@/utils/exceptions';

// orchestration
import { raceOrchestration } from '@/orchestration';

class WorkshopRaceController {

    static async getRaces(req: Request, res: Response) {
        try {
            const accountId = req.user?.accountId || "";
            const data = await raceOrchestration.getRaces(accountId);

            return res.status(200).json({
                "status": "success",
                "message": "Races fetched successfully",
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

    static async getOneRace(req: Request, res: Response) {
        try {
            const accountId = req.user?.accountId || "";
            const data = await raceOrchestration.getOneRace(Number(req.params.id), accountId);

            return res.status(200).json({
                "status": "success",
                "message": "Race fetched successfully",
                "userMessage": "",
                "data": data
            });

        } catch (e) {
            if (e instanceof DataNotFound) {
                return res.status(404).json({
                    "status": "failed",
                    "message": "Race not found",
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

    static async getDetailedRace(req: Request, res: Response) {
        try {
            const accountId = req.user?.accountId || "";
            const data = await raceOrchestration.getDetailedRace(Number(req.params.id), accountId);

            return res.status(200).json({
                "status": "success",
                "message": "Race fetched successfully",
                "userMessage": "",
                "data": data
            });

        } catch (e) {
            if (e instanceof DataNotFound) {
                return res.status(404).json({
                    "status": "failed",
                    "message": "Race not found",
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

    static async createRace(req: Request, res: Response) {
        try {
            const accountId = req.user?.accountId || "";
            const data = await raceOrchestration.createRace(req.body, accountId);

            return res.status(201).json({
                "status": "success",
                "message": "Race created successfully",
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

    static async editRace(req: Request, res: Response) {
        try {
            const accountId = req.user?.accountId || "";
            const data = await raceOrchestration.editRace(req.body, accountId);

            return res.status(200).json({
                "status": "success",
                "message": "Race updated successfully",
                "userMessage": "",
                "data": data
            });

        } catch (e) {
            if (e instanceof DataNotFound) {
                return res.status(404).json({
                    "status": "failed",
                    "message": "Race not found",
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

    static async deleteRace(req: Request, res: Response) {
        try {
            const accountId = req.user?.accountId || "";
            await raceOrchestration.deleteRace(Number(req.params.id), accountId);

            return res.status(200).json({
                "status": "success",
                "message": "Race deleted successfully",
                "userMessage": "",
            });

        } catch (e) {
            if (e instanceof DataNotFound) {
                return res.status(404).json({
                    "status": "failed",
                    "message": "Race not found",
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

    static async addTrait(req: Request, res: Response) {
        try {
            const accountId = req.user?.accountId || "";
            const data = await raceOrchestration.addTrait(req.body, accountId);

            return res.status(201).json({
                "status": "success",
                "message": "Trait added successfully",
                "userMessage": "",
                "data": data
            });

        } catch (e) {
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

    static async editTrait(req: Request, res: Response) {
        try {
            const accountId = req.user?.accountId || "";
            const data = await raceOrchestration.editTrait(req.body, accountId);

            return res.status(200).json({
                "status": "success",
                "message": "Trait updated successfully",
                "userMessage": "",
                "data": data
            });

        } catch (e) {
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

    static async deleteTrait(req: Request, res: Response) {
        try {
            const accountId = req.user?.accountId || "";
            const data = await raceOrchestration.deleteTrait(req.body, accountId);

            return res.status(200).json({
                "status": "success",
                "message": "Trait deleted successfully",
                "userMessage": "",
                "data": data
            });

        } catch (e) {
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


}

export default WorkshopRaceController;
