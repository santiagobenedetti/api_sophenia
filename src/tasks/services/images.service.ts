import { Injectable, StreamableFile } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { GridFSBucket, ObjectId } from 'mongodb';
import { GridFSBucketWriteStream } from 'mongodb';

@Injectable()
export class ImagesService {
  private gridFsBucket: GridFSBucket;

  constructor(@InjectConnection() private readonly connection: Connection) {
    this.gridFsBucket = new GridFSBucket(this.connection.db, {
      bucketName: 'uploads',
    });
  }

  async findFileById(id: string): Promise<StreamableFile> {
    const _id = new ObjectId(id);

    const downloadStream = this.gridFsBucket.openDownloadStream(_id);

    return new StreamableFile(downloadStream);
  }

  async deleteFile(id: string): Promise<void> {
    const _id = new ObjectId(id);
    await this.gridFsBucket.delete(_id);
  }

  async saveFile(file: Express.Multer.File): Promise<string> {
    return new Promise((resolve, reject) => {
      const uploadStream: GridFSBucketWriteStream =
        this.gridFsBucket.openUploadStream(file.originalname);
      uploadStream.end(file.buffer);
      uploadStream.on('finish', () => resolve(uploadStream.id.toString()));
      uploadStream.on('error', reject);
    });
  }
}
