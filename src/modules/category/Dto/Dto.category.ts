import { Types } from "mongoose";

export interface IUpdateCategory {
  categoryId: Types.ObjectId;
  name?: string;
}

export interface IFindCategory {
  categoryId?: Types.ObjectId;
  name?: string;
  select?: string;
  sort?: string;
  page?: number;
}
