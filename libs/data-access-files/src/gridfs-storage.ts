import { Inject } from '@nestjs/common';
import { Request } from 'express';
import { GridFSBucket, MongoClient, ObjectId } from 'mongodb';
import { StorageEngine } from 'multer';
import { Readable } from 'stream';

export class GridFsStorage implements StorageEngine {
  private bucket: GridFSBucket;
  private client: MongoClient;
  constructor(url: string) {
    this.client = new MongoClient(url);
    this.bucket = new GridFSBucket(this.client.db(), {
      bucketName: 'fs',
    });
  }

  _handleFile(
    req: Request,
    file: Express.Multer.File,
    callback: (error?: any, info?: Partial<Express.Multer.File>) => void,
  ): void {
    this.uploadOne(file);
  }

  _removeFile(
    req: Request,
    file: Express.Multer.File,
    callback: (error: Error | null) => void,
  ): void {
    throw new Error('Method not implemented.');
  }

  public async uploadOne(file: Express.Multer.File): Promise<ObjectId> {
    return Readable.from(file.buffer).pipe(
      this.bucket.openUploadStream(file.filename, {
        metadata: { type: file.mimetype },
      }),
    ).id;
  }

  public async uploadMany(files: Express.Multer.File[]): Promise<ObjectId[]> {
    const res = [];
    for (const file of files) {
      res.push(await this.uploadOne(file));
    }
    return res;
  }
}
