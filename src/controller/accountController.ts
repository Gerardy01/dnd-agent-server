import { Request, Response } from 'express';

// exceptions
import { WrongFormat, ExistData, DataNotFound, NotValid } from '@/utils/exceptions';

// orchestration
import { accountOrchestration } from '@/orchestration';

class AccountController {

    static async getUserAccount(req: Request, res: Response) {
        try {

            const accountId = req.user?.accountId || "";
            const data = await accountOrchestration.getUserAccount(accountId);

            return res.status(200).json({
                "status": "success",
                "message": "Account fetched successfully",
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

    static async register(req: Request, res: Response) {

        try {
            const data = await accountOrchestration.register(req.body);

            return res.status(201).json({
                "status": "success",
                "message": "Account created successfully",
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

            if (e instanceof ExistData) {
                return res.status(409).json({
                    "status": "failed",
                    "message": "Email exist",
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

    static async changeUsername(req: Request, res: Response) {
        try {

            const accountId = req.user?.accountId || "";
            const data = await accountOrchestration.changeUsername({ ...req.body, accountId });

            return res.status(200).json({
                "status": "success",
                "message": "Username changed successfully",
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

            if (e instanceof ExistData) {
                return res.status(409).json({
                    "status": "failed",
                    "message": "Username exist",
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

    static async forgotPasswordRequest(req: Request, res: Response) {
        try {

            const data = await accountOrchestration.forgotPasswordRequest(req.body);

            return res.status(200).json({
                "status": "success",
                "message": "Forgot password request sent successfully",
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

    static async resetPassword(req: Request, res: Response) {
        try {

            await accountOrchestration.resetPassword(req.body);

            return res.status(200).json({
                "status": "success",
                "message": "Password reset successfully",
                "userMessage": "",
                "data": true,
            });

        } catch (e) {

            if (e instanceof DataNotFound) {
                return res.status(404).json({
                    "status": "failed",
                    "message": e.message,
                    "userMessage": "",
                });
            }

            if (e instanceof NotValid) {
                return res.status(401).json({
                    "status": "failed",
                    "message": "Token not valid",
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

export default AccountController;