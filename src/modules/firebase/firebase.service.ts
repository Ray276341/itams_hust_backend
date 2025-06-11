import { Injectable, Logger } from '@nestjs/common';
import { Bucket } from '@google-cloud/storage';
import * as firebase from 'firebase-admin';
import { applicationDefault } from 'firebase-admin/app';
import { getStorage } from 'firebase-admin/storage';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FirebaseService {
  //#region Fields
  private logger = new Logger(FirebaseService.name);
  //#endregion

  bucket: Bucket;
  constructor() {
    const raw = JSON.parse(process.env.FIREBASE_CREDENTIALS_JSON);
    raw.private_key = raw.private_key.replace(/\\n/g, '\n');

    const app = firebase.initializeApp({
      credential: firebase.credential.cert(raw),
      storageBucket: process.env.FIREBASE_STORAGEBUCKET,
    });
    this.bucket = getStorage(app).bucket();
  }

  async uploadFile(file: Express.Multer.File, path = '') {
    try {
      const formatFileName = file.originalname.replace(/\s/g, '');
      const indexOfMime: number = formatFileName.indexOf('.', -5);
      const filename: string =
        formatFileName.slice(0, indexOfMime) +
        uuidv4() +
        formatFileName.slice(indexOfMime);
      const bucketFile = this.bucket.file(`${path}/${filename}`);
      await bucketFile.save(file.buffer, {
        public: true,
        metadata: { contentType: file.mimetype },
      });
      return bucketFile.publicUrl();
    } catch (error) {
      this.logger.error(error.message);
    }
  }
}
