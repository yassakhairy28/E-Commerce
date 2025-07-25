import DatabaseServices from "../DB/DBservices.ts";
import { discountTypes, ICoupon, IProduct, IUser } from "../types/types.ts";
import couponModel from "../DB/models/coupon.model.ts";
import { ApiError } from "../middlewares/error.handler.middleware.ts";

export const checkCoupon = async (
  couponCode: string,
  user: IUser
): Promise<ICoupon> => {
  const Coupon = new DatabaseServices<ICoupon>(couponModel);

  const coupon = await Coupon.findOne({
    filter: { code: couponCode, isActive: true },
  });

  if (!coupon) throw new ApiError("Coupon not found", 404);

  if (coupon.expiresAt && coupon.expiresAt < new Date())
    throw new ApiError("Coupon expired", 409);

  if (coupon.usedBy.includes(user._id))
    throw new ApiError("Coupon already used", 409);

  if (coupon.maxUses && coupon.usedBy.length >= coupon.maxUses)
    throw new ApiError("Coupon limit reached", 409);

  return coupon;
};

export const isGeneralCoupon = (coupon: ICoupon): boolean => {
  const isGeneral =
    coupon.subCategoriesId?.length ||
    coupon.productsIds?.length ||
    coupon.brandsIds?.length;

  return !isGeneral;
};

export const applySpecificCoupon = (
  coupon: ICoupon,
  product: IProduct
): number => {
  const isCouponApplicable =
    coupon.subCategoriesId?.includes(product.subCategoryId) ||
    coupon.productsIds?.includes(product._id) ||
    coupon.brandsIds?.includes(product.brandId);

  if (!isCouponApplicable) {
    return product.price; // No discount
  }

  if (coupon.minOrderValue && product.price <= coupon.minOrderValue) {
    throw new ApiError("Order value is less than min order value", 400);
  }

  if (coupon.discountType === discountTypes.percentage) {
    return product.price - (product.price * coupon.discount) / 100;
  }

  return product.price - coupon.discount;
};

export const applyGeneralCoupon = (
  subTotal: number,
  coupon: ICoupon
): number => {
  const isGeneralCoupon =
    coupon.subCategoriesId?.length ||
    coupon.productsIds?.length ||
    coupon.brandsIds?.length;

  if (isGeneralCoupon) return subTotal;

  if (coupon.minOrderValue && subTotal <= coupon.minOrderValue) {
    throw new ApiError("Order value is less than min order value", 400);
  }

  if (coupon.discountType === discountTypes.percentage) {
    return subTotal - (subTotal * coupon.discount) / 100;
  }

  return subTotal - coupon.discount;
};
