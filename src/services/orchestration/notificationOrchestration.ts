
// utils
import { EventTypeEnum } from "@/utils/enums";

// interfaces
import { DomainEventDTO, IEventPublisherProvider } from "@/provider/eventPublisherProvider";
import { INotificationService } from "@/services/notificationService";
export interface INotificationOrchestration {

}

// class
export class NotificationOrchestration implements INotificationOrchestration {
    constructor(
        private notificationService: INotificationService,
        private eventPublisher: IEventPublisherProvider,
    ) {
        // eventPublisher.subscribe(EventTypeEnum.OTP_GENERATED, this.handleSendOtpEmail.bind(this));
    }

    private async handleSendOtpEmail(event: DomainEventDTO) {
        const { address, code } = event.payload;
        await this.notificationService.sendOtpEmail(address, code);
    }
}