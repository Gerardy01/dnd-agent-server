
// utils
import { DataNotFound } from "@/utils/exceptions";

// interfaces
import { IAccountService } from "@/services/accountService";
import { IAuthService } from "@/services/authService";
export interface IAuthOrchestration {
    generateNewOtp(email: string): Promise<void>;
}

export class AuthOrchestration implements IAuthOrchestration {
    constructor(
        private authService: IAuthService,
        private accountService: IAccountService,
    ) { }

    async generateNewOtp(email: string): Promise<void> {

        // check if account exist
        const account = await this.accountService.getAccountByEmail(email);
        if (!account) {
            throw new DataNotFound("AUTH-002");
        }

        // generate otp
        await this.authService.generateOtp({
            address: email,
        });
    }
}