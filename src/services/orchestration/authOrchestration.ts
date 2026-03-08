import { Transaction } from "sequelize";

// interfaces
import { IAccountService } from "@/services/accountService";
import { IAuthService } from "@/services/authService";
import { LoginDataReturn, LoginDTO, VerifyOtpDTO, VerifyOtpReturn } from "@/interfaces/IAuth";
export interface IAuthOrchestration {
    generateNewOtp(email: string): Promise<void>;
    otpVerification(data: VerifyOtpDTO, transaction?: Transaction): Promise<VerifyOtpReturn>;
    login(data: LoginDTO): Promise<LoginDataReturn>;
    getNewAccessToken(identifier: string): Promise<string>;
}

export class AuthOrchestration implements IAuthOrchestration {
    constructor(
        private authService: IAuthService,
        private accountService: IAccountService,
    ) { }

    async generateNewOtp(email: string): Promise<void> {

        // check if account exist
        const account = await this.accountService.getAccountByEmail(email);

        // generate otp
        await this.authService.generateOtp({
            address: account.email,
        });
    }

    async otpVerification(data: VerifyOtpDTO, transaction?: Transaction): Promise<VerifyOtpReturn> {

        // verify otp
        const email = await this.authService.verifyOtp(data);

        // get account data
        const account = await this.accountService.getAccountByEmail(email);

        // generate access token
        const accessToken = await this.authService.generateAccessToken({
            accountId: account.accountId,
            username: account.username,
            email: account.email,
        });

        // generate refresh token
        const refreshToken = await this.authService.generateRefreshToken(account.accountId, transaction);

        return {
            accessToken,
            refreshToken,
        }
    }

    async login(data: LoginDTO): Promise<LoginDataReturn> {

        // check account
        const account = await this.accountService.getAccountByCredentials(data);

        // generate OTP
        await this.authService.generateOtp({ address: account.email }, true);

        // generate verification token
        const verificationToken = await this.authService.generateVerificationToken(account.email);

        return {
            verificationToken,
        }
    }

    async getNewAccessToken(identifier: string): Promise<string> {

        // get valid refresh token
        const refreshSession = await this.authService.getVaildRefreshSession(identifier);

        // get account data
        const account = await this.accountService.getAccountById(refreshSession.accountId);

        // generate new access token
        const accessToken = await this.authService.generateAccessToken({
            accountId: account.accountId,
            username: account.username,
            email: account.email,
        });

        return accessToken;
    }
}