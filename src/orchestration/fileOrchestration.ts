
// interfaces
import { GetUploadUrlDTO, GetUploadUrlReturn } from "@/interfaces/IFile";
import { IFileService } from "@/services/fileService";
interface IFileOrchestration {
    generateUploadUrl(data: GetUploadUrlDTO, accountId: string): Promise<GetUploadUrlReturn>;
}

export class FileOrchestration implements IFileOrchestration {
    constructor(
        private fileService: IFileService
    ) { }

    async generateUploadUrl(data: GetUploadUrlDTO, accountId: string): Promise<GetUploadUrlReturn> {
        return await this.fileService.getUploadUrl(data, accountId);
    }
}
