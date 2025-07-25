import {
  FilterQuery,
  Model,
  Types,
  UpdateQuery,
  UpdateWriteOpResult,
} from "mongoose";
import {
  IFindOneAndUpdate,
  IFindOneOptions,
  IFindOptions,
  IPaginate,
} from "./DTO/dto";
import { DeleteResult } from "mongoose";

class DatabaseServices<TDocument> {
  constructor(private model: Model<TDocument>) {}

  async create(data: Partial<TDocument>): Promise<TDocument> {
    return await this.model.create(data);
  }

  async findOne({
    filter,
    select = "",
    populate = [],
  }: IFindOneOptions<TDocument>): Promise<TDocument | null> {
    return await this.model.findOne(filter).select(select).populate(populate);
  }

  async find({
    filter,
    select,
    sort,
    page = 0,
    populate,
  }: IFindOptions<TDocument>): Promise<
    TDocument[] | [] | IPaginate<TDocument>
  > {
    {
      let query = this.model.find(filter || {});

      if (select) query.select(select.replaceAll(",", " "));
      if (sort) query.sort(sort.replaceAll(",", " "));
      if (populate) query.populate(populate);
      if (!page) return await query.exec();
      const limit = 10;
      const skip = (page - 1) * limit;
      const count = await this.model.countDocuments(filter);
      const pages = Math.ceil(count / limit);
      const data = await query.skip(skip).limit(limit).exec();

      return {
        data,
        pages,
        currentPage: page,
        totalItems: count,
        itemsPerPage: data.length,
        nextPage: page < pages ? page + 1 : null,
        previousPage: page > 1 ? page - 1 : null,
      };
    }
  }

  async findById(id: Types.ObjectId): Promise<TDocument | null> {
    return await this.model.findById(id);
  }

  async findOneAndUpdate({
    filter = {},
    update = {},
    select = "",
    populate = [],
  }: IFindOneAndUpdate<TDocument>): Promise<TDocument | null> {
    return await this.model.findOneAndUpdate(filter, update, {
      new: true,
      select,
      populate,
    });
  }

  async updateOne({
    filter,
    data,
  }: {
    filter: FilterQuery<TDocument>;
    data: UpdateQuery<TDocument>;
  }): Promise<UpdateWriteOpResult> {
    return await this.model.updateOne(filter, data, { new: true });
  }

  async deleteOne(filter: FilterQuery<TDocument>): Promise<DeleteResult> {
    return await this.model.deleteOne(filter);
  }

  async deleteMany(filter: FilterQuery<TDocument>): Promise<DeleteResult> {
    return await this.model.deleteMany(filter);
  }
}

export default DatabaseServices;
