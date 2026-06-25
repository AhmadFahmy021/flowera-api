import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from 'minio';
import * as path from 'path';

@Injectable()
export class MinioService {
  private client: Client;

  constructor(
    private readonly config: ConfigService,
  ) {
    this.client = new Client({
      endPoint:
        this.config.get<string>(
          'MINIO_ENDPOINT',
        )!,
      port: Number(
        this.config.get(
          'MINIO_PORT',
        ),
      ),
      useSSL:
        this.config.get(
          'MINIO_USE_SSL',
        ) === 'true',
      accessKey:
        this.config.get<string>(
          'MINIO_ACCESS_KEY',
        )!,
      secretKey:
        this.config.get<string>(
          'MINIO_SECRET_KEY',
        )!,
    });
  }

  async upload(
    folder: string,
    file: Express.Multer.File,
    ) {
    const bucket =
        this.config.get<string>(
        'MINIO_BUCKET',
        )!;

    const ext = path.extname(
        file.originalname,
    );

    const filename =
        `${Date.now()}${ext}`;

    const objectName =
        `${folder}/${filename}`;

    await this.client.putObject(
        bucket,
        objectName,
        file.buffer,
        file.size,
    );

    // return {
    //     filename,
    //     objectName,
    //     url: `http://${this.config.get(
    //     'MINIO_ENDPOINT',
    //     )}:${this.config.get(
    //     'MINIO_PORT',
    //     )}/${bucket}/${objectName}`,
    // };
    return {
        filename,
        objectName,
        path: `/${objectName}`,
        };
    }

    // async delete(objectName: string) {
    //     const bucket =
    //         this.config.get<string>(
    //         'MINIO_BUCKET',
    //         )!;
    //     console.log(bucket);
    //     console.log(objectName);
        

    //     await this.client.removeObject(
    //         bucket,
    //         objectName,
    //     );
    // }
  //   async delete(objectName: string) {
  //     const bucket = this.config.get<string>('MINIO_BUCKET')!;

  //     console.log('Bucket:', bucket);
  //     console.log('Object:', objectName);

  //     try {
  //         await this.client.statObject(bucket, objectName);
  //         console.log('Object ditemukan');

  //         await this.client.removeObject(bucket, objectName);

  //         console.log('Delete berhasil');
  //     } catch (error) {
  //         console.error(error);
  //         throw error;
  //     }
  // }
  async delete(objectName: string) {
    const bucket = this.config.get<string>('MINIO_BUCKET')!;

    try {
        await this.client.removeObject(
            bucket,
            objectName,
        );
    } catch (error: any) {
        if (error.code !== 'NotFound') {
            throw new InternalServerErrorException(
                'Failed to delete file from storage',
            );
        }

        // Kalau file memang tidak ada, cukup log
        console.warn(
            `Object ${objectName} tidak ditemukan di MinIO`,
        );
    }
}
}