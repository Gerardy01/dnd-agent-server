

export interface CreateAccountDTO {
    email: string;
    password: string;
}

export interface GetAccountByCredentialsDTO {
    identifier: string;
    password: string;
}

export interface ForgotPasswordRequestDTO {
    email: string;
}

export interface ResetPasswordDTO {
    token: string;
    newPassword: string;
}

export interface ResetPasswordServiceDTO {
    email: string;
    key: string;
    newPassword: string;
}

export interface ChangeUsernameDTO {
    accountId: string;
    username: string;
}

export type AccountDataReturn = {
    accountId: string;
    username: string;
    email: string;
    password?: string;
}

export type RegisterDataReturn = {
    verificationToken: string;
}

export type ForgotPasswordReturn = {
    verificationToken: string;
}