import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Db, GridFSBucket, GridFSBucketReadStream, GridFSFile } from 'mongodb';
import { Connection, Types } from 'mongoose';

@Injectable()
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

  public async findOne(
    id: string,
  ): Promise<[GridFSFile, GridFSBucketReadStream]> {
    const object = await this.bucket
      .find({ _id: new Types.ObjectId(id) })
      .tryNext();

    const fileStream = this.bucket.openDownloadStream(object._id, {});

    return [object, fileStream];
  }
}
