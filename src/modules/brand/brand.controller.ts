import { Router } from "express";
import { allowTo, auth } from "../../middlewares/auth.middleware.ts";
import {
  allowedfiles,
  allowedfilesFilterForSharp,
  filesFilter,
  upload,
} from "../../middlewares/multer.middleware.ts";
import { asyncHandler } from "../../middlewares/error.handler.middleware.ts";
import { validation } from "../../middlewares/validation.middleware.ts";
import * as brandValidation from "./brand.validation.ts";
import brandService from "./brand.service.ts";

const brandRouter: Router = Router();

brandRouter.post(
  "/create",
  auth(),
  allowTo(["Admin"]),
  upload.single("logo"),
  filesFilter(allowedfiles.image, allowedfilesFilterForSharp.image),
  validation(brandValidation.createBrandSchema),
  asyncHandler(brandService.createBrand)
);

brandRouter.patch(
  "/update/:brandId",
  auth(),
  allowTo(["Admin"]),
  upload.single("logo"),
  filesFilter(allowedfiles.image, allowedfilesFilterForSharp.image),
  validation(brandValidation.updateBrandSchema),
  asyncHandler(brandService.updateBrand)
);

brandRouter.get(
  "/",
  validation(brandValidation.getSubBrandSchema),
  asyncHandler(brandService.getBrand)
);

export default brandRouter;
