


export interface GetUploadUrlDTO {
    fileType: string;
    fileSize: number;
}

export interface GetPresignedUrlDTO {
    key: string;
    operation: 'put' | 'get';
    expiresIn?: number;
    contentType?: string;
    contentLength?: number;
}

export type GetUploadUrlReturn = {
    url: string;
    key: string;
}