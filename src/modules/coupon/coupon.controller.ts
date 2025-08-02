import { Router } from "express";
import { allowTo, auth } from "../../middlewares/auth.middleware.ts";
import { asyncHandler } from "../../middlewares/error.handler.middleware.ts";
import { validation } from "../../middlewares/validation.middleware.ts";
import * as couponValidation from "./coupon.validation.ts";
import couponService from "./coupon.service.ts";
import { userRole } from "../../types/types.ts";

const couponRouter: Router = Router();

couponRouter.post(
  "/create",
  auth(),
  allowTo([userRole.Admin, userRole.SuperAdmin]),
  validation(couponValidation.createCouponSchema),
  asyncHandler(couponService.createCoupon)
);

couponRouter.get(
  "/:code",
  auth(),
  allowTo([userRole.Admin, userRole.User, userRole.SuperAdmin]),
  validation(couponValidation.getCouponSchema),
  asyncHandler(couponService.getCoupon)
);
couponRouter.patch(
  "/update/:code",
  auth(),
  allowTo([userRole.Admin, userRole.SuperAdmin]),
  validation(couponValidation.updateCouponSchema),
  asyncHandler(couponService.updateCoupon)
);
couponRouter.patch(
  "/deActivate/:code",
  auth(),
  allowTo([userRole.Admin, userRole.SuperAdmin]),
  validation(couponValidation.getCouponSchema),
  asyncHandler(couponService.deActivate)
);
couponRouter.patch(
  "/reActivate/:code",
  auth(),
  allowTo([userRole.Admin, userRole.SuperAdmin]),
  validation(couponValidation.getCouponSchema),
  asyncHandler(couponService.reActivate)
);
couponRouter.delete(
  "/delete/:code",
  auth(),
  allowTo([userRole.Admin, userRole.SuperAdmin]),
  validation(couponValidation.getCouponSchema),
  asyncHandler(couponService.deleteCoupon)
);

export default couponRouter;
