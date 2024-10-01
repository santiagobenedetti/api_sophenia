import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  MulterModuleOptions,
  MulterOptionsFactory,
} from '@nestjs/platform-express';
import { GridFsStorage } from 'multer-gridfs-storage';
import * as path from 'path';
import * as crypto from 'crypto';

@Injectable()
export class GridFsStorageConfigService implements MulterOptionsFactory {
  constructor(private configService: ConfigService) {}

  createMulterOptions(): MulterModuleOptions {
    const url = this.configService.get<string>('MONGO_URI');

    const storage = new GridFsStorage({
      url,
      file: (req, file) => {
        return new Promise((resolve, reject) => {
          crypto.randomBytes(16, (err, buf) => {
            if (err) {
              return reject(err);
            }
            const filename =
              buf.toString('hex') + path.extname(file.originalname);
            const fileInfo = {
              filename: filename,
              bucketName: 'uploads', // bucket name for GridFS collection
            };
            resolve(fileInfo);
          });
        });
      },
    });

    return { storage };
  }
}
