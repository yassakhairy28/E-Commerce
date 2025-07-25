import { Types } from "mongoose";

export interface IAddToCartDto {
  productId: Types.ObjectId;
  quantity: number;
}
