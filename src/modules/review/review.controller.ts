import { Router } from "express";
import { asyncHandler } from "../../middlewares/error.handler.middleware.ts";
import { validation } from "../../middlewares/validation.middleware.ts";
import * as reviewValidation from "./review.validation.ts";
import reviewService from "./review.service.ts";
import { allowTo, auth } from "../../middlewares/auth.middleware.ts";
const reviewRouter: Router = Router();

reviewRouter.post(
  "/",
  auth(),
  allowTo(["Admin", "User"]),
  validation(reviewValidation.createReviewSchema),
  asyncHandler(reviewService.createReview)
);
reviewRouter.patch(
  "/:reviewId",
  auth(),
  allowTo(["Admin", "User"]),
  validation(reviewValidation.updateReviewSchema),
  asyncHandler(reviewService.updateReview)
);
reviewRouter.get(
  "/user",
  auth(),
  allowTo(["Admin", "User"]),
  validation(reviewValidation.getAllReviewByUserSchema),
  asyncHandler(reviewService.getAllReviewByUser)
);
reviewRouter.get(
  "/product",
  auth(),
  allowTo(["Admin", "User"]),
  validation(reviewValidation.getAllReviewByProductSchema),
  asyncHandler(reviewService.getAllReviewByProduct)
);

reviewRouter.get(
  "/:reviewId",
  auth(),
  allowTo(["Admin", "User"]),
  validation(reviewValidation.getReviewSchema),
  asyncHandler(reviewService.getReview)
);
reviewRouter.delete(
  "/:reviewId",
  auth(),
  allowTo(["Admin", "User"]),
  validation(reviewValidation.getReviewSchema),
  asyncHandler(reviewService.deleteReview)
);

export default reviewRouter;
