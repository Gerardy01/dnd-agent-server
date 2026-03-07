

export interface CreateAccountDTO {
    email: string;
    password: string;
}

export interface GetAccountByCredentialsDTO {
    identifier: string;
    password: string;
}

export type AccountDataReturn = {
    accountId: string;
    username: string;
    email: string;
}

export type RegisterDataReturn = {
    verificationToken: string;
}