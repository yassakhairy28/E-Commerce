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
import { userRole } from "../../types/types.ts";

const categoryRouter: Router = Router();
categoryRouter.use("/:categoryId/subCategory", subCategoryRouter);

categoryRouter.post(
  "/createCategory",
  auth(),
  allowTo([userRole.Admin, userRole.SuperAdmin]),
  upload.single("logo"),
  filesFilter(allowedfiles.image, allowedfilesFilterForSharp.image),
  validation(categoryValidation.createCategorySchema),
  asyncHandler(categoryService.createCategory)
);

categoryRouter.patch(
  "/updateCategory/:categoryId",
  auth(),
  allowTo([userRole.Admin, userRole.SuperAdmin]),
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
categoryRouter.delete(
  "/delete/:categoryId",
  validation(categoryValidation.deleteCategorySchema),
  asyncHandler(categoryService.deleteCategory)
);

export default categoryRouter;
