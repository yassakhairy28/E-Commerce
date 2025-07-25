import { Router } from "express";
import { asyncHandler } from "../../middlewares/error.handler.middleware";
import categoryService from "./category.service";
import { validation } from "../../middlewares/validation.middleware";
import * as categoryValidation from "./category.validation";
import { allowTo, auth } from "../../middlewares/auth.middleware";
import {
  allowedfiles,
  allowedfilesFilterForSharp,
  filesFilter,
  upload,
} from "../../middlewares/multer.middleware";
import subCategoryRouter from "../sub_category/sub_category.controller.ts";

const categoryRouter: Router = Router();
categoryRouter.use("/:categoryId/subCategory", subCategoryRouter);

categoryRouter.post(
  "/createCategory",
  auth(),
  allowTo(["Admin"]),
  upload.single("logo"),
  filesFilter(allowedfiles.image, allowedfilesFilterForSharp.image),
  validation(categoryValidation.createCategorySchema),
  asyncHandler(categoryService.createCategory)
);

categoryRouter.patch(
  "/updateCategory/:categoryId",
  auth(),
  allowTo(["Admin"]),
  upload.single("logo"),
  filesFilter(allowedfiles.image, allowedfilesFilterForSharp.image),
  validation(categoryValidation.updateCategorySchema),
  asyncHandler(categoryService.updateCategory)
);

categoryRouter.get(
  "/",
  validation(categoryValidation.getCategorySchema),
  asyncHandler(categoryService.getCategory)
);

export default categoryRouter;
