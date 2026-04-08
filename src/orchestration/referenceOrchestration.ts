import { IReferenceService } from "@/services/referenceService";

// interfaces
import { ItemOptionsReturn, EffectOptionsReturn, FeatOptionsReturn } from "@/interfaces/IReference";

export interface IReferenceOrchestration {
    getItemOptions(): Promise<ItemOptionsReturn>;
    getEffectOptions(): Promise<EffectOptionsReturn>;
    getFeatOptions(): Promise<FeatOptionsReturn>;
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
}
