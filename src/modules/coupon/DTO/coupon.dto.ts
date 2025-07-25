import { Types } from "mongoose";
import { discountTypes } from "../../../types/types.ts";

export interface ICreateCouponDto {
  name: string;
  code: string;
  discount: number;
  discountType: discountTypes;
  brandsIds: Types.ObjectId[];
  productsIds: Types.ObjectId[];
  subCategoriesId: Types.ObjectId[];
  expiresAt?: Date;
  isActive?: boolean;
  maxUses?: number;
  minOrderValue: number;
}

export interface IUpdateCouponDto {
  code: string;
  name?: string;
  discount?: number;
  discountType?: discountTypes;
  expiresAt?: Date;
  maxUses?: number;
  minOrderValue?: number;
}
