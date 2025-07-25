import { NextFunction, Request, RequestHandler, Response } from "express";
import multer, { memoryStorage } from "multer";
import cloudinary from "../config/cloudinary.config";
import sharp from "sharp";
import { IAuthAndUploadRequest, IUploadFileRequest } from "../types/types.ts";
import { fromBuffer } from "file-type";
import { ApiError } from "./error.handler.middleware.ts";

// Configure Multer
export const upload = multer({
  storage: memoryStorage(),
});

export const allowedfiles = {
  image: ["image/jpeg", "image/png", "image/jpg"],
};
export const allowedfilesFilterForSharp = {
  image: ["image/jpeg", "image/png", "image/jpg"],
};

// Middleware to filter files

export const filesFilter = (
  filesTypes: string[],
  validateBySharpFor: string[] = []
) =>
  async function (
    req: IUploadFileRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    if (!req.files && !req.file) return next();
    const files = Array.isArray(req.files) ? req.files : [req.file];
    for (const file of files) {
      const buffer = file!.buffer;

      const fileType = await fromBuffer(buffer);
      if (!fileType || !filesTypes.includes(fileType.mime)) {
        return next(new ApiError("Invalid file type", 400));
      }

      if (validateBySharpFor.includes(fileType.mime)) {
        try {
          await sharp(buffer).metadata();
        } catch {
          return next(new ApiError("Corrupted file", 400));
        }
      }
    }

    return next();
  } as unknown as RequestHandler;

// Middleware to filter fields
export const filesFilterForFields = (
  filesTypes: string[],
  validateBySharpFor: string[] = []
): RequestHandler => {
  return async function (req, res, next) {
    const files = (req as unknown as IUploadFileRequest).files;
    if (!files) return next();

    for (const fieldName in files) {
      const fieldFiles = Array.isArray(files[fieldName])
        ? files[fieldName]
        : [files[fieldName]];

      for (const file of fieldFiles) {
        const buffer = file.buffer;

        const fileType = await fromBuffer(buffer);

        if (!fileType || !filesTypes.includes(fileType.mime)) {
          return next(new ApiError("Invalid file type", 400));
        }

        if (validateBySharpFor.includes(fileType.mime)) {
          try {
            await sharp(buffer).metadata();
          } catch {
            return next(new ApiError("Corrupted file", 400));
          }
        }
      }
    }
    return next();
  };
};

// Middleware to upload files
export const fileUpload = async (file: any, { folder }: { folder: string }) => {
  const { secure_url, public_id }: { secure_url: string; public_id: string } =
    await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
        },
        (error, result: any) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
      uploadStream.end(file.buffer);
    });

  return { secure_url, public_id };
};

// Middleware to delete files
export const fileDelete = async (public_id: string) => {
  await cloudinary.uploader.destroy(public_id);
};

