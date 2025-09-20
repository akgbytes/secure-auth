import { ApiError, HttpStatus } from "@/utils/core";
import multer from "multer";
import path from "path";

export const allowedMimeTypes = ["image/png", "image/jpeg"];

const storage = multer.diskStorage({
  destination: function (req, res, cb) {
    cb(null, "./public/uploads");
  },
  filename: function (req, file, cb) {
    // including a random char bcuz collision could still happen if
    // two user upload same file(avatar.png) at the same time
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const extention = path.extname(file.originalname);
    // avatar-123.png
    cb(null, `${file.fieldname}-${uniqueSuffix}${extention}`);
  },
});

// filter file type for attachments
const fileFilter: multer.Options["fileFilter"] = (req, file, cb) => {
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new ApiError(
        HttpStatus.BAD_REQUEST,
        "Unsupported file type, only jpeg and png allowed"
      )
    );
  }
};

export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },
  fileFilter,
});
