import { diskStorage } from 'multer';
import { extname } from 'path';

// the configuration of multer thta be create or get or catch the file and stored him in server
export const multerOptions = {
  storage: diskStorage({
    destination: './uploads',
    filename: (req, file, cb) => {
      const name = file.originalname;
      const extension = extname(file.originalname);
      const randomName =
        name + '-' + Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, randomName + extension);
    },
  }),
};
