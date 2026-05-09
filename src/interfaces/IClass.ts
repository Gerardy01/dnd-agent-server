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

export interface ClassResourceDTO {
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
    resources: ClassResourceDTO[];
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
    resources: ClassResourceDTO[];
    spellIds: number[];
}

export interface WorkshopClassDetailDataReturn extends WorkshopClassDataReturn {
    resources: WorkshopClassResourceDataReturn[];
    spells: WorkshopSpellDataReturn[];
}

export interface AddFeaturePayload {
    workshopClassId: number;
    feature: Features;
}

export interface EditFeaturePayload {
    workshopClassId: number;
    currentFeature: Features;
    newFeature: Features;
}

export interface DeleteFeaturePayload {
    workshopClassId: number;
    feature: Features;
}

export interface AddResourcePayload {
    workshopClassId: number;
    resource: ClassResourceDTO;
}

export interface EditResourcePayload {
    workshopClassId: number;
    classResourceId: number;
    resource: ClassResourceDTO;
}

export interface DeleteResourcePayload {
    workshopClassId: number;
    classResourceId: number;
}

export type ClassResourceReturn = {
    id: number;
    image: string | null;
    name: string;
    description: string;
    color: string;
    maxPerLevel: MaxKnown[];
    resourceRecovery: ResourceRecovery;
}

export interface CreateClassSubDTO {
    workshopClassId: number;
    image?: string;
    name: string;
    description: string;
    spellcastingProperties: SpellcastingProperties | null;
    features: Features[];
}

export interface CreateClassSubPayload extends CreateClassSubDTO {
    resources: ClassResourceDTO[];
    spellIds: number[];
}

export interface WorkshopClassSubResourceDataReturn {
    id: number;
    workshopClassSubId: number;
    image: string;
    name: string;
    description: string;
    color: string;
    maxPerLevel: MaxKnown[];
    resourceRecovery: ResourceRecovery;
    createdAt?: Date;
}

export interface WorkshopClassSubDataReturn {
    id: number;
    workshopClassId: number;
    image: string;
    name: string;
    description: string;
    spellcastingProperties: SpellcastingProperties | null;
    features: Features[];
    createdAt?: Date;
}

export interface UpdateClassSubDTO extends CreateClassSubDTO {
    id: number;
    isImageUpdated: boolean;
}

export interface UpdateClassSubPayload extends UpdateClassSubDTO {
    resources: ClassResourceDTO[];
    spellIds: number[];
}

export interface WorkshopClassSubDetailDataReturn extends WorkshopClassSubDataReturn {
    resources: WorkshopClassSubResourceDataReturn[];
    spells: WorkshopSpellDataReturn[];
}
