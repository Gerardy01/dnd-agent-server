

export interface CreateAccountDTO {
    email: string;
    password: string;
}

export type AccountDataReturn = {
    accountId: string;
    username: string;
    email: string;
}