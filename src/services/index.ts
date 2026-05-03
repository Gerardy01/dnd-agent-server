// services
import { AccountService } from "@/services/accountService";
import { AuthService } from "@/services/authService";
import { NotificationService } from "@/services/notificationService";
import { WorkshopItemService } from "@/services/workshopItemService";
import { WorkshopFeatService } from "@/services/workshopFeatService";
import { WorkshopSpellService } from "@/services/workshopSpellService";
import { WorkshopFactionService } from "@/services/workshopFactionService";
import { WorkshopMonsterService } from "@/services/workshopMonsterService";
import { ReferenceService } from "@/services/referenceService";
import { FileService } from "@/services/fileService";
import { WorkshopClassService } from "@/services/workshopClassService";

// providers
import {
    bcryptHashProvider,
    validatorValidatorProvider,
    inMemoryEventPublisher,
    jwtProvider,
    cryptoCryptProvider,
    nodeMailerEmailProvider,
    cloudflareR2StorageProvider,
    googleOauthProvider,
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
    googleOauthProvider,
);
export const notificationService = new NotificationService(
    nodeMailerEmailProvider,
);
export const workshopItemService = new WorkshopItemService();
export const workshopFeatService = new WorkshopFeatService();
export const workshopSpellService = new WorkshopSpellService();
export const workshopFactionService = new WorkshopFactionService();
export const referenceService = new ReferenceService();
export const fileService = new FileService(cloudflareR2StorageProvider);
export const workshopMonsterService = new WorkshopMonsterService();
export const workshopClassService = new WorkshopClassService();
