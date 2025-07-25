import { Router } from "express";
import { allowTo, auth } from "../../middlewares/auth.middleware.ts";
import {
  allowedfiles,
  allowedfilesFilterForSharp,
  filesFilter,
  upload,
} from "../../middlewares/multer.middleware.ts";

import subCategoryService from "./sub_category.service.ts";
import { validation } from "../../middlewares/validation.middleware.ts";
import * as subCategoryValidation from "./sub_category.validation.ts";
import { asyncHandler } from "../../middlewares/error.handler.middleware.ts";

const subCategoryRouter: Router = Router({ mergeParams: true });

subCategoryRouter.post(
  "/create",
  auth(),
  allowTo(["Admin"]),
  upload.single("image"),
  filesFilter(allowedfiles.image, allowedfilesFilterForSharp.image),
  validation(subCategoryValidation.createSubCategorySchema),
  asyncHandler(subCategoryService.createSubCategory)
);

subCategoryRouter.patch(
  "/update/:subCategoryId",
  auth(),
  allowTo(["Admin"]),
  upload.single("image"),
  filesFilter(allowedfiles.image, allowedfilesFilterForSharp.image),
  validation(subCategoryValidation.updateSubCategorySchema),
  asyncHandler(subCategoryService.updateSubCategory)
);

subCategoryRouter.get(
  "/",
  validation(subCategoryValidation.getSubCategorySchema),
  asyncHandler(subCategoryService.getSubCategory)
);

export default subCategoryRouter;
