
// interfaces
import { CreateAccountDTO, ForgotPasswordRequestDTO, ForgotPasswordReturn, RegisterDataReturn, ResetPasswordDTO } from "@/interfaces/IAccount";
import { IAccountService } from "@/services/accountService";
import { IAuthService } from "@/services/authService";
import { INotificationService } from "@/services/notificationService";
export interface IAccountOrchestration {
    register(data: CreateAccountDTO): Promise<RegisterDataReturn>;
    forgotPasswordRequest(data: ForgotPasswordRequestDTO): Promise<ForgotPasswordReturn>;
    resetPassword(data: ResetPasswordDTO): Promise<void>;
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

    async forgotPasswordRequest(data: ForgotPasswordRequestDTO): Promise<ForgotPasswordReturn> {

        // find account
        const account = await this.accountService.getAccountByEmail(data.email);

        // generate verification token
        const verificationToken = await this.authService.generateResetPassToken({
            email: account.email,
            key: account.password!,
        });

        // send email
        await this.notificationService.sendForgotPasswordEmail(account.email, verificationToken);

        return {
            verificationToken: verificationToken
        }
    }

    async resetPassword(data: ResetPasswordDTO): Promise<void> {

        // verify otp
        const verifyData = await this.authService.verifyResetPassToken(data.token);

        // update password
        await this.accountService.resetPassword({
            email: verifyData.email,
            key: verifyData.key,
            newPassword: data.newPassword,
        });
    }
}