import { Injectable, Scope } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import {
  Db,
  GridFSBucket,
  GridFSBucketReadStream,
  GridFSFile,
  ObjectId,
} from 'mongodb';
import { Connection } from 'mongoose';
import { Readable } from 'stream';

@Injectable({ scope: Scope.REQUEST })
export class FilesService {
  private bucket: GridFSBucket;
  constructor(
    @InjectConnection()
    private readonly mongoConnection: Connection,
  ) {
    this.bucket = new GridFSBucket(this.mongoConnection.db as unknown as Db, {
      bucketName: 'fs',
    });
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
      res.push(this.uploadOne(file));
    }
    return res;
  }

  public async findOne(
    id: string,
  ): Promise<[GridFSFile, GridFSBucketReadStream]> {
    try {
      const object = await this.bucket
        .find({ _id: new ObjectId(id) })
        .tryNext();

      const fileStream = this.bucket.openDownloadStream(object._id, {});

      return [object, fileStream];
    } catch (error) {
      console.error(error);
    }
  }
}
