import { Request, Response } from 'express';
import { Transaction } from 'sequelize';
import sequelize from '@/config/database';

// exceptions
import { DataNotFound, Forbidden, NotValid } from '@/utils/exceptions';

// services
import { authOrchestration } from '@/services';

class AuthController {
    static async login(req: Request, res: Response) {

        try {

            const data = await authOrchestration.login(req.body);

            return res.status(200).json({
                "status": "success",
                "message": "login success",
                "userMessage": "",
                "data": data,
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
                    "userMessage": "",
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

    static async otpVerification(req: Request, res: Response) {
        const transaction: Transaction = await sequelize.transaction();

        try {

            const result = await authOrchestration.otpVerification(req.body, transaction);

            transaction.commit();

            res.cookie('refreshToken', result.refreshToken, {
                httpOnly: true,
                secure: true,
                maxAge: 10 * 24 * 60 * 60 * 1000, // 10 days in milliseconds (following token expiry time)
                sameSite: 'none'
            });

            return res.status(200).json({
                "status": "success",
                "message": "otp verification success",
                "userMessage": "",
                "data": {
                    "accessToken": result.accessToken,
                },
            });

        } catch (e) {

            transaction.rollback();

            if (e instanceof DataNotFound) {
                return res.status(404).json({
                    "status": "failed",
                    "message": "Account not found",
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

            if (e instanceof Forbidden) {
                return res.status(403).json({
                    "status": "failed",
                    "message": "OTP not found",
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

    static async getNewAccessToken(req: Request, res: Response) {

        try {

            const refreshToken = req.cookies.refreshToken || "";
            const accessToken = await authOrchestration.getNewAccessToken(refreshToken);

            return res.status(200).json({
                "status": "success",
                "message": "access token generated",
                "userMessage": "",
                "data": {
                    "accessToken": accessToken,
                },
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

export default AuthController;