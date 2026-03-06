import { Request, Response } from 'express';

// exceptions
import { DataNotFound, Forbidden } from '@/utils/exceptions';

// services
import { authOrchestration } from '@/services';

class AuthController {
    static async login(req: Request, res: Response) {

        try {
            return res.status(200).json({
                "status": "success",
                "message": "login success",
                "userMessage": "",
                "data": {
                    "accessToken": ""
                },
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

    static async generateOtp(req: Request, res: Response) {

        try {
            const email = req.body.email ? req.body.email : "";
            await authOrchestration.generateNewOtp(email);

            return res.status(200).json({
                "status": "success",
                "message": "generate otp success",
                "userMessage": "",
            });
        } catch (e) {

            if (e instanceof DataNotFound) {
                return res.status(404).json({
                    "status": "failed",
                    "message": "Account not found",
                    "userMessage": e.message,
                });
            }

            if (e instanceof Forbidden) {
                return res.status(403).json({
                    "status": "failed",
                    "message": "OTP cooldown",
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

export default AuthController;