import { Op } from "sequelize";

// models
import { OtpAuth } from "@/models";


// utils
import { EventTypeEnum } from "@/utils/enums";

// exceptions
import { Forbidden, NotValid } from "@/utils/exceptions";

// interfaces
import { GenerateAccessTokenDTO, GenerateOtpDTO, VerifyOtpDTO } from "@/interfaces/IAuth"
import { IEventPublisherProvider } from "@/provider/eventPublisherProvider";
import { IJwtProvider } from "@/provider/jwtProvider";
export interface IAuthService {
    generateOtp(data: GenerateOtpDTO, skipColldown?: boolean): Promise<void>;
    generateVerificationToken(email: string): Promise<string>;
    verifyOtp(data: VerifyOtpDTO): Promise<string>;
    generateAccessToken(data: GenerateAccessTokenDTO): Promise<string>;
    generateRefreshToken(): Promise<string>;
}

export class AuthService implements IAuthService {
    constructor(
        private eventPublisherProvider: IEventPublisherProvider,
        private jwtProvider: IJwtProvider,
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

    async generateAccessToken(data: GenerateAccessTokenDTO): Promise<string> {
        const secret = process.env.JWT_VERIFICATION_SECRET;
        if (!secret) throw new Error("JWT_ACCESS_SECRET is not defined in environment");

        return this.jwtProvider.generateAccessToken({
            email: data.email,
            accountId: data.accountId,
            username: data.username,
        }, secret, "15m");
    }

    async generateRefreshToken(): Promise<string> {
        return "";
    }
}
