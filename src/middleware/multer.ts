import multer from "multer";

const storage1 = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './public/uploads'); 
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname); 
    }
  });
const upload = multer({ storage:storage1 });
export default {upload};