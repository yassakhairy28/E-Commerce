import { Types } from "mongoose";
import { IOrderStatus, userRole } from "../../../types/types.ts";

export interface IFindUsersDto {
  userId?: Types.ObjectId;
  name?: string;
  role?: userRole;
  select?: string;
  sort?: string;
  page?: number;
}
export interface IFindProductsDto {
  productId?: Types.ObjectId;
  name?: string;
  select?: string;
  sort?: string;
  page?: number;
}
export interface IFindCategoreisDto {
  categoryId?: Types.ObjectId;
  name?: string;
  select?: string;
  sort?: string;
  page?: number;
}
export interface IFindSubCategoreisDto {
  subCategoryId?: Types.ObjectId;
  name?: string;
  select?: string;
  sort?: string;
  page?: number;
}
export interface IFindBrandsDto {
  brandId?: Types.ObjectId;
  name?: string;
  select?: string;
  sort?: string;
  page?: number;
}

export interface IFindCouponsDto {
  couponId?: Types.ObjectId;
  name?: string;
  select?: string;
  sort?: string;
  page?: number;
}

export interface IFindReviewsDto {
  reviewId?: Types.ObjectId;
  productId?: Types.ObjectId;
  userId?: Types.ObjectId;
  select?: string;
  sort?: string;
  page?: number;
}

export interface IFindOrdersDto {
  orderId?: Types.ObjectId;
  userId?: Types.ObjectId;
  select?: string;
  sort?: string;
  page?: number;
}

export interface IUpdateOrderStatusDto {
  orderId: Types.ObjectId;
  status: IOrderStatus;
}
