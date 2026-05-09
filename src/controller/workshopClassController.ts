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

    static async addFeature(req: Request, res: Response) {
        try {
            const accountId = req.user?.accountId || "";
            const data = await classOrchestration.addFeature(req.body, accountId);

            return res.status(201).json({
                "status": "success",
                "message": "Feature added successfully",
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

    static async editFeature(req: Request, res: Response) {
        try {
            const accountId = req.user?.accountId || "";
            const data = await classOrchestration.editFeature(req.body, accountId);

            return res.status(200).json({
                "status": "success",
                "message": "Feature updated successfully",
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

    static async deleteFeature(req: Request, res: Response) {
        try {
            const accountId = req.user?.accountId || "";
            const data = await classOrchestration.deleteFeature(req.body, accountId);

            return res.status(200).json({
                "status": "success",
                "message": "Feature deleted successfully",
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

    static async addResource(req: Request, res: Response) {
        try {
            const accountId = req.user?.accountId || "";
            const data = await classOrchestration.addResource(req.body, accountId);

            return res.status(201).json({
                "status": "success",
                "message": "Resource added successfully",
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

    static async editResource(req: Request, res: Response) {
        try {
            const accountId = req.user?.accountId || "";
            const data = await classOrchestration.editResource(req.body, accountId);

            return res.status(200).json({
                "status": "success",
                "message": "Resource updated successfully",
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

    static async deleteResource(req: Request, res: Response) {
        try {
            const accountId = req.user?.accountId || "";
            const data = await classOrchestration.deleteResource(req.body, accountId);

            return res.status(200).json({
                "status": "success",
                "message": "Resource deleted successfully",
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
    static async getSubclasses(req: Request, res: Response) {
        try {
            const accountId = req.user?.accountId || "";
            const parentClassId = Number(req.query.parentClassId);

            if (!parentClassId) {
                return res.status(400).json({
                    "status": "failed",
                    "message": "Missing parentClassId query parameter",
                    "userMessage": "Missing parentClassId",
                });
            }

            const data = await classOrchestration.getSubclasses(parentClassId, accountId);

            return res.status(200).json({
                "status": "success",
                "message": "Subclasses fetched successfully",
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

    static async getOneSubclass(req: Request, res: Response) {
        try {
            const accountId = req.user?.accountId || "";
            const parentClassId = Number(req.query.parentClassId);

            if (!parentClassId) {
                return res.status(400).json({
                    "status": "failed",
                    "message": "Missing parentClassId query parameter",
                    "userMessage": "Missing parentClassId",
                });
            }

            const data = await classOrchestration.getOneSubclass(Number(req.params.id), parentClassId, accountId);

            return res.status(200).json({
                "status": "success",
                "message": "Subclass fetched successfully",
                "userMessage": "",
                "data": data
            });

        } catch (e) {
            if (e instanceof DataNotFound) {
                return res.status(404).json({
                    "status": "failed",
                    "message": "Subclass not found",
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

    static async getDetailedSubclass(req: Request, res: Response) {
        try {
            const accountId = req.user?.accountId || "";
            const parentClassId = Number(req.query.parentClassId);

            if (!parentClassId) {
                return res.status(400).json({
                    "status": "failed",
                    "message": "Missing parentClassId query parameter",
                    "userMessage": "Missing parentClassId",
                });
            }

            const data = await classOrchestration.getDetailedSubclass(Number(req.params.id), parentClassId, accountId);

            return res.status(200).json({
                "status": "success",
                "message": "Subclass fetched successfully",
                "userMessage": "",
                "data": data
            });

        } catch (e) {
            if (e instanceof DataNotFound) {
                return res.status(404).json({
                    "status": "failed",
                    "message": "Subclass not found",
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

    static async createSubclass(req: Request, res: Response) {
        try {
            const accountId = req.user?.accountId || "";
            const data = await classOrchestration.createSubclass(req.body, accountId);

            return res.status(201).json({
                "status": "success",
                "message": "Subclass created successfully",
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

    static async editSubclass(req: Request, res: Response) {
        try {
            const accountId = req.user?.accountId || "";
            const data = await classOrchestration.editSubclass(req.body, accountId);

            return res.status(200).json({
                "status": "success",
                "message": "Subclass updated successfully",
                "userMessage": "",
                "data": data
            });

        } catch (e) {
            if (e instanceof DataNotFound) {
                return res.status(404).json({
                    "status": "failed",
                    "message": "Subclass not found",
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

    static async deleteSubclass(req: Request, res: Response) {
        try {
            const accountId = req.user?.accountId || "";
            const parentClassId = Number(req.query.parentClassId);

            if (!parentClassId) {
                return res.status(400).json({
                    "status": "failed",
                    "message": "Missing parentClassId query parameter",
                    "userMessage": "Missing parentClassId",
                });
            }

            await classOrchestration.deleteSubclass(Number(req.params.id), parentClassId, accountId);

            return res.status(200).json({
                "status": "success",
                "message": "Subclass deleted successfully",
                "userMessage": "",
            });

        } catch (e) {
            if (e instanceof DataNotFound) {
                return res.status(404).json({
                    "status": "failed",
                    "message": "Subclass not found",
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
