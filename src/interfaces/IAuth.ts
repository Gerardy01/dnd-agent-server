


export interface GenerateOtpDTO {
    address: string;
    expiredSec?: number;
}

export interface GenerateAccessTokenDTO {
    accountId: string;
    username: string;
    email: string;
}

export interface GenerateVerificationTokenDTO {
    email: string;
}

export interface VerifyOtpDTO {
    token: string;
    code: number;
}

export interface LoginDTO {
    identifier: string;
    password: string;
}

export type VerifyOtpReturn = {
    accessToken: string;
    refreshToken: string;
}

export type LoginDataReturn = {
    verificationToken: string;
}

export type RefreshSessionReturn = {
    id: number;
    accountId: string;
    tokenExpiry: Date;
    identifier: string;
}

export type AccessTokenBody = {
    accountId: string;
    username: string;
    email: string;
}