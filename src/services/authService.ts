import { Op } from "sequelize";

// models
import { OtpAuth } from "@/models";

// utils
import { EventTypeEnum } from "@/utils/enums";

// exceptions
import { Forbidden } from "@/utils/exceptions";

// interfaces
import { GenerateOtpDTO } from "@/interfaces/IAuth"
import { IEventPublisherProvider } from "@/provider/eventPublisherProvider";
export interface IAuthService {
    generateOtp(data: GenerateOtpDTO): Promise<void>
}

export class AuthService implements IAuthService {
    constructor(
        private eventPublisherProvider: IEventPublisherProvider,
    ) { }

    async generateOtp(data: GenerateOtpDTO): Promise<void> {
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

            if (secondsSinceCreated < 30) {
                throw new Forbidden("AUTH-002");
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
}
