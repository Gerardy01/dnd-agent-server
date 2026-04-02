import { S3Client, PutObjectCommand, GetObjectCommand, CopyObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// interfaces
import { GetPresignedUrlDTO } from '@/interfaces/IFile';
export interface IStorageProvider {
    getPresignedUrl(data: GetPresignedUrlDTO): Promise<string>;
    copyFile(sourceKey: string, destinationKey: string): Promise<void>;
    deleteFile(key: string): Promise<void>;
}

export class CloudflareR2StorageProvider implements IStorageProvider {
    private client: S3Client;
    private bucketName: string;

    constructor() {
        this.bucketName = process.env.R2_BUCKET_NAME || '';

        this.client = new S3Client({
            region: 'auto',
            endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
            credentials: {
                accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
                secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
            },
        });
    }

    async getPresignedUrl(data: GetPresignedUrlDTO): Promise<string> {
        const command = data.operation === 'put'
            ? new PutObjectCommand({ Bucket: this.bucketName, Key: data.key, ContentType: data.contentType, ContentLength: data.contentLength })
            : new GetObjectCommand({ Bucket: this.bucketName, Key: data.key });

        return await getSignedUrl(this.client, command, { expiresIn: data.expiresIn || 3600 });
    }

    async copyFile(sourceKey: string, destinationKey: string): Promise<void> {
        const command = new CopyObjectCommand({
            Bucket: this.bucketName,
            CopySource: `${this.bucketName}/${sourceKey}`,
            Key: destinationKey,
        });

        await this.client.send(command);
    }

    async deleteFile(key: string): Promise<void> {
        const command = new DeleteObjectCommand({
            Bucket: this.bucketName,
            Key: key,
        });

        await this.client.send(command);
    }
}
