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

const productRouter: Router = Router();

productRouter.post(
  "/createProduct",
  auth(),
  allowTo(["Admin"]),
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
  allowTo(["Admin"]),

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

export default productRouter;
