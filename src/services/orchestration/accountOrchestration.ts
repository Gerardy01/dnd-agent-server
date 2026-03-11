
// interfaces
import { CreateAccountDTO, ForgotPasswordRequestDTO, RegisterDataReturn } from "@/interfaces/IAccount";
import { IAccountService } from "@/services/accountService";
import { IAuthService } from "@/services/authService";
import { INotificationService } from "@/services/notificationService";
export interface IAccountOrchestration {
    register(data: CreateAccountDTO): Promise<RegisterDataReturn>;
    forgotPasswordRequest(data: ForgotPasswordRequestDTO): Promise<void>;
}

export class AccountOrchestration implements IAccountOrchestration {
    constructor(
        private accountService: IAccountService,
        private authService: IAuthService,
        private notificationService: INotificationService,
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

    async forgotPasswordRequest(data: ForgotPasswordRequestDTO): Promise<void> {

        // find account
        const account = await this.accountService.getAccountByEmail(data.email);

        // generate verification token
        const verificationToken = await this.authService.generateVerificationToken(account.email);

        // send email
        await this.notificationService.sendForgotPasswordEmail(account.email, verificationToken);
    }
}