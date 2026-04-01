import { IStorageProvider } from "@/provider/storageProvider";

// interface
import { GetUploadUrlDTO, GetUploadUrlReturn } from "@/interfaces/IFile";
export interface IFileService {
    getUploadUrl(data: GetUploadUrlDTO, accountId: string): Promise<GetUploadUrlReturn>;
}


export class FileService implements IFileService {
    constructor(
        private storageProvider: IStorageProvider
    ) { }

    async getUploadUrl(data: GetUploadUrlDTO, accountId: string): Promise<GetUploadUrlReturn> {
        const key = `user/temp/${accountId}-${Math.random().toString(36).substring(2, 15)}`;

        const url = await this.storageProvider.getPresignedUrl(key, 'put', 60 * 15, data.fileType);
        return { url, key };
    }
}
