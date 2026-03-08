
// interfaces
import { CreateAccountDTO, RegisterDataReturn } from "@/interfaces/IAccount";
import { IAccountService } from "../accountService";
import { IAuthService } from "../authService";
export interface IAccountOrchestration {
    register(data: CreateAccountDTO): Promise<RegisterDataReturn>;
}

export class AccountOrchestration implements IAccountOrchestration {
    constructor(
        private accountService: IAccountService,
        private authService: IAuthService,
    ) { }

    async register(data: CreateAccountDTO): Promise<RegisterDataReturn> {

        // create account
        const account = await this.accountService.createAccount(data);

        // generate OTP
        await this.authService.generateOtp({ address: account.email }, true);

        // generate verification token
        const verificationToken = await this.authService.generateVerificationToken(account.email);

        return {
            verificationToken,
        }
    }
}