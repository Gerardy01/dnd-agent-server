// services
import { AccountService } from "@/services/accountService";
import { AuthService } from "@/services/authService";
import { NotificationService } from "@/services/notificationService";
import { WorkshopItemService } from "@/services/workshopItemService";
import { ReferenceService } from "@/services/referenceService";
import { FileService } from "@/services/fileService";

// providers
import {
    bcryptHashProvider,
    validatorValidatorProvider,
    inMemoryEventPublisher,
    jwtProvider,
    cryptoCryptProvider,
    nodeMailerEmailProvider,
    cloudflareR2StorageProvider,
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
export const workshopItemService = new WorkshopItemService();
export const referenceService = new ReferenceService();
export const fileService = new FileService(cloudflareR2StorageProvider);