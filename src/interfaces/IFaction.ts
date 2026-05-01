
export interface CreateFactionDTO {
    image?: string;
    name: string;
    description: string;
    color: string;
}

export interface UpdateFactionDTO {
    workshopFactionId: number;
    image?: string;
    isImageUpdated: boolean;
    name: string;
    description: string;
    color: string;
}

export type WorkshopFactionDataReturn = {
    workshopFactionId: number;
    accountId: string;
    image: string | null;
    name: string;
    description: string;
    color: string;
    createdAt: Date;
}
