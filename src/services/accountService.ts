
// models
import { Account } from "@/models";

// utils
import { EventTypeEnum } from "@/utils/enums";

// exceptions
import { ExistData, WrongFormat } from "@/utils/exceptions";

// interfaces
import { AccountDataReturn, CreateAccountDTO } from "@/interfaces/IAccount";
import { IHashProvider } from "@/provider/hashProvider";
import { IValidatorProvider } from "@/provider/validatorProvider";
import { IEventPublisherProvider } from "@/provider/eventPublisherProvider";
export interface IAccountService {
    createAccount(data: CreateAccountDTO): Promise<AccountDataReturn>;
    getAccountByEmail(email: string): Promise<Account | null>;
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
            throw new ExistData("ACCOUNT-001");
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

    async getAccountByEmail(email: string): Promise<Account | null> {
        return await Account.findOne({ where: { email, archived: false } });
    }
}
