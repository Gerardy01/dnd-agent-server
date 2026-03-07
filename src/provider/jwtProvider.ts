import jwt, { SignOptions } from "jsonwebtoken";

// types
import { GenerateVerificationTokenDTO } from "@/interfaces/IAuth";
export interface IJwtProvider {
    generateVerificationToken(payload: GenerateVerificationTokenDTO, secret: string, expiresIn: NonNullable<SignOptions['expiresIn']>): Promise<string>;
    validateToken(token: string, secret: string): Promise<any>;
}

export class JwtProvider implements IJwtProvider {
    async generateVerificationToken(payload: GenerateVerificationTokenDTO, secret: string, expiresIn: NonNullable<SignOptions['expiresIn']>): Promise<string> {
        return jwt.sign(payload, secret, { expiresIn: expiresIn });
    }

    async validateToken(token: string, secret: string): Promise<any> {
        try {
            const decoded = jwt.verify(token, secret);
            return decoded;
        } catch (e) {
            return null;
        }
    }
}