
// utils
import { EventTypeEnum } from "@/utils/enums";
import { DataNotFound } from "@/utils/exceptions";

// interfaces
import { IAccountService } from "@/services/accountService";
import { IAuthService } from "@/services/authService";
import { DomainEventDTO, IEventPublisherProvider } from "@/provider/eventPublisherProvider";
export interface IAuthOrchestration {
    generateNewOtp(email: string): Promise<void>;
}

export class AuthOrchestration implements IAuthOrchestration {
    constructor(
        private authService: IAuthService,
        private accountService: IAccountService,
        private eventPublisherProvider: IEventPublisherProvider,
    ) {
        eventPublisherProvider.subscribe(EventTypeEnum.ACCOUNT_CREATED, this.accountCreatedEventHandler.bind(this));
    }

    async generateNewOtp(email: string): Promise<void> {
        const account = await this.accountService.getAccountByEmail(email);
        if (!account) {
            throw new DataNotFound("AUTH-001");
        }

        await this.authService.generateOtp({
            address: email,
        })
    }

    private async accountCreatedEventHandler(event: DomainEventDTO): Promise<void> {
        const { email } = event.payload;

        await this.authService.generateOtp({
            address: email,
        })
    }
}