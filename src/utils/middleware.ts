import { Request, Response, NextFunction } from 'express';

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