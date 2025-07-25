import { NextFunction, Request, Response } from "express";
import { IAttachment, IAuthRequest, ICategory } from "../../types/types.ts";
import categoryModel from "../../DB/models/category.model.ts";
import DatabaseServices from "../../DB/DBservices.ts";
import { fileDelete, fileUpload } from "../../middlewares/multer.middleware.ts";
import slugify from "slugify";
import { IFindCategory, IUpdateCategory } from "./Dto/Dto.category";
import { ApiError } from "../../middlewares/error.handler.middleware.ts";
import { FilterQuery } from "mongoose";
import crypto from "crypto";
import { cacheHandler } from "../../utils/cashing/cacheHandler.ts";

class CategoryService {
  private Category = new DatabaseServices<ICategory>(categoryModel);
  createCategory = async (
    req: IAuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    const category = await this.Category.findOne({
      filter: { name: req.body.name },
    });

    if (category) return next(new ApiError("Category already exists", 409));
    const slug = slugify(req.body.name, { lower: true, strict: true });

    const newCategory = await this.Category.create({
      name: req.body.name,
      createdBy: req.user._id,
      slug,
    });

    if (!newCategory) return next(new ApiError("Category not created", 500));

    if (req.file) {
      const timestamp = Date.now().toString().slice(-4);
      const randomNumber = crypto.randomInt(100000, 999999).toString();
      const folderId = randomNumber + timestamp;
      const { secure_url, public_id } = await fileUpload(req.file, {
        folder: `E-Commerce/categories/${folderId}`,
      });

      newCategory.logo.public_id = public_id;
      newCategory.logo.secure_url = secure_url;
      newCategory.folderId = folderId;
      await newCategory.save();
    }

    return res
      .status(201)
      .json({ message: "Category created successfully", newCategory });
  };

  updateCategory = async (req: Request, res: Response, next: NextFunction) => {
    const data = { ...req.body, ...req.params } as IUpdateCategory;

    const category = await this.Category.findById(data.categoryId)!;

    if (!category) return next(new ApiError("Category not found", 404));

    if (data.name) {
      const category = await this.Category.findOne({
        filter: {
          name: data.name,
          _id: { $ne: data.categoryId },
        },
      });

      if (category) return next(new ApiError("Category already exists", 409));

      const slug = slugify(data.name, { lower: true, strict: true });

      await this.Category.findOneAndUpdate({
        filter: { _id: data.categoryId },
        update: { name: data.name, slug },
      });
    }

    if (req.file) {
      const category = await this.Category.findById(data.categoryId)!;

      if (!category) return next(new ApiError("Category not found", 404));

      let oldImage: IAttachment | null = category.logo
        ? { ...category.logo }
        : null;

      category.logo = await fileUpload(req.file, {
        folder: `E-Commerce/categories/${category.folderId}`,
      });

      if (oldImage) fileDelete(oldImage.public_id);

      await category.save();
    }
    cacheHandler.del(`category:${data.categoryId}`);

    return res.status(200).json({ message: "Category updated successfully" });
  };
  getCategory = async (req: Request, res: Response, next: NextFunction) => {
    const data = { ...req.query } as IFindCategory;

    let cacheKey: string = "";
    let cachedCategory: ICategory | null = null;

    if (data.categoryId) {
      //get data from cashing
      cacheKey = `category:${data.categoryId}`;
      cachedCategory = await cacheHandler.get(cacheKey);
      if (cachedCategory) return res.status(200).json(cachedCategory);

      // get data from DB
      const category = await this.Category.findOne({
        filter: { _id: data.categoryId },
        populate: [
          { path: "createdBy", select: "firstName lastName email profilePic" },
        ],
      });

      if (!category) return next(new ApiError("Category not found", 404));

      // save data to cashing
      cacheKey = `category:${data.categoryId}`;
      await cacheHandler.set(cacheKey, category, 600);
      return res.status(200).json(category);
    }

    let filter: FilterQuery<ICategory> = {};
    if (data.name) {
      filter = {
        $or: [
          { name: { $regex: data.name, $options: "i" } },
          { slug: { $regex: data.name, $options: "i" } },
        ],
      };
    }

    const categories = await this.Category.find({
      filter,
      select: data.select,
      sort: data.sort,
      page: data.page,
      populate: [
        { path: "createdBy", select: "firstName lastName email profilePic" },
      ],
    });

    return res.status(200).json(categories);
  };
}

export default new CategoryService();
