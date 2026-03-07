


export interface GenerateOtpDTO {
    address: string;
    expiredSec?: number;
}

export interface GenerateVerificationTokenDTO {
    email: string;
}