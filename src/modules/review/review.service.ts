import { NextFunction, Response } from "express";
import DatabaseServices from "../../DB/DBservices.ts";
import reviewModel from "../../DB/models/review.model.ts";
import {
  IAuthRequest,
  IProduct,
  IReview,
  ReviewRatingLabel,
} from "../../types/types.ts";
import * as reviewDTO from "./DTO/review.dto.ts";
import { ApiError } from "../../middlewares/error.handler.middleware.ts";
import { Types } from "mongoose";
import productModel from "../../DB/models/product.model.ts";
import { cacheHandler } from "../../utils/cashing/cacheHandler.ts";

class ReviewService {
  private Review = new DatabaseServices<IReview>(reviewModel);
  private Product = new DatabaseServices<IProduct>(productModel);

  createReview = async (
    req: IAuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    const data = { ...req.body } as reviewDTO.ICreateReviewDto;
    const productId = new Types.ObjectId(data.productId);
    const product = await this.Product.findById(data.productId);

    if (!product) return next(new ApiError("Product not found", 404));

    const ratingLabelMap: Record<number, ReviewRatingLabel> = {
      1: ReviewRatingLabel.bad,
      2: ReviewRatingLabel.average,
      3: ReviewRatingLabel.good,
      4: ReviewRatingLabel.veryGood,
      5: ReviewRatingLabel.excellent,
    };
    const ratingLabel = ratingLabelMap[data.rating];
    if (!ratingLabel) {
      return next(new ApiError("Invalid rating value", 400));
    }
    const review = await this.Review.create({
      ...data,
      ratingLabel,
      createdBy: req.user._id,
    });

    return res.status(201).json(review);
  };

  updateReview = async (
    req: IAuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    const data = { ...req.body, ...req.params } as reviewDTO.IUpdateReviewDto;
    const review = await this.Review.findById(data.reviewId);
    if (!review) return next(new ApiError("Review not found", 404));

    if (data.rating) {
      const ratingLabelMap: Record<number, ReviewRatingLabel> = {
        1: ReviewRatingLabel.bad,
        2: ReviewRatingLabel.average,
        3: ReviewRatingLabel.good,
        4: ReviewRatingLabel.veryGood,
        5: ReviewRatingLabel.excellent,
      };
      const ratingLabel = ratingLabelMap[data.rating];
      if (!ratingLabel) {
        return next(new ApiError("Invalid rating value", 400));
      }
      review.rating = data.rating;
      review.ratingLabel = ratingLabel;
    }

    if (data.text) review.text = data.text;
    await review.save();
    cacheHandler.del(`product:${review.productId}`);
    cacheHandler.del(`review:${review._id}`);
    return res.status(200).json(review);
  };

  getAllReviewByUser = async (
    req: IAuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    const reviews = await this.Review.find({
      filter: { createdBy: req.user._id },
      populate: [
        {
          path: "productId",
          select: "name image gallary price description colors stock -_id",
        },
      ],
      page: req.query.page ? Number(req.query.page) : 1,
    });
    const user = {
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      profilePic: req.user.profilePic,
      email: req.user.email,
      age: req.user.age,
    };
    return res.status(200).json({ user, reviews });
  };

  getAllReviewByProduct = async (
    req: IAuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    const data = { ...req.body } as reviewDTO.IGetAllReviewsByProductDto;

    const product = await this.Product.findOne({
      filter: { _id: data.productId },
      select: "name image gallary price description colors stock -_id",
    });

    if (!product) return next(new ApiError("Product not found", 404));

    const reviews = await this.Review.find({
      filter: { productId: data.productId },
      populate: [
        {
          path: "createdBy",
          select: "firstName lastName profilePic email age -_id",
        },
      ],
      page: data.page ? Number(data.page) : 1,
    });
    return res.status(200).json({ product, reviews });
  };
  getReview = async (req: IAuthRequest, res: Response, next: NextFunction) => {
    const reviewId = new Types.ObjectId(req.params.reviewId);
    const review = await this.Review.findOne({
      filter: { _id: reviewId },
      populate: [
        {
          path: "createdBy",
          select: "firstName lastName profilePic email age -_id",
        },
        {
          path: "productId",
          select: "name image gallary price description colors stock -_id",
        },
      ],
    });
    if (!review) return next(new ApiError("Review not found", 404));
    return res.status(200).json(review);
  };
  deleteReview = async (
    req: IAuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    const reviewId = new Types.ObjectId(req.params.reviewId);
    const review = await this.Review.findById(reviewId);
    if (!review) return next(new ApiError("Review not found", 404));

    if (
      req.user.role === "Admin" ||
      String(req.user._id) === String(review.createdBy)
    ) {
      await this.Review.deleteOne({ _id: reviewId });
      cacheHandler.del(`product:${review.productId}`);
      cacheHandler.del(`review:${reviewId}`);
      return res.status(200).json({ message: "Review deleted successfully" });
    }
    return next(
      new ApiError("You are not authorized to delete this review", 403)
    );
  };
}

export default new ReviewService();
