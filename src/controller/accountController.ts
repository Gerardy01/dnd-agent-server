import { Request, Response } from 'express';

// exceptions
import { WrongFormat, ExistData } from '@/utils/exceptions';

// services
import { accountService } from '@/services';

class AccountController {
    static async register(req: Request, res: Response) {

        try {
            const newAccount = await accountService.createAccount(req.body);

            return res.status(201).json({
                "status": "success",
                "message": "login success",
                "userMessage": "",
                "data": newAccount,
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
}

export default AccountController;