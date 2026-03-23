// orchestration
import { AuthOrchestration } from "@/orchestration/authOrchestration";
import { AccountOrchestration } from "@/orchestration/accountOrchestration";
import { NotificationOrchestration } from "@/orchestration/notificationOrchestration";
import { WorkshopItemOrchestration } from "@/orchestration/workshopItemOrchestration";

// services
import {
    authService,
    accountService,
    notificationService,
    workshopItemService,
} from "@/services";

// providers
import {
    inMemoryEventPublisher
} from "@/provider";



// orchestration init
export const authOrchestration = new AuthOrchestration(
    authService,
    accountService,
);
export const accountOrchestration = new AccountOrchestration(
    accountService,
    authService,
    notificationService,
);
export const notificationOrchestration = new NotificationOrchestration(
    notificationService,
    inMemoryEventPublisher,
);
export const itemOrchestration = new WorkshopItemOrchestration(
    workshopItemService,
);