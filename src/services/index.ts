// services
import { AccountService } from "@/services/accountService";
import { AuthService } from "@/services/authService";
import { NotificationService } from "@/services/notificationService";
import { ItemService } from "@/services/itemService";

// providers
import {
    bcryptHashProvider,
    validatorValidatorProvider,
    inMemoryEventPublisher,
    jwtProvider,
    cryptoCryptProvider,
    nodeMailerEmailProvider,
} from "@/provider";

// services init
export const accountService = new AccountService(
    bcryptHashProvider,
    validatorValidatorProvider,
);
export const authService = new AuthService(
    inMemoryEventPublisher,
    jwtProvider,
    cryptoCryptProvider,
);
export const notificationService = new NotificationService(
    nodeMailerEmailProvider,
);
export const itemService = new ItemService();