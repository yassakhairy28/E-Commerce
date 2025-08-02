import joi from "joi";
import { generalFields } from "../../middlewares/validation.middleware.ts";

const paginationOptions = {
  select: generalFields.select.optional(),
  sort: generalFields.sort.optional(),
  page: generalFields.page.optional(),
};

export const updateUserRoleSchema = {
  params: joi
    .object({
      userId: generalFields.id.required(),
    })
    .required(),
  body: joi
    .object({
      role: generalFields.role.required(),
    })
    .required(),
};

export const getUserSchema = {
  params: joi
    .object({
      userId: generalFields.id.required(),
    })
    .required(),
};

export const getUsersSchema = {
  query: joi.object({
    userId: generalFields.id.optional(),
    name: generalFields.name.optional(),
    role: generalFields.role.optional(),
    ...paginationOptions,
  }),
};
export const getProductsSchema = {
  query: joi.object({
    productId: generalFields.id.optional(),
    name: generalFields.name.optional(),
    ...paginationOptions,
  }),
};
export const getCategoriesSchema = {
  query: joi.object({
    categoryId: generalFields.id.optional(),
    name: generalFields.name.optional(),
    ...paginationOptions,
  }),
};
export const getSubCategoriesSchema = {
  query: joi.object({
    subCategoryId: generalFields.id.optional(),
    name: generalFields.name.optional(),
    ...paginationOptions,
  }),
};
export const getBrandsSchema = {
  query: joi.object({
    brandId: generalFields.id.optional(),
    name: generalFields.name.optional(),
    ...paginationOptions,
  }),
};

export const getCouponsSchema = {
  query: joi.object({
    couponId: generalFields.id.optional(),
    name: generalFields.name.optional(),
    ...paginationOptions,
  }),
};

export const getReviewsSchema = {
  query: joi.object({
    reviewId: generalFields.id.optional(),
    productId: generalFields.id.optional(),
    userId: generalFields.id.optional(),
    ...paginationOptions,
  }),
};

export const getOrdersSchema = {
  query: joi.object({
    orderId: generalFields.id.optional(),
    userId: generalFields.id.optional(),
    ...paginationOptions,
  }),
};

export const updateOrderStatusSchema = {
  params: joi
    .object({
      orderId: generalFields.id.required(),
    })
    .required(),
  body: joi
    .object({
      status: generalFields.statusOrder.required(),
    })
    .required(),
};
export const deleteOrderSchema = {
  params: joi.object({
    orderId: generalFields.id.required(),
  }),
};
