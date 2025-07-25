import { Types } from "mongoose";
import { IFile } from "../../../types/types.ts";

export interface CreateSubCategoryDto {
  name: string;
  image: IFile;
  categoryId: Types.ObjectId;
}

export interface IUpdateSubCategory {
  subCategoryId: Types.ObjectId;
  name?: string;
  image?: IFile;
}

export interface IGetSubCategory {
  subCategoryId?: Types.ObjectId;
  name?: string;
  select?: string;
  sort?: string;
  page?: number;
}
