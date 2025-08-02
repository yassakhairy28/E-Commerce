import { Router } from "express";
import { asyncHandler } from "../../middlewares/error.handler.middleware.ts";
import cartService from "./cart.service.ts";
import { allowTo, auth } from "../../middlewares/auth.middleware.ts";
import { validation } from "../../middlewares/validation.middleware.ts";
import * as cartValidation from "./cart.validation.ts";
import { userRole } from "../../types/types.ts";

const cartRouter: Router = Router();

cartRouter.post(
  "/addToCart",
  auth(),
  allowTo([userRole.Admin, userRole.User, userRole.SuperAdmin]),
  validation(cartValidation.addToCartSchema),
  asyncHandler(cartService.addToCart)
);
cartRouter.delete(
  "/deleteFromCart/:productId",
  auth(),
  allowTo([userRole.Admin, userRole.User, userRole.SuperAdmin]),
  validation(cartValidation.deleteFromCartSchema),
  asyncHandler(cartService.deleteFromCart)
);
cartRouter.get("/", auth(), asyncHandler(cartService.getItem));

export default cartRouter;
