import { IReferenceService } from "@/services/referenceService";

// interfaces
import { 
    ItemOptionsReturn, 
    EffectOptionsReturn, 
    FeatOptionsReturn, 
    SpellOptionsReturn,
    MonsterOptionsReturn 
} from "@/interfaces/IReference";

export interface IReferenceOrchestration {
    getItemOptions(): Promise<ItemOptionsReturn>;
    getEffectOptions(): Promise<EffectOptionsReturn>;
    getFeatOptions(): Promise<FeatOptionsReturn>;
    getSpellOptions(): Promise<SpellOptionsReturn>;
    getMonsterOptions(): Promise<MonsterOptionsReturn>;
}

export class ReferenceOrchestration implements IReferenceOrchestration {
    constructor(
        private referenceService: IReferenceService,
    ) { }

    async getItemOptions() {
        return await this.referenceService.getItemOptions();
    }

    async getEffectOptions() {
        return await this.referenceService.getEffectOptions();
    }

    async getFeatOptions() {
        return await this.referenceService.getFeatOptions();
    }

    async getSpellOptions() {
        return await this.referenceService.getSpellOptions();
    }

    async getMonsterOptions() {
        return await this.referenceService.getMonsterOptions();
    }
}
