import { NextFunction, Request, Response } from "express";
import { IAuthRequest, ICoupon, userRole } from "../../types/types.ts";
import * as CouponDto from "./DTO/coupon.dto.ts";
import DatabaseServices from "../../DB/DBservices.ts";
import couponModel from "../../DB/models/coupon.model.ts";
import { ApiError } from "../../middlewares/error.handler.middleware.ts";
import slugify from "slugify";
import { parseExpiresAt } from "../../helper/dateHandle.ts";

class CouponService {
  private Coupon = new DatabaseServices<ICoupon>(couponModel);
  createCoupon = async (
    req: IAuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    const data = { ...req.body } as CouponDto.ICreateCouponDto;

    const checkCoupon = await this.Coupon.findOne({
      filter: { code: data.code },
    });

    if (checkCoupon) return next(new ApiError("Coupon already exists", 409));

    const slug = slugify(data.name, { lower: true, strict: true });

    if (data.expiresAt) {
      data.expiresAt = parseExpiresAt(data.expiresAt);
    }

    const coupon = await this.Coupon.create({
      ...data,
      slug,
      createdBy: req.user._id,
    });

    return res.status(201).json(coupon);
  };

  getCoupon = async (req: IAuthRequest, res: Response, next: NextFunction) => {
    const { code } = req.params;

    if (!code) {
      return next(new ApiError("Coupon code is required", 400));
    }
    const coupon = await this.Coupon.findOne({
      filter: { code },
    });
    if (!coupon) return next(new ApiError("Coupon not found", 404));

    const now = new Date();
    const isExpired = coupon.expiresAt ? now > coupon.expiresAt : false;
    const alreadyUsed = coupon.usedBy.includes(req.user._id);
    const isValid = coupon.isActive && !isExpired && !alreadyUsed;

    return res.status(200).json({
      valid: isValid,
      discount: coupon.discount,
      discountType: coupon.discountType,
      expiresAt: coupon.expiresAt,
      isExpired,
      alreadyUsed,
      minOrderValue: coupon.minOrderValue,
    });
  };
  updateCoupon = async (
    req: IAuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    const data = { ...req.body } as CouponDto.IUpdateCouponDto;
    const code = req.params.code;

    if (!code) {
      return next(new ApiError("Coupon code is required", 400));
    }
    const coupon = await this.Coupon.findOne({
      filter: { code },
    });
    if (!coupon) return next(new ApiError("Coupon not found", 404));

    let slug: string = "";
    if (data.name) {
      slug = slugify(data.name, { lower: true, strict: true });
    } else {
      slug = coupon.slug;
    }

    if (data.expiresAt) {
      data.expiresAt = parseExpiresAt(data.expiresAt);
    }

    const updatedCoupon = await this.Coupon.findOneAndUpdate({
      filter: { code },
      update: {
        ...data,
        slug,
      },
    });

    return res.status(200).json({ messasge: "Coupon updated", updatedCoupon });
  };
  deActivate = async (req: IAuthRequest, res: Response, next: NextFunction) => {
    const code = req.params.code;

    if (!code) {
      return next(new ApiError("Coupon code is required", 400));
    }
    const coupon = await this.Coupon.findOne({
      filter: { code },
    });
    if (!coupon) return next(new ApiError("Coupon not found", 404));

    if (
      coupon.createdBy.toString() != req.user._id.toString() ||
      req.user.role != userRole.Admin
    )
      return next(new ApiError("You are not authorized", 403));

    if (!coupon.isActive)
      return next(new ApiError("Coupon is already deactivated", 400));

    if (coupon.usedBy.length > 0)
      return next(new ApiError("Coupon is already used", 400));

    coupon.isActive = false;
    await coupon.save();

    return res.status(200).json({ messasge: "Coupon deactivated" });
  };
  reActivate = async (req: IAuthRequest, res: Response, next: NextFunction) => {
    const code = req.params.code;

    if (!code) {
      return next(new ApiError("Coupon code is required", 400));
    }
    const coupon = await this.Coupon.findOne({
      filter: { code },
    });
    if (!coupon) return next(new ApiError("Coupon not found", 404));

    if (
      coupon.createdBy.toString() != req.user._id.toString() ||
      req.user.role != userRole.Admin
    )
      return next(new ApiError("You are not authorized", 403));

    if (coupon.isActive)
      return next(new ApiError("Coupon is already activated", 400));

    coupon.isActive = true;
    await coupon.save();

    return res.status(200).json({ messasge: "Coupon reactivated" });
  };
  deleteCoupon = async (
    req: IAuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    const code = req.params.code;

    if (!code) {
      return next(new ApiError("Coupon code is required", 400));
    }
    const coupon = await this.Coupon.findOne({
      filter: { code },
    });
    if (!coupon) return next(new ApiError("Coupon not found", 404));

    if (
      coupon.createdBy.toString() != req.user._id.toString() ||
      req.user.role != userRole.Admin
    )
      return next(new ApiError("You are not authorized", 403));

    await this.Coupon.deleteOne({ filter: { code } });

    return res.status(200).json({ messasge: "Coupon deleted" });
  };
}

export default new CouponService();
