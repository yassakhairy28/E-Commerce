import { NextFunction, Request, Response } from "express";
import DatabaseServices from "../../DB/DBservices.ts";
import { IAttachment, IAuthRequest, IBrand } from "../../types/types.ts";
import slugify from "slugify";
import { ApiError } from "../../middlewares/error.handler.middleware.ts";
import { fileDelete, fileUpload } from "../../middlewares/multer.middleware.ts";
import crypto from "crypto";
import { FilterQuery } from "mongoose";
import brandModel from "../../DB/models/brand.model.ts";
import { CreateBrandDto, IGetBrand, IUpdateBrand } from "./DTO/brand.dto.ts";
import { cacheHandler } from "../../utils/cashing/cacheHandler.ts";

class Brand {
  private Brand = new DatabaseServices<IBrand>(brandModel);

  createBrand = async (
    req: IAuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    const data = { ...req.body } as CreateBrandDto;

    const slug = slugify(data.name, { lower: true, strict: true });

    const brand = await this.Brand.create({
      name: data.name,
      slug,
      createdBy: req.user._id,
    });

    if (!brand) return next(new ApiError("Brand not created", 500));

    if (req.file) {
      const timestamp = Date.now().toString().slice(-4);
      const randomNumber = crypto.randomInt(100000, 999999).toString();
      const folderId = randomNumber + timestamp;

      const { secure_url, public_id } = await fileUpload(req.file, {
        folder: `E-Commerce/brands/${folderId}`,
      });
      brand.logo.public_id = public_id;
      brand.logo.secure_url = secure_url;
      brand.folderId = folderId;
      await brand.save();
    }
    return res.status(201).json(brand);
  };
  updateBrand = async (req: Request, res: Response, next: NextFunction) => {
    const data = {
      ...req.body,
      brandId: req.params.brandId,
    } as IUpdateBrand;

    if (!data.name && !req.file)
      return next(new ApiError("Not Found Data to update", 400));

    const brand = await this.Brand.findById(data.brandId);
    if (!brand) return next(new ApiError("Brand not found", 404));

    if (data.name) {
      const slug = slugify(data.name, { lower: true, strict: true });
      brand.slug = slug;
      brand.name = data.name;
    }

    if (req.file) {
      let oldImage: IAttachment | null = brand.logo ? { ...brand.logo } : null;

      brand.logo = await fileUpload(req.file, {
        folder: `E-Commerce/brands/${brand.folderId}`,
      });
      if (oldImage) fileDelete(oldImage.public_id);
    }

    await brand.save();

    cacheHandler.del(`brand:${data.brandId}`);

    return res
      .status(200)
      .json({ message: "Brand updated successfully", brand });
  };
  getBrand = async (req: Request, res: Response, next: NextFunction) => {
    const data = { ...req.query } as IGetBrand;

    if (data.brandId) {
      const cacheKey = `brand:${data.brandId}`;
      const cachedBrand = await cacheHandler.get(cacheKey);
      if (cachedBrand) return res.status(200).json(cachedBrand);

      const brand = await this.Brand.findOne({
        filter: { _id: data.brandId },
        populate: [
          {
            path: "createdBy",
            select: "firstName lastName image email profilePic",
          },
        ],
      });

      if (!brand) return next(new ApiError("SubCategory not found", 404));

      return res.status(200).json(brand);
    }

    let filter: FilterQuery<IBrand> = {};
    if (data.name) {
      filter = {
        $or: [
          { name: { $regex: data.name, $options: "i" } },
          { slug: { $regex: data.name, $options: "i" } },
        ],
      };
    }

    const subCategories = await this.Brand.find({
      filter,
      select: data.select,
      sort: data.sort,
      page: data.page,
      populate: [
        { path: "createdBy", select: "firstName lastName email profilePic" },
      ],
    });
    return res.status(200).json(subCategories);
  };
}

export default new Brand();
