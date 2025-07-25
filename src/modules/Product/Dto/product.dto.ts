import { Types } from "mongoose";
import { IAttachment, ProductSize } from "../../../types/types.ts";

export interface ICreateProductDTO {
  name: string;
  description: string;
  price: number;
  discount?: number;
  stock: number;
  colors?: string[];
  size?: ProductSize;
  image: IAttachment[];
  gallary?: IAttachment[];
  subCategoryId: Types.ObjectId;
  brandId: Types.ObjectId;
}

export interface IUpdateProductDTO extends Partial<ICreateProductDTO> {
  productId: Types.ObjectId;
}

export interface IFindProductDTO {
  productId?: Types.ObjectId;
  name?: string;
  select?: string;
  sort?: string;
  page?: number;
}
