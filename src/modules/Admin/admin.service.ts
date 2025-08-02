import { NextFunction, Response } from "express";
import DatabaseServices from "../../DB/DBservices.ts";
import userModel from "../../DB/models/user.model.ts";
import {
  IAuthRequest,
  IBrand,
  ICategory,
  ICoupon,
  IOrder,
  IProduct,
  IReview,
  ISubCategory,
  IUser,
  userRole,
} from "../../types/types.ts";
import { ApiError } from "../../middlewares/error.handler.middleware.ts";
import * as adminDTO from "./DTO/admin.dto.ts";
import { cacheHandler } from "../../utils/cashing/cacheHandler.ts";
import { FilterQuery, Types } from "mongoose";
import productModel from "../../DB/models/product.model.ts";
import categoryModel from "../../DB/models/category.model.ts";
import SubCategoryModel from "../../DB/models/subCategory.model.ts";
import brandModel from "../../DB/models/brand.model.ts";
import couponModel from "../../DB/models/coupon.model.ts";
import reviewModel from "../../DB/models/review.model.ts";
import orderModel from "../../DB/models/order.model.ts";
import assertAdminOrSuperAdmin from "../../helper/assertAdminOrSuperAdmin.ts";
class AdminService {
  private User = new DatabaseServices<IUser>(userModel);
  private Product = new DatabaseServices<IProduct>(productModel);
  private Category = new DatabaseServices<ICategory>(categoryModel);
  private subCategory = new DatabaseServices<ISubCategory>(SubCategoryModel);
  private Brand = new DatabaseServices<IBrand>(brandModel);
  private Coupon = new DatabaseServices<ICoupon>(couponModel);
  private Review = new DatabaseServices<IReview>(reviewModel);
  private Order = new DatabaseServices<IOrder>(orderModel);

