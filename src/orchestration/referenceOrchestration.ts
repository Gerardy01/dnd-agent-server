import { IReferenceService } from "@/services/referenceService";

export interface IReferenceOrchestration {
    getItemOptions(): Promise<any>;
    getEffectOptions(): Promise<any>;
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
}
