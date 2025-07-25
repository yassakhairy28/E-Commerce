import { FilterQuery, PopulateOptions, UpdateQuery } from "mongoose";

export interface IFindOneOptions<TDocument> {
  filter: FilterQuery<TDocument>;
  select?: string;
  populate?: PopulateOptions[];
}

export interface IFindOptions<TDocument> {
  filter?: FilterQuery<TDocument>;
  select?: string;
  sort?: string;
  page?: number;
  populate?: PopulateOptions[];
}

export interface IPaginate<T> {
  data: T[] | [];
  pages: number;
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  nextPage: number | null;
  previousPage: number | null;
}

export interface IFindOneAndUpdate<TDocument> {
  filter?: FilterQuery<TDocument>;
  update: UpdateQuery<TDocument>;
  select?: string;
  populate?: PopulateOptions[];
}
