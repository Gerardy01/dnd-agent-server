import { IStorageProvider } from "@/provider/storageProvider";

// exceptions
import { Forbidden } from "@/utils/exceptions";

// interface
import { GetUploadUrlDTO, GetUploadUrlReturn } from "@/interfaces/IFile";
export interface IFileService {
    getUploadUrl(data: GetUploadUrlDTO, accountId: string): Promise<GetUploadUrlReturn>;
    moveTempFileToFinalLocation(tempKey: string, finalKey: string): Promise<string>;
    deleteFile(key: string): Promise<void>;
}


export class FileService implements IFileService {
    constructor(
        private storageProvider: IStorageProvider
    ) { }

    async getUploadUrl(data: GetUploadUrlDTO, accountId: string): Promise<GetUploadUrlReturn> {

        const maxFileSize = parseInt(process.env.MAX_FILE_SIZE || '10485760');
        if (data.fileSize > maxFileSize) {
            throw new Forbidden("FILE001");
        }

        const key = `user/temp/${accountId}-${Date.now()}`;
        const url = await this.storageProvider.getPresignedUrl({
            key,
            operation: 'put',
            expiresIn: 60 * 15,
            contentType: data.fileType,
            contentLength: data.fileSize,
        });

        return { url, key };
    }

    async moveTempFileToFinalLocation(tempKey: string, finalKey: string): Promise<string> {
        if (!tempKey) return "";

        await this.storageProvider.copyFile(tempKey, finalKey);
        await this.storageProvider.deleteFile(tempKey);

        return finalKey;
    }

    async deleteFile(key: string): Promise<void> {
        if (!key) return;
        await this.storageProvider.deleteFile(key);
    }
}
