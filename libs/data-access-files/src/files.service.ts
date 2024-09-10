import { Inject, Injectable, Scope } from '@nestjs/common';
import {
  GridFSBucket,
  GridFSBucketReadStream,
  GridFSFile,
  MongoClient,
  ObjectId,
} from 'mongodb';
import { Readable } from 'stream';

@Injectable({ scope: Scope.REQUEST })
export class FilesService {
  private bucket: GridFSBucket;
  constructor(@Inject('MONGO_CLIENT') private readonly client: MongoClient) {
    this.bucket = new GridFSBucket(this.client.db(), {
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
      res.push(await this.uploadOne(file));
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
