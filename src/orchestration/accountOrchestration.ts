
// interfaces
import { AccountDataReturn, ChangeUsernameDTO, CreateAccountDTO, ForgotPasswordRequestDTO, RegisterDataReturn, ResetPasswordDTO } from "@/interfaces/IAccount";
import { IAccountService } from "@/services/accountService";
import { IAuthService } from "@/services/authService";
import { INotificationService } from "@/services/notificationService";
export interface IAccountOrchestration {
    getUserAccount(accountId: string): Promise<AccountDataReturn>;
    register(data: CreateAccountDTO): Promise<RegisterDataReturn>;
    forgotPasswordRequest(data: ForgotPasswordRequestDTO): Promise<void>;
    resetPassword(data: ResetPasswordDTO): Promise<void>;
    changeUsername(data: ChangeUsernameDTO): Promise<AccountDataReturn>;
}

export class AccountOrchestration implements IAccountOrchestration {
    constructor(
        private accountService: IAccountService,
        private authService: IAuthService,
        private notificationService: INotificationService,
    ) { }

    async getUserAccount(accountId: string): Promise<AccountDataReturn> {
        return await this.accountService.getAccountById(accountId);
    }

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
        const verificationToken = await this.authService.generateResetPassToken({
            email: account.email,
            key: account.password!,
        });

        // send email
        await this.notificationService.sendForgotPasswordEmail(account.email, verificationToken);

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

    async changeUsername(data: ChangeUsernameDTO): Promise<AccountDataReturn> {
        return await this.accountService.changeUsername(data);
    }
}