

export type DamageRoll = {
    count: number;
    dice: number;
    bonus: number;
    damageType: string;
}

export type WeaponProperties = {
    damageRoll: DamageRoll[];
    light: boolean;
    heavy: boolean;
    finesse: boolean;
    thrown: boolean;
    twoHanded: boolean;
    range: {
        normal: number;
        long: number;
    } | null;
    versatileDamageRoll: DamageRoll | null;
    ammunition: boolean;
    loading: boolean;
    reach: boolean;
}


export type ArmorProperties = {
    baseAc: number;
    strengthReq: number;
    modifier: {
        dexMod: boolean;
        conMod: boolean;
        wisMod: boolean;
    };
    flatAcBonus: number;
    maxModifier: number;
    other: {
        stealthDisadvantage: boolean;
    }
}


export type AdditionalProperties = {
    immunities: string[];
    resistances: string[];
    vulnerabilities: string[];
    conditionImmunities: string[];
}



export type ItemBonus = {

}
