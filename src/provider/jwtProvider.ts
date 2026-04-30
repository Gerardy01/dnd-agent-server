import jwt, { SignOptions } from "jsonwebtoken";

// types and interfaces
export interface IJwtProvider {
    generateToken<T extends object>(payload: T, secret: string, expiresIn: NonNullable<SignOptions['expiresIn']>): Promise<string>;
    validateToken<T>(token: string, secret: string): Promise<T | null>;
}

export class JwtProvider implements IJwtProvider {
    async generateToken<T extends object>(
        payload: T,
        secret: string,
        expiresIn: NonNullable<SignOptions['expiresIn']>
    ): Promise<string> {
        return jwt.sign(payload, secret, { expiresIn });
    }

    async validateToken<T>(token: string, secret: string): Promise<T | null> {
        try {
            const decoded = jwt.verify(token, secret);
            return decoded as T;
        } catch (e) {
            return null;
        }
    }
}