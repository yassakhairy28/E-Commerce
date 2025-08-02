import { Router } from "express";
import { allowTo, auth } from "../../middlewares/auth.middleware.ts";
import { validation } from "../../middlewares/validation.middleware.ts";
import * as adminValidation from "./admin.validation.ts";
import { asyncHandler } from "../../middlewares/error.handler.middleware.ts";
import adminService from "./admin.service.ts";
import { userRole } from "../../types/types.ts";
import { allow } from "joi";

const adminRouter: Router = Router();

// first 6 functions are for update user
adminRouter.patch(
  "/updateUserRole/:userId",
  auth(),
  allowTo([userRole.Admin, userRole.SuperAdmin]),
  validation(adminValidation.updateUserRoleSchema),
  asyncHandler(adminService.updateUserRole)
);
adminRouter.patch(
  "/block/:userId",
  auth(),
  allowTo([userRole.Admin, userRole.SuperAdmin]),
  validation(adminValidation.getUserSchema),
  asyncHandler(adminService.blockUser)
);
adminRouter.patch(
  "/unBlock/:userId",
  auth(),
  allowTo([userRole.Admin, userRole.SuperAdmin]),
  validation(adminValidation.getUserSchema),
  asyncHandler(adminService.unBlockUser)
);
adminRouter.delete(
  "/delete/:userId",
  auth(),
  allowTo([userRole.SuperAdmin]),
  validation(adminValidation.getUserSchema),
  asyncHandler(adminService.deleteUser)
);
adminRouter.patch(
  "/unDelete/:userId",
  auth(),
  allowTo([userRole.SuperAdmin]),
  validation(adminValidation.getUserSchema),
  asyncHandler(adminService.unDeleteUser)
);

adminRouter.get(
  "/users",
  auth(),
  allowTo([userRole.Admin, userRole.SuperAdmin]),
  validation(adminValidation.getUsersSchema),
  asyncHandler(adminService.getAllUsers)
);

adminRouter.get(
  "/products",
  auth(),
  allowTo([userRole.Admin, userRole.SuperAdmin]),
  validation(adminValidation.getProductsSchema),
  asyncHandler(adminService.getAllProducts)
);
adminRouter.get(
  "/categories",
  auth(),
  allowTo([userRole.Admin, userRole.SuperAdmin]),
  validation(adminValidation.getCategoriesSchema),
  asyncHandler(adminService.getAllCategoreis)
);
adminRouter.get(
  "/subCategories",
  auth(),
  allowTo([userRole.Admin, userRole.SuperAdmin]),
  validation(adminValidation.getSubCategoriesSchema),
  asyncHandler(adminService.getAllSubCategoreis)
);
adminRouter.get(
  "/brands",
  auth(),
  allowTo([userRole.Admin, userRole.SuperAdmin]),
  validation(adminValidation.getBrandsSchema),
  asyncHandler(adminService.getAllBrands)
);

adminRouter.get(
  "/coupons",
  auth(),
  allowTo([userRole.Admin, userRole.SuperAdmin]),
  validation(adminValidation.getCouponsSchema),
  asyncHandler(adminService.getAllCoupons)
);

adminRouter.get(
  "/reviews",
  auth(),
  allowTo([userRole.Admin, userRole.SuperAdmin]),
  validation(adminValidation.getReviewsSchema),
  asyncHandler(adminService.getAllReviews)
);

adminRouter.get(
  "/orders",
  auth(),
  allowTo([userRole.Admin, userRole.SuperAdmin]),
  validation(adminValidation.getOrdersSchema),
  asyncHandler(adminService.getOrders)
);

adminRouter.patch(
  "/orders/:orderId",
  auth(),
  allowTo([userRole.Admin, userRole.SuperAdmin]),
  validation(adminValidation.updateOrderStatusSchema),
  asyncHandler(adminService.updateOrderStatus)
);
adminRouter.delete(
  "/orders/:orderId",
  auth(),
  allowTo([userRole.Admin, userRole.SuperAdmin]),
  validation(adminValidation.deleteOrderSchema),
  asyncHandler(adminService.deletedOrder)
);

export default adminRouter;
