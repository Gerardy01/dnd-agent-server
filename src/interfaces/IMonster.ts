


export interface CreateMonsterDTO {
    image?: string;
    name: string;
    alignment: string;
    size: string;
    type: string;
    description: string;
    appearance: string;
    languages?: string;
    speed: MonsterSpeed;
    senses: MonsterSenses;
    stats: MonsterStats;
    additionalProperties: AdditionalProperties;
    actions: MonsterAction[];
}

export interface UpdateMonsterDTO extends CreateMonsterDTO {
    workshopMonsterId: number;
    isImageUpdated: boolean;
}



export type AdditionalProperties = {
    immunities: string[];
    resistances: string[];
    vulnerabilities: string[];
    conditionImmunities: string[];
}

export type MonsterSpeed = {
    walk: number;
    burrow: number;
    climb: number;
    fly: number;
    swim: number;
}

export type MonsterSenses = {
    blindsight: number;
    darkvision: number;
    tremorsense: number;
    truesight: number;
}

export type MonsterStats = {
    minHp: number;
    maxHp: number;
    ac: number;
    cr: number;
    str: number;
    dex: number;
    con: number;
    int: number;
    wis: number;
    cha: number;
}

export type MonsterAction = {
    name: string;
    description: string;
}

export type WorkshopMonsterDataReturn = {
    workshopMonsterId: number;
    accountId: string;
    image: string | null;
    name: string;
    alignment: string;
    size: string;
    type: string;
    description: string;
    appearance: string;
    languages: string | null;
    speed: MonsterSpeed;
    senses: MonsterSenses;
    stats: MonsterStats;
    additionalProperties: AdditionalProperties;
    actions: MonsterAction[];
    createdAt: Date;
}
