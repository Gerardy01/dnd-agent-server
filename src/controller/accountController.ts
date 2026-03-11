import { Request, Response } from 'express';

// exceptions
import { WrongFormat, ExistData, Forbidden, DataNotFound } from '@/utils/exceptions';

// services
import { accountOrchestration } from '@/services';

class AccountController {
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
}

export default AccountController;