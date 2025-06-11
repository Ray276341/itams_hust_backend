import { memoryStorage } from 'multer';

export const imageStorageOptions = {
  // sử dụng memory storage
  storage: memoryStorage(),
  // tối đa 4 Mb
  limits: {
    fileSize: Math.pow(1024, 2) * 4,
  },
};
