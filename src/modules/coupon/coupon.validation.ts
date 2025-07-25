import joi from "joi";
import { generalFields } from "../../middlewares/validation.middleware.ts";

export const createCouponSchema = {
  body: joi.object({
    name: generalFields.name.required(),
    code: generalFields.code.required(),
    discount: generalFields.discount.required(),
    discountType: generalFields.discountType.required(),
    productsIds: joi.array().items(generalFields.id).optional(),
    subCategoriesId: joi.array().items(generalFields.id).optional(),
    brandsIds: joi.array().items(generalFields.id).optional(),
    expiresAt: generalFields.expiresAt.optional(),
    isActivate: joi.boolean().optional(),
    maxUses: joi.number().optional(),
    minOrderValue: joi.number().required(),
  }),
};

export const getCouponSchema = {
  params: joi.object({
    code: generalFields.code.required(),
  }),
};

export const updateCouponSchema = {
  params: joi.object({
    code: generalFields.code.required(),
  }),
  body: joi.object({
    name: generalFields.name,
    discount: generalFields.discount,
    discountType: generalFields.discountType,
    expiresAt: generalFields.expiresAt,
    productids: joi.array().items(generalFields.id).optional(),
    subCategoriesId: joi.array().items(generalFields.id).optional(),
    brandsIds: joi.array().items(generalFields.id).optional(),
    maxUses: joi.number(),
    minOrderValue: joi.number(),
  }),
};
