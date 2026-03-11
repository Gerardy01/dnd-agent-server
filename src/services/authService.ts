import { Op, Transaction } from "sequelize";

// models
import { OtpAuth, RefreshToken } from "@/models";


// utils
import { EventTypeEnum } from "@/utils/enums";

// exceptions
import { Forbidden, NotValid } from "@/utils/exceptions";

// interfaces
import { AccessTokenBody, GenerateAccessTokenDTO, GenerateOtpDTO, GenerateResetPassTokenDTO, RefreshSessionReturn, VerifyOtpDTO, VerifyResetPassTokenReturn } from "@/interfaces/IAuth"
import { IEventPublisherProvider } from "@/provider/eventPublisherProvider";
import { IJwtProvider } from "@/provider/jwtProvider";
import { ICryptProvider } from "@/provider/cryptProvider";
export interface IAuthService {
    generateOtp(data: GenerateOtpDTO, skipColldown?: boolean): Promise<void>;
    generateVerificationToken(email: string): Promise<string>;
    generateResetPassToken(data: GenerateResetPassTokenDTO): Promise<string>;
    verifyOtp(data: VerifyOtpDTO): Promise<string>;
    generateAccessToken(data: GenerateAccessTokenDTO): Promise<string>;
    generateRefreshToken(accountId: string, transaction?: Transaction): Promise<string>;
    getVaildRefreshSession(identifier: string): Promise<RefreshSessionReturn>;
    verifyAccessToken(accessToken: string): Promise<AccessTokenBody>;
    verifyResetPassToken(token: string): Promise<VerifyResetPassTokenReturn>;
}

export class AuthService implements IAuthService {
    constructor(
        private eventPublisherProvider: IEventPublisherProvider,
        private jwtProvider: IJwtProvider,
        private cryptProvider: ICryptProvider,
    ) { }

    async generateOtp(data: GenerateOtpDTO, skipColldown = false): Promise<void> {
        const expiredSec = data.expiredSec ?? Number(process.env.OTP_EXPIRED_SEC) ?? 300;

        // generate 6 digit random number, retry until unique code found
        let code: number;
        let isCodeTaken: boolean;
        do {
            code = Math.floor(100000 + Math.random() * 900000);

            // check if an active, non-expired OTP with the same code already exists
            const existOtp = await OtpAuth.findOne({
                where: {
                    code,
                    revoked: false,
                    expires_at: { [Op.gt]: new Date() },
                },
            });

            isCodeTaken = existOtp !== null;
        } while (isCodeTaken);

        // check if the address already has an active (non-revoked) OTP
        const existingOtp = await OtpAuth.findOne({
            where: { send_to: data.address, revoked: false },
        });

        // if exists, check cooldown then revoke it
        if (existingOtp) {
            const createdAt = existingOtp.createdAt;
            const secondsSinceCreated = (Date.now() - new Date(createdAt).getTime()) / 1000;

            if (secondsSinceCreated < 15 && skipColldown) {
                return;
            }

            if (secondsSinceCreated < 15 && !skipColldown) {
                throw new Forbidden("AUTH001");
            }

            await existingOtp.update({ revoked: true });
        }

        // create the new OTP
        const expiresAt = new Date(Date.now() + expiredSec * 1000);
        const otp = await OtpAuth.create({
            code,
            send_to: data.address,
            expires_at: expiresAt,
        });

        // broadcast otp generated event
        await this.eventPublisherProvider.publish({
            type: EventTypeEnum.OTP_GENERATED,
            payload: {
                address: otp.send_to,
                code: otp.code,
            },
        });
    }

    async generateVerificationToken(email: string): Promise<string> {
        const secret = process.env.JWT_VERIFICATION_SECRET;
        if (!secret) throw new Error("JWT_VERIFICATION_SECRET is not defined in environment");

        return this.jwtProvider.generateVerificationToken({ email }, secret, "5m");
    }

