import crypto from "crypto";

// interfaces
export interface ICryptProvider {
    generateRandomString(): string;
}

export class CryptoCryptProvider implements ICryptProvider {
    generateRandomString(): string {
        return crypto.randomBytes(32).toString("hex");
    }
}