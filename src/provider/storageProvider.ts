import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export interface IStorageProvider {
    getPresignedUrl(key: string, operation: 'put' | 'get', expiresIn?: number, contentType?: string): Promise<string>;
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

    async getPresignedUrl(key: string, operation: 'put' | 'get' = 'put', expiresIn: number = 3600, contentType?: string): Promise<string> {
        const command = operation === 'put'
            ? new PutObjectCommand({ Bucket: this.bucketName, Key: key, ContentType: contentType })
            : new GetObjectCommand({ Bucket: this.bucketName, Key: key });

        return await getSignedUrl(this.client, command, { expiresIn });
    }
}
