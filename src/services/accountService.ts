
// models
import { Account } from "@/models";
import { Op } from "sequelize";

// exceptions
import { ExistData, WrongFormat, DataNotFound } from "@/utils/exceptions";

// interfaces
import { AccountDataReturn, ChangeUsernameDTO, CreateAccountDTO, GetAccountByCredentialsDTO, ResetPasswordServiceDTO } from "@/interfaces/IAccount";
import { IHashProvider } from "@/provider/hashProvider";
import { IValidatorProvider } from "@/provider/validatorProvider";
export interface IAccountService {
    createAccount(data: CreateAccountDTO): Promise<AccountDataReturn>;
    getAccountByEmail(email: string): Promise<AccountDataReturn>;
    getAccountById(accountId: string): Promise<AccountDataReturn>;
    getAccountByCredentials(data: GetAccountByCredentialsDTO): Promise<AccountDataReturn>;
    resetPassword(data: ResetPasswordServiceDTO): Promise<void>;
    changeUsername(data: ChangeUsernameDTO): Promise<AccountDataReturn>;
}



export class AccountService implements IAccountService {
    constructor(
        private hashProvider: IHashProvider,
        private validatorProvider: IValidatorProvider,
    ) { }

    async createAccount(data: CreateAccountDTO): Promise<AccountDataReturn> {

        // check if email format is correct
        const emailFormatValid = this.validatorProvider.validateEmail(data.email);
        if (!emailFormatValid) {
            throw new WrongFormat("Invalid email format");
        }

        // check if email already exists
        const existingAccount = await Account.findOne({ where: { email: data.email } });
        if (existingAccount) {
            throw new ExistData("ACCOUNT001");
        }

        // hash password before storing
        const hashedPassword = await this.hashProvider.hashString(data.password)

        // create account record
        const account = await Account.create({
            email: data.email,
            password: hashedPassword,
            username: "",
        });

        return {
            accountId: account.account_id,
            username: account.username,
            email: account.email,
        };
    }

    async getAccountByEmail(email: string): Promise<AccountDataReturn> {
        const account = await Account.findOne({ where: { email, archived: false } });
        if (!account) throw new DataNotFound("Account not exist");

        return {
            accountId: account.account_id,
            username: account.username,
            email: account.email,
            password: account.password,
        }
    }

    async getAccountById(accountId: string): Promise<AccountDataReturn> {
        const account = await Account.findOne({ where: { account_id: accountId, archived: false } });
        if (!account) {
            throw new DataNotFound("Account not exist");
        }

        return {
            accountId: account.account_id,
            username: account.username,
            email: account.email,
        }
    }

    async getAccountByCredentials(data: GetAccountByCredentialsDTO): Promise<AccountDataReturn> {

        // get account by email or username
        const account = await Account.findOne({
            where: {
                archived: false,
                [Op.or]: [
                    { email: data.identifier },
                    { username: data.identifier },
                ],
            },
        });
        if (!account) throw new DataNotFound("ACCOUNT002");

        // check if password matches the stored hash
        const isPasswordValid = await this.hashProvider.compareHash(data.password, account.password);
        if (!isPasswordValid) throw new DataNotFound("ACCOUNT002");

        return {
            accountId: account.account_id,
            username: account.username,
            email: account.email,
        };
    }

    async resetPassword(data: ResetPasswordServiceDTO): Promise<void> {
        const account = await Account.findOne({
            where: {
                email: data.email,
                archived: false,
                password: data.key,
            }
        });
        if (!account) throw new DataNotFound("Account not exist");

        const hashedPassword = await this.hashProvider.hashString(data.newPassword);

        await account.update({ password: hashedPassword });
    }

    async changeUsername(data: ChangeUsernameDTO): Promise<AccountDataReturn> {

        // Get account
        const account = await Account.findOne({
            where: {
                account_id: data.accountId,
                archived: false,
            }
        });
        if (!account) throw new DataNotFound("Account not exist");

        // check username exist
        const existingUsername = await Account.findOne({
            where: {
                username: data.username,
                archived: false,
            }
        });
        if (existingUsername && existingUsername.account_id !== account.account_id) {
            throw new ExistData("ACCOUNT003");
        }

        await account.update({ username: data.username });

        return {
            accountId: account.account_id,
            username: account.username,
            email: account.email,
        }
    }
}