    async verifyOtp(data: VerifyOtpDTO): Promise<string> {
        const secret = process.env.JWT_VERIFICATION_SECRET;
        if (!secret) throw new Error("JWT_VERIFICATION_SECRET is not defined in environment");

        const decoded = await this.jwtProvider.validateToken(data.token, secret);
        if (!decoded) throw new NotValid("Token not valid");

        const otp = await OtpAuth.findOne({
            where: {
                code: data.code,
                send_to: decoded.email,
                revoked: false,
                expires_at: { [Op.gt]: new Date() },
            },
        });

        if (!otp) throw new Forbidden("AUTH002");

        await otp.update({ revoked: true });

        return otp.send_to;
    }

    async generateResetPassToken(data: GenerateResetPassTokenDTO): Promise<string> {
        const secret = process.env.JWT_VERIFICATION_SECRET;
        if (!secret) throw new Error("JWT_VERIFICATION_SECRET is not defined in environment");

        return this.jwtProvider.generateResetPassToken(data, secret, "5m");
    }

    async generateAccessToken(data: GenerateAccessTokenDTO): Promise<string> {
        const secret = process.env.JWT_VERIFICATION_SECRET;
        if (!secret) throw new Error("JWT_ACCESS_SECRET is not defined in environment");

        return this.jwtProvider.generateAccessToken({
            email: data.email,
            accountId: data.accountId,
            username: data.username,
        }, secret, "15m");
    }

    async generateRefreshToken(accountId: string, transaction?: Transaction): Promise<string> {

        // check and revoke session if >= 3 active sessions detected
        await this.checkAndRevokeSession(accountId, 3, transaction);

        // generate a cryptographically secure random identifier
        const identifier = this.cryptProvider.generateRandomString();

        // resolve expiry from env (in days) or fall back to 7 days
        const tokenExpiryDate = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000);

        await RefreshToken.create({
            account_id: accountId,
            identifier,
            token_expiry_date: tokenExpiryDate,
            user_agent: "",
            is_revoked: false,
        }, { transaction: transaction ?? null });

        return identifier;
    }

    async getVaildRefreshSession(identifier: string): Promise<RefreshSessionReturn> {

        const refreshSession = await RefreshToken.findOne({
            where: {
                identifier: identifier,
                is_revoked: false,
                token_expiry_date: { [Op.gt]: new Date() },
            },
        });

        if (!refreshSession) {
            throw new NotValid("Refresh token is not valid");
        }

        return {
            id: refreshSession.id,
            accountId: refreshSession.account_id,
            tokenExpiry: refreshSession.token_expiry_date,
            identifier: refreshSession.identifier,
        }
    }

    async verifyAccessToken(accessToken: string): Promise<AccessTokenBody> {
        const secret = process.env.JWT_VERIFICATION_SECRET;
        if (!secret) throw new Error("JWT_VERIFICATION_SECRET is not defined in environment");

        const decoded = await this.jwtProvider.validateToken(accessToken, secret);
        if (!decoded) throw new NotValid("Access token is not valid");

        return decoded;
    }

    async verifyResetPassToken(token: string): Promise<VerifyResetPassTokenReturn> {
        const secret = process.env.JWT_VERIFICATION_SECRET;
        if (!secret) throw new Error("JWT_VERIFICATION_SECRET is not defined in environment");

        const decoded = await this.jwtProvider.validateToken(token, secret);
        if (!decoded) throw new NotValid("Token not valid");

        return decoded;
    }

    private async checkAndRevokeSession(accountId: string, cap: number = 3, transaction?: Transaction): Promise<void> {

        const sessionList = await RefreshToken.findAll({
            where: {
                account_id: accountId,
                is_revoked: false,
                token_expiry_date: { [Op.gt]: new Date() },
            },
            order: [['created_at', 'ASC']]
        });

        if (sessionList.length < cap) return;

        const oldestSession = sessionList[0];
        if (!oldestSession) return;

        oldestSession.is_revoked = true;
        await oldestSession.save({ transaction: transaction ?? null });
    }
}
