import { WorkshopSpellDataReturn } from "@/interfaces/ISpell";

export interface MaxKnown {
    level: number;
    amount: number;
}

export interface SpellcastingProperties {
    spellcastingAbility: string;
    preparationType: string;
    spellcastingType: string;
    maxCantripKnown: MaxKnown[];
    maxSpellKnown: MaxKnown[];
    preparedLvlBonus: number;
    preparedModBonus: boolean;
}

export interface Features {
    name: string;
    description: string;
    level: number;
    type: string;
}

export interface ResourceRecoveryProps {
    value: number;
    type: string;
}

export interface ResourceRecovery {
    shortRest: ResourceRecoveryProps;
    longRest: ResourceRecoveryProps;
}

export interface CreateClassResourceDTO {
    image?: string;
    name: string;
    description: string;
    color: string;
    maxPerLevel: MaxKnown[];
    resourceRecovery: ResourceRecovery;
}

export interface CreateClassDTO {
    image?: string;
    name: string;
    description: string;
    hitDie: string;
    subclassLevel: number;
    spellcastingProperties: SpellcastingProperties | null;
    features: Features[];
}

export interface CreateClassPayload extends CreateClassDTO {
    resources: CreateClassResourceDTO[];
    spellIds: number[];
}

export interface WorkshopClassResourceDataReturn {
    id: number;
    workshopClassId: number;
    image: string;
    name: string;
    description: string;
    color: string;
    maxPerLevel: MaxKnown[];
    resourceRecovery: ResourceRecovery;
    createdAt?: Date;
}

export interface WorkshopClassDataReturn {
    workshopClassId: number;
    accountId: string;
    image: string;
    name: string;
    description: string;
    hitDie: string;
    subclassLevel: number;
    spellcastingProperties: SpellcastingProperties | null;
    features: Features[];
    createdAt?: Date;
}

export interface UpdateClassDTO extends CreateClassDTO {
    workshopClassId: number;
    isImageUpdated: boolean;
}

export interface UpdateClassPayload extends UpdateClassDTO {
    resources: CreateClassResourceDTO[];
    spellIds: number[];
}

export interface WorkshopClassDetailDataReturn extends WorkshopClassDataReturn {
    resources: WorkshopClassResourceDataReturn[];
    spells: WorkshopSpellDataReturn[];
}
