


export interface GetUploadUrlDTO {
    fileType: string;
}

export type GetUploadUrlReturn = {
    url: string;
    key: string;
}