import { IStorageProvider } from "@/provider/storageProvider";

// exceptions
import { Forbidden } from "@/utils/exceptions";

// interface
import { GetUploadUrlDTO, GetUploadUrlReturn } from "@/interfaces/IFile";
export interface IFileService {
    getUploadUrl(data: GetUploadUrlDTO, accountId: string): Promise<GetUploadUrlReturn>;
    moveTempFileToFinalLocation(tempKey: string, finalKey: string): Promise<string>;
    moveTempFileToFinalLocationBulk(files: { sourceKey: string; destinationKey: string }[]): Promise<string[]>;
    deleteFile(key: string): Promise<void>;
    deleteFilesBulk(keys: string[]): Promise<void>;
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

    async moveTempFileToFinalLocationBulk(files: { sourceKey: string; destinationKey: string }[]): Promise<string[]> {
        if (files.length === 0) return [];

        await this.storageProvider.copyFilesBulk(files);
        await this.storageProvider.deleteFilesBulk(files.map((file) => file.sourceKey));

        return files.map((file) => file.destinationKey);
    }

    async deleteFile(key: string): Promise<void> {
        if (!key) return;
        await this.storageProvider.deleteFile(key);
    }

    async deleteFilesBulk(keys: string[]): Promise<void> {
        if (keys.length === 0) return;
        await this.storageProvider.deleteFilesBulk(keys);
    }
}
