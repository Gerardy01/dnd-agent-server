
// interfaces
import { CreateAccountDTO, LoginRegisterDataReturn } from "@/interfaces/IAccount";
import { IAccountService } from "../accountService";
import { IAuthService } from "../authService";
export interface IAccountOrchestration {
    register(data: CreateAccountDTO): Promise<LoginRegisterDataReturn>;
}

export class AccountOrchestration implements IAccountOrchestration {
    constructor(
        private accountService: IAccountService,
        private authService: IAuthService,
    ) { }

    async register(data: CreateAccountDTO): Promise<LoginRegisterDataReturn> {

        // create account
        const account = await this.accountService.createAccount(data);

        // generate OTP
        await this.authService.generateOtp({ address: account.email });

        // generate verification token
        const verificationToken = await this.authService.generateVerificationToken(account.email);

        return {
            verificationToken,
        }
    }
}