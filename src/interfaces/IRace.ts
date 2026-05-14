import { WorkshopSpellDataReturn } from "@/interfaces/ISpell";

export interface MaxKnown {
    level: number;
    amount: number;
}

export interface ResourceRecoveryProps {
    value: number;
    type: string;
}

export interface ResourceRecovery {
    shortRest: ResourceRecoveryProps;
    longRest: ResourceRecoveryProps;
}

export interface Traits {
    name: string;
    description: string;
    level: number;
    type: string;
}

export interface SpellcastingProperties {
    spellcastingAbility: string;
}


export interface CreateRaceDTO {
    image?: string;
    name: string;
    description: string;
    speed: number;
    language: string;
    spellcastingProperties: SpellcastingProperties | null;
    traits: Traits[];
}

export interface CreateRacePayload extends CreateRaceDTO {
    spellIds: number[];
}


export interface WorkshopRaceDataReturn {
    workshopRaceId: number;
    accountId: string;
    image: string;
    name: string;
    description: string;
    speed: number;
    language: string;
    spellcastingProperties: SpellcastingProperties | null;
    traits: Traits[];
    createdAt?: Date;
}

export interface UpdateRaceDTO extends CreateRaceDTO {
    workshopRaceId: number;
    isImageUpdated: boolean;
}

export interface UpdateRacePayload extends UpdateRaceDTO {
    spellIds: number[];
}

export interface WorkshopRaceDetailDataReturn extends WorkshopRaceDataReturn {
    spells: WorkshopSpellDataReturn[];
}

export interface AddTraitsPayload {
    workshopRaceId: number;
    trait: Traits;
}

export interface EditTraitsPayload {
    workshopRaceId: number;
    currentTrait: Traits;
    newTrait: Traits;
}

export interface DeleteTraitsPayload {
    workshopRaceId: number;
    trait: Traits;
}
