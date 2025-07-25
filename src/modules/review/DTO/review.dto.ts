import { Types } from "mongoose";

export interface ICreateReviewDto {
  productId: Types.ObjectId;
  text: string;
  rating: number;
}

export interface IUpdateReviewDto {
  reviewId: Types.ObjectId;
  text?: string;
  rating?: number;
}

export interface IGetReviewDto {
  reviewId: Types.ObjectId;
}

export interface IGetAllReviewsByProductDto {
  productId: Types.ObjectId;
  page?: number;
}
