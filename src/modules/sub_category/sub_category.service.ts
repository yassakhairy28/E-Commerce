import { NextFunction, Request, Response } from "express";
import DatabaseServices from "../../DB/DBservices.ts";
import SubCategoryModel from "../../DB/models/subCategory.model.ts";
import {
  IAttachment,
  IAuthRequest,
  ICategory,
  ISubCategory,
} from "../../types/types.ts";
import {
  CreateSubCategoryDto,
  IGetSubCategory,
  IUpdateSubCategory,
} from "./DTO/sub_category.dto.ts";
import slugify from "slugify";
import { ApiError } from "../../middlewares/error.handler.middleware.ts";
import { fileDelete, fileUpload } from "../../middlewares/multer.middleware.ts";
import crypto from "crypto";
import categoryModel from "../../DB/models/category.model.ts";
import { FilterQuery } from "mongoose";
import { cacheHandler } from "../../utils/cashing/cacheHandler.ts";

class subCategory {
  private subCategory = new DatabaseServices<ISubCategory>(SubCategoryModel);
  private Category = new DatabaseServices<ICategory>(categoryModel);

  createSubCategory = async (
    req: IAuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    const data = { ...req.body } as CreateSubCategoryDto;

    const slug = slugify(data.name, { lower: true, strict: true });

    const subCategory = await this.subCategory.create({
      name: data.name,
      slug,
      createdBy: req.user._id,
      categoryId: data.categoryId,
    });

    if (!subCategory) return next(new ApiError("SubCategory not created", 500));

    if (req.file) {
      const timestamp = Date.now().toString().slice(-4);
      const randomNumber = crypto.randomInt(100000, 999999).toString();
      const folderId = randomNumber + timestamp;

      const category = await this.Category.findById(subCategory.categoryId);
      if (!category) return next(new ApiError("Category not found", 404));
      const { secure_url, public_id } = await fileUpload(req.file, {
        folder: `E-Commerce/categories/${category.folderId}/sub_categories/${folderId}`,
      });
      subCategory.image.public_id = public_id;
      subCategory.image.secure_url = secure_url;
      subCategory.folderId = folderId;
      await subCategory.save();
    }
    return res.status(201).json(subCategory);
  };
  updateSubCategory = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const data = {
      ...req.body,
      subCategoryId: req.params.subCategoryId,
    } as IUpdateSubCategory;

    if (!data.name && !req.file)
      return next(new ApiError("Not Found Data to update", 400));

    const subCategory = await this.subCategory.findById(data.subCategoryId);
    if (!subCategory) return next(new ApiError("SubCategory not found", 404));

    if (data.name) {
      const slug = slugify(data.name, { lower: true, strict: true });
      subCategory.slug = slug;
      subCategory.name = data.name;
    }

    if (req.file) {
      const category = await this.Category.findById(subCategory.categoryId);
      if (!category) return next(new ApiError("Category not found", 404));

      let oldImage: IAttachment | null = subCategory.image
        ? { ...subCategory.image }
        : null;

      subCategory.image = await fileUpload(req.file, {
        folder: `E-Commerce/categories/${category.folderId}/sub_categories/${subCategory.folderId}`,
      });

      if (oldImage) {
        await fileDelete(oldImage.public_id);
      }
    }
    cacheHandler.del(`subCategory:${data.subCategoryId}`);

    await subCategory.save();
    return res
      .status(200)
      .json({ message: "SubCategory updated successfully", subCategory });
  };
  getSubCategory = async (req: Request, res: Response, next: NextFunction) => {
    const data = { ...req.query } as IGetSubCategory;

    if (data.subCategoryId) {
      // check if subCategory is cached
      const cacheKey = `subCategory:${data.subCategoryId}`;
      const cachedsubCategory = await cacheHandler.get(cacheKey);
      if (cachedsubCategory) return res.status(200).json(cachedsubCategory);

      // if not cached
      const subCategory = await this.subCategory.findOne({
        filter: { _id: data.subCategoryId },
        populate: [
          {
            path: "categoryId",
            select: "name logo",
          },
        ],
      });

      if (!subCategory) return next(new ApiError("SubCategory not found", 404));
      return res.status(200).json(subCategory);
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

    const subCategories = await this.subCategory.find({
      filter,
      select: data.select,
      sort: data.sort,
      page: data.page,
      populate: [
        { path: "createdBy", select: "firstName lastName email profilePic" },
        {
          path: "categoryId",
          select: "name image",
        },
      ],
    });
    return res.status(200).json(subCategories);
  };
}

export default new subCategory();
