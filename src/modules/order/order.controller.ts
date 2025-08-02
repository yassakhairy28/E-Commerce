import { Router } from "express";
import * as orderValidation from "./order.validation.ts";
import orderService from "./order.service.ts";
import { validation } from "../../middlewares/validation.middleware.ts";
import { allowTo, auth } from "../../middlewares/auth.middleware.ts";
import { asyncHandler } from "../../middlewares/error.handler.middleware.ts";
import { userRole } from "../../types/types.ts";

const orderRouter: Router = Router();

orderRouter.post(
  "/createOrder",
  auth(),
  allowTo([userRole.Admin, userRole.User, userRole.SuperAdmin]),
  validation(orderValidation.createOrderSchema),
  asyncHandler(orderService.createOrder)
);
orderRouter.get(
  "/checkOut/:orderId",
  auth(),
  allowTo([userRole.Admin, userRole.User, userRole.SuperAdmin]),
  validation(orderValidation.getOrderSchema),
  asyncHandler(orderService.checkOutSession)
);

orderRouter.post("/webhook", asyncHandler(orderService.webhook));

orderRouter.patch(
  "/:orderId/cancel",
  auth(),
  allowTo([userRole.Admin, userRole.User, userRole.SuperAdmin]),
  validation(orderValidation.getOrderSchema),
  asyncHandler(orderService.cancelOrder)
);

export default orderRouter;
