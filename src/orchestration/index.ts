// orchestration
import { AuthOrchestration } from "@/orchestration/authOrchestration";
import { AccountOrchestration } from "@/orchestration/accountOrchestration";
import { NotificationOrchestration } from "@/orchestration/notificationOrchestration";

// services
import { authService } from "@/services";
import { accountService } from "@/services";
import { notificationService } from "@/services";

// providers
import { InMemoryEventPublisher } from "@/provider/eventPublisherProvider";

// providers init
const inMemoryEventPublisher = new InMemoryEventPublisher();

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