  // first 6 functions are for user
  updateUserRole = async (
    req: IAuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    assertAdminOrSuperAdmin(req.user, next);

    const { userId } = req.params;

    const { role }: { role: userRole } = req.body;

    const user = await this.User.findOne({
      filter: { _id: userId },
    });
    if (!user) return next(new ApiError("User not found", 404));

    if (user.delete.isDeleted)
      return next(new ApiError("User is deleted", 400));

    if (String(req.user._id) === String(user._id))
      return next(
        new ApiError("You can't transfer your role to yourself", 400)
      );

    if (user.role === userRole.SuperAdmin)
      return next(new ApiError("You can't change role of SuperAdmin", 400));

    if (user.role === req.user.role)
      throw new ApiError("Cannot update user with the same role as yours", 403);

    if (user.role === role)
      return next(new ApiError("User already has this role", 400));

    if (req.user.role === userRole.Admin && role === userRole.SuperAdmin)
      return next(
        new ApiError("You can't transfer your role to SuperAdmin", 400)
      );

    user.role = role;
    await user.save();
    return res.status(200).json({
      message: `User role updated to ${role}`,
      user,
    });
  };
  blockUser = async (req: IAuthRequest, res: Response, next: NextFunction) => {
    assertAdminOrSuperAdmin(req.user, next);

    const { userId } = req.params;

    const user = await this.User.findOne({
      filter: { _id: userId },
    });
    if (!user) return next(new ApiError("User not found", 404));

    if (String(req.user._id) === String(user._id))
      return next(new ApiError("You can't block yourself", 400));

    if (user.role === userRole.SuperAdmin)
      return next(new ApiError("You can't block SuperAdmin", 400));

    if (user.role === req.user.role)
      throw new ApiError("Cannot update user with the same role as yours", 403);

    if (user.delete.isDeleted)
      return next(new ApiError("User is deleted", 400));

    if (user.block.isBlocked)
      return next(new ApiError("User Aleady Blocked", 400));

    user.block.isBlocked = true;
    user.block.blockedAt = new Date(Date.now());
    user.block.blockedBy = req.user._id;
    await user.save();
    return res.status(200).json({
      message: "User blocked successfully",
      user,
    });
  };
  unBlockUser = async (
    req: IAuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    assertAdminOrSuperAdmin(req.user, next);

    const { userId } = req.params;

    const user = await this.User.findOne({
      filter: { _id: userId },
    });
    if (!user) return next(new ApiError("User not found", 404));

    if (String(req.user._id) === String(user._id))
      return next(new ApiError("You can't unBlock yourself", 400));

    if (user.role === userRole.SuperAdmin)
      return next(new ApiError("You can't unBlock SuperAdmin", 400));

    if (user.role === req.user.role)
      throw new ApiError("Cannot update user with the same role as yours", 403);

    if (user.delete.isDeleted)
      return next(new ApiError("User is deleted", 400));

    if (user.block.isBlocked === false)
      return next(new ApiError("User is not blocked", 400));

    user.block.isBlocked = false;
    user.block.unBlockedAt = new Date(Date.now());
    user.block.unBlockedBy = req.user._id;
    await user.save();
    return res.status(200).json({
      message: "User unBlocked successfully",
      user,
    });
  };
  deleteUser = async (req: IAuthRequest, res: Response, next: NextFunction) => {
    const { userId } = req.params;

    if (req.user.role !== userRole.SuperAdmin)
      return next(new ApiError("You are not authorized to delete users", 403));

    const user = await this.User.findOne({
      filter: { _id: userId },
    });
    if (!user) return next(new ApiError("User not found", 404));

    if (String(req.user._id) === String(user._id))
      return next(new ApiError("You can't block yourself", 400));

    if (user.role === userRole.SuperAdmin)
      return next(new ApiError("You can't delete SuperAdmin", 400));

    if (user.delete.isDeleted)
      return next(new ApiError("User Already Deleted", 400));

    user.delete.deletedAt = new Date(Date.now());
    user.delete.deletedBy = req.user._id;
    user.delete.isDeleted = true;
    await user.save();
    return res.status(200).json({
      message: "User deleted successfully",
      user,
    });
  };
  unDeleteUser = async (
    req: IAuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    const { userId } = req.params;

    if (req.user.role !== userRole.SuperAdmin)
      return next(
        new ApiError("You are not authorized to unDeleted users", 403)
      );

    const user = await this.User.findOne({
      filter: { _id: userId },
    });
    if (!user) return next(new ApiError("User not found", 404));

    if (String(req.user._id) === String(user._id))
      return next(new ApiError("You can't unDelete yourself", 400));

    if (!user.delete.isDeleted)
      return next(new ApiError("User is not deleted", 400));

    user.delete.unDeletedAt = new Date(Date.now());
    user.delete.unDeletedBy = req.user._id;
    user.delete.isDeleted = false;
    await user.save();
    return res.status(200).json({
      message: "User unDeleted successfully",
      user,
    });
  };
  getAllUsers = async (
    req: IAuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    assertAdminOrSuperAdmin(req.user, next);

    const data = { ...req.query } as adminDTO.IFindUsersDto;

    if (data.userId) {
      const cacheKey = `user:${data.userId}`;
      const cachedUser = await cacheHandler.get(cacheKey);
      if (cachedUser) return res.status(200).json(cachedUser);
      const user = await this.User.findOne({
        filter: { _id: data.userId },
      });
      if (!user) return next(new ApiError("user not found", 404));
      return res.status(200).json({
        success: true,
        data: user,
      });
    }

    let filter: FilterQuery<IUser> = {};

    if (data.name) {
      let firstName;
      let lastName;
      if (data.name.includes(" ")) {
        firstName = data.name.split(" ")[0];
        lastName = data.name.split(" ")[1];
        filter = {
          firstName: { $regex: firstName, $options: "i" },
          lastName: { $regex: lastName, $options: "i" },
        };
      } else {
        filter = {
          $or: [
            { firstName: { $regex: data.name, $options: "i" } },
            { lastName: { $regex: data.name, $options: "i" } },
          ],
        };
      }
    }

    if (data.role) {
      filter = {
        ...filter,
        role: data.role,
      };
    }

    const users = await this.User.find({
      filter,
      select: data.select,
      sort: data.sort,
      page: data.page || 1,
    });

    return res.status(200).json({
      success: true,
      data: users,
    });
  };
  getAllProducts = async (
    req: IAuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    assertAdminOrSuperAdmin(req.user, next);

    const data = { ...req.query } as adminDTO.IFindProductsDto;

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
  getAllCategoreis = async (
    req: IAuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    assertAdminOrSuperAdmin(req.user, next);

    const data = { ...req.query } as adminDTO.IFindCategoreisDto;

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
  getAllSubCategoreis = async (
    req: IAuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    assertAdminOrSuperAdmin(req.user, next);

    const data = { ...req.query } as adminDTO.IFindSubCategoreisDto;

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
  getAllBrands = async (
    req: IAuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    assertAdminOrSuperAdmin(req.user, next);

    const data = { ...req.query } as adminDTO.IFindBrandsDto;

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

      if (!brand) return next(new ApiError("Brand not found", 404));

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

    const brands = await this.Brand.find({
      filter,
      select: data.select,
      sort: data.sort,
      page: data.page,
      populate: [
        { path: "createdBy", select: "firstName lastName email profilePic" },
      ],
    });
    return res.status(200).json(brands);
  };
  getAllCoupons = async (
    req: IAuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    assertAdminOrSuperAdmin(req.user, next);

    const data = { ...req.query } as adminDTO.IFindCouponsDto;

    if (data.couponId) {
      const cacheKey = `coupon:${data.couponId}`;
      const cachedCoupon = await cacheHandler.get(cacheKey);
      if (cachedCoupon) return res.status(200).json(cachedCoupon);

      const coupon = await this.Coupon.findOne({
        filter: { _id: data.couponId },
      });
      if (!coupon) return next(new ApiError("Coupon not found", 404));

      const now = new Date();
      const isExpired = coupon.expiresAt ? now > coupon.expiresAt : false;
      const isValid = coupon.isActive && !isExpired;

      return res.status(200).json({
        coupon,
        valid: isValid,
        isExpired,
      });
    }

    let coupons = await this.Coupon.find({
      select: data.select,
      sort: data.sort,
      page: data.page,
    });

    if (!coupons) return next(new ApiError("Coupon not found", 404));
    return res.status(200).json(coupons);
  };
  getAllReviews = async (
    req: IAuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    assertAdminOrSuperAdmin(req.user, next);

    const data = { ...req.query } as adminDTO.IFindReviewsDto;

    const reviews = await this.Review.find({
      filter: {
        $or: [
          { productId: data.productId },
          { createdBy: data.userId },
          { _id: data.reviewId },
          {},
        ],
      },
      select: data.select,
      sort: data.sort,
      page: data.page,
      populate: [
        { path: "createdBy", select: "firstName lastName email profilePic" },
        {
          path: "productId",
          select:
            "name image price gallary colors stock folderId categoryId subCategoryId brandId description -_id",
        },
      ],
    });
    return res.status(200).json(reviews);
  };
  getOrders = async (req: IAuthRequest, res: Response, next: NextFunction) => {
    assertAdminOrSuperAdmin(req.user, next);

    const data = { ...req.query } as adminDTO.IFindOrdersDto;

    if (data.orderId && data.userId) {
      const order = await this.Order.findOne({
        filter: { _id: data.orderId, createdBy: data.userId },
        populate: [
          {
            path: "createdBy",
            select: "firstName lastName email profilePic",
          },
        ],
      });

      if (!order) return next(new ApiError("Order not found", 404));

      return res.status(200).json(order);
    }

    if (data.orderId) {
      const order = await this.Order.findOne({
        filter: { _id: data.orderId },
        populate: [
          { path: "createdBy", select: "firstName lastName email profilePic" },
        ],
      });
      if (!order) return next(new ApiError("Order not found", 404));

      return res.status(200).json(order);
    }

    if (data.userId) {
      const orders = await this.Order.find({
        filter: { createdBy: data.userId },
        select: data.select,
        sort: data.sort,
        page: data.page,
        populate: [
          { path: "createdBy", select: "firstName lastName email profilePic" },
        ],
      });

      if (!orders)
        return next(new ApiError("not found orders for this user", 404));

      return res.status(200).json(orders);
    }

    const orders = await this.Order.find({
      select: data.select,
      sort: data.sort,
      page: data.page || 1,
      populate: [
        { path: "createdBy", select: "firstName lastName email profilePic" },
      ],
    });
    return res.status(200).json(orders);
  };
  updateOrderStatus = async (
    req: IAuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    assertAdminOrSuperAdmin(req.user, next);

    const data = {
      status: req.body.status,
      orderId: new Types.ObjectId(req.params.orderId),
    } as adminDTO.IUpdateOrderStatusDto;
    const order = await this.Order.findOne({
      filter: { _id: data.orderId },
      populate: [
        { path: "createdBy", select: "firstName lastName email profilePic" },
      ],
    });

    if (!order) return next(new ApiError("Order not found", 404));

    order.status = data.status;
    await order.save();
    return res.status(200).json(order);
  };
  deletedOrder = async (
    req: IAuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    assertAdminOrSuperAdmin(req.user, next);

    const orderId = new Types.ObjectId(req.params.orderId);

    const order = await this.Order.findById(orderId);
    if (!order) return next(new ApiError("Order not found", 404));

    await this.Order.deleteOne({ _id: orderId });
    return res.status(200).json({ message: "Order deleted successfully" });
  };
}
export default new AdminService();
