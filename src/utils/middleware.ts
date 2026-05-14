import { Request, Response, NextFunction } from 'express';
import { rateLimit } from 'express-rate-limit';

// services
import { authService } from '@/services';

// interfaces
interface IZodErrorMessage {
    field: string;
    message: string;
}

export function validateRequest(Schema: any) {
    return async (req: Request, res: Response, next: NextFunction) => {
        const result = Schema.safeParse(req.body);

        if (!result.success) {
            let errors: any = result.error;
            try {
                const errorList: IZodErrorMessage[] = [];
                result.error.errors.forEach((item: any) => {
                    errorList.push({
                        field: item.path[0],
                        message: item.message
                    });
                });
                errors = errorList;
            } catch (e) { }

            return res.status(400).json({
                "status": "failed",
                "message": "bad request",
                "userMessage": "",
                "schemaErrors": errors
            });
        }

        next();
    }
}

export async function authenticate(req: Request, res: Response, next: NextFunction) {

    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return res.status(401).json({
            "status": "failed",
            "message": "bad request, not authenticated",
            "userMessage": "",
        });
    }

    try {
        const tokenData = await authService.verifyAccessToken(token);
        req.user = tokenData;

        next();
    } catch (e) {
        return res.status(401).json({
            "status": "failed",
            "message": "bad request, not authenticated",
            "userMessage": "",
        });
    }

}
export const apiRateLimiter = rateLimit({
    windowMs: 1000, // 1 second
    limit: 30, // limit each IP to 30 requests per second
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: {
        status: "failed",
        message: "Too many requests from this IP, please try again after a second",
        userMessage: "",
    }
});
