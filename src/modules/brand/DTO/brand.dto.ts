import { Types } from "mongoose";
import { IFile } from "../../../types/types.ts";

export interface CreateBrandDto {
  name: string;
  logo: IFile;
}

export interface IUpdateBrand {
  brandId: Types.ObjectId;
  name?: string;
  logo?: IFile;
}

export interface IGetBrand {
  brandId?: Types.ObjectId;
  name?: string;
  select?: string;
  sort?: string;
  page?: number;
}
