
export interface CreateFeatDTO {
    image?: string;
    name: string;
    description: string;
    category: string;
    minLevel: number | null;
}

export interface UpdateFeatDTO {
    workshopFeatId: number;
    image?: string;
    isImageUpdated: boolean;
    name: string;
    description: string;
    category: string;
    minLevel: number | null;
}

export type WorkshopFeatDataReturn = {
    workshopFeatId: number;
    accountId: string;
    image: string | null;
    name: string;
    description: string;
    category: string;
    minLevel: number | null;
    createdAt: Date;
}
