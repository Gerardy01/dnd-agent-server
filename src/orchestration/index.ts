// orchestration
import { AuthOrchestration } from "@/orchestration/authOrchestration";
import { AccountOrchestration } from "@/orchestration/accountOrchestration";
import { NotificationOrchestration } from "@/orchestration/notificationOrchestration";
import { WorkshopItemOrchestration } from "@/orchestration/workshopItemOrchestration";
import { WorkshopFeatOrchestration } from "@/orchestration/workshopFeatOrchestration";
import { WorkshopSpellOrchestration } from "@/orchestration/workshopSpellOrchestration";
import { WorkshopFactionOrchestration } from "@/orchestration/workshopFactionOrchestration";
import { WorkshopMonsterOrchestration } from "@/orchestration/workshopMonsterOrchestration";
import { ReferenceOrchestration } from "@/orchestration/referenceOrchestration";
import { FileOrchestration } from "@/orchestration/fileOrchestration";
import { WorkshopClassOrchestration } from "@/orchestration/workshopClassOrchestration";

// services
import {
    authService,
    accountService,
    notificationService,
    workshopItemService,
    workshopFeatService,
    workshopSpellService,
    workshopFactionService,
    workshopMonsterService,
    referenceService,
    fileService,
    workshopClassService,
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
    fileService,
);
export const featOrchestration = new WorkshopFeatOrchestration(
    workshopFeatService,
    fileService,
);
export const spellOrchestration = new WorkshopSpellOrchestration(
    workshopSpellService,
    fileService,
);
export const factionOrchestration = new WorkshopFactionOrchestration(
    workshopFactionService,
    fileService,
);
export const referenceOrchestration = new ReferenceOrchestration(
    referenceService,
);
export const fileOrchestration = new FileOrchestration(
    fileService,
);
export const monsterOrchestration = new WorkshopMonsterOrchestration(
    workshopMonsterService, 
    fileService
);
export const classOrchestration = new WorkshopClassOrchestration(
    workshopClassService,
    workshopSpellService,
    fileService
);
