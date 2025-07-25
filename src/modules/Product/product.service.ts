import { NextFunction, Request, Response } from "express";
import DatabaseServices from "../../DB/DBservices.ts";
import productModel from "../../DB/models/product.model.ts";
import {
  IAttachment,
  IAuthRequest,
  IBrand,
  IProduct,
  ISubCategory,
} from "../../types/types.ts";
import {
  ICreateProductDTO,
  IFindProductDTO,
  IUpdateProductDTO,
} from "./Dto/product.dto.ts";
import { ApiError } from "../../middlewares/error.handler.middleware.ts";
import { fileDelete, fileUpload } from "../../middlewares/multer.middleware.ts";
import crypto from "crypto";
import slugify from "slugify";
import { FilterQuery } from "mongoose";
import SubCategoryModel from "../../DB/models/subCategory.model.ts";
import brandModel from "../../DB/models/brand.model.ts";
import { cacheHandler } from "../../utils/cashing/cacheHandler.ts";

class ProductService {
  private Product = new DatabaseServices<IProduct>(productModel);
  private subCategory = new DatabaseServices<ISubCategory>(SubCategoryModel);
  private Brand = new DatabaseServices<IBrand>(brandModel);

  createProduct = async (
    req: IAuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    const data = { ...req.body } as ICreateProductDTO;
    const files = { ...req.files } as ICreateProductDTO;

    const subCategory = await this.subCategory.findById(data.subCategoryId);

    if (!subCategory)
      return next(new ApiError("sub_CategorysubCategory not found", 404));

    const brand = await this.Brand.findById(data.brandId);

    if (!brand) return next(new ApiError("Brand not found", 404));

    if (data.discount) {
      data.price = data.price - (data.price * data.discount) / 100;
    }

    const timestamp = Date.now().toString().slice(-4);
    const randomNumber = crypto.randomInt(100000, 999999).toString();
    const folderId = randomNumber + timestamp;

    const image = await fileUpload(files.image[0], {
      folder: `E-Commerce/categories/${subCategory.folderId}/products/${folderId}/image`,
    });

    const slug = slugify(data.name, { lower: true, strict: true });

    const product = await this.Product.create({
      ...data,
      image,
      slug,
      folderId,
      createdBy: req.user._id,
    });

    if (files.gallary) {
      const gallary = await Promise.all(
        files.gallary.map((file) => {
          return fileUpload(file, {
            folder: `E-Commerce/categories/${subCategory.folderId}/products/${product.folderId}/gallary`,
          });
        })
      );
      product.gallary = gallary;
      await product.save();
    }

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  };
  updateProduct = async (req: Request, res: Response, next: NextFunction) => {
    const data = { ...req.body } as IUpdateProductDTO;
    const files = { ...req.files } as IUpdateProductDTO;
    const { productId } = req.params;

    const product = await this.Product.findOne({
      filter: { _id: productId },
    });

    if (!product) return next(new ApiError("Product not found", 404));

    const subCategory = await this.subCategory.findById(product.subCategoryId);

    if (!subCategory) return next(new ApiError("Category not found", 404));

    if (data.discount && !data.price) {
      product.price = product.price - (product.price * data.discount) / 100;
      if (product.price < 0)
        return next(new ApiError("Discount cannot exceed price", 400));
    } else if (data.discount && data.price) {
      product.price = data.price - (data.price * data.discount) / 100;
      if (product.price < 0)
        return next(new ApiError("Discount cannot exceed price", 400));
      delete data.price;
    }

    let oldImage: IAttachment | null = null;
    if (files.image) {
      oldImage = product.image ? { ...product.image } : null;
      product.image = await fileUpload(files.image[0], {
        folder: `E-Commerce/categories/${subCategory.folderId}/products/${product.folderId}/image`,
      });
    }

    let gallary: IAttachment[] = [];

    if (files.gallary?.length) {
      if (product.gallary?.length) {
        gallary = product.gallary;
      }
      product.gallary = await Promise.all(
        files.gallary.map((file) => {
          return fileUpload(file, {
            folder: `E-Commerce/categories/${subCategory.folderId}/products/${product.folderId}/gallary`,
          });
        })
      );
    }

    if (data.name) {
      const slug = slugify(data.name, { lower: true, strict: true });
      product.slug = slug;
    }

    Object.assign(product, data);

    await product.save();

    if (gallary?.length) {
      void Promise.all(gallary.map((file) => fileDelete(file.public_id)));
    }
    if (oldImage) {
      fileDelete(oldImage.public_id);
    }

    cacheHandler.del(`product:${data.productId}`);

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  };
  findProduct = async (req: Request, res: Response, next: NextFunction) => {
    const data = { ...req.query } as IFindProductDTO;

    if (data.productId) {
      const cacheKey = `product:${data.productId}`;
      const cachedProduct = await cacheHandler.get(cacheKey);
      if (cachedProduct) return res.status(200).json(cachedProduct);
      const product = await this.Product.findOne({
        filter: { _id: data.productId },
        populate: [
          { path: "subCategoryId", select: "name image " },
          { path: "brandId", select: "name logo" },
        ],
      });
      if (!product) return next(new ApiError("Product not found", 404));
      return res.status(200).json({
        success: true,
        data: product,
      });
    }

    let filter: FilterQuery<IProduct> = {};

    if (data.name) {
      filter = {
        $or: [
          { name: { $regex: data.name, $options: "i" } },
          { slug: { $regex: data.name, $options: "i" } },
        ],
      };
    }

    const products = await this.Product.find({
      filter,
      select: data.select,
      sort: data.sort,
      page: data.page,
      populate: [
        { path: "subCategoryId", select: "name image " },
        { path: "brandId", select: "name logo" },
      ],
    });

    return res.status(200).json({
      success: true,
      data: products,
    });
  };
}

export default new ProductService();
