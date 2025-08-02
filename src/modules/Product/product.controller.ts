import { Router } from "express";
import { asyncHandler } from "../../middlewares/error.handler.middleware.ts";
import productService from "./product.service.ts";
import { validation } from "../../middlewares/validation.middleware.ts";
import * as productValidation from "./product.validation.ts";
import { allowTo, auth } from "../../middlewares/auth.middleware.ts";
import {
  allowedfiles,
  allowedfilesFilterForSharp,
  filesFilterForFields,
  upload,
} from "../../middlewares/multer.middleware.ts";
import { userRole } from "../../types/types.ts";

const productRouter: Router = Router();

productRouter.post(
  "/createProduct",
  auth(),
  allowTo([userRole.Admin, userRole.SuperAdmin]),
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "gallary", maxCount: 8 },
  ]),
  filesFilterForFields(allowedfiles.image, allowedfilesFilterForSharp.image),
  validation(productValidation.createProductSchema),
  asyncHandler(productService.createProduct)
);

productRouter.patch(
  "/updateProduct/:productId",
  auth(),
  allowTo([userRole.Admin, userRole.SuperAdmin]),
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "gallary", maxCount: 8 },
  ]),
  filesFilterForFields(allowedfiles.image, allowedfilesFilterForSharp.image),
  validation(productValidation.updateProductSchema),
  asyncHandler(productService.updateProduct)
);

productRouter.get(
  "/",
  validation(productValidation.findProductSchema),
  asyncHandler(productService.findProduct)
);
productRouter.delete(
  "/delete/:productId",
  auth(),
  allowTo([userRole.Admin, userRole.SuperAdmin]),
  validation(productValidation.deleteProductSchema),
  asyncHandler(productService.deleteProduct)
);

export default productRouter;
