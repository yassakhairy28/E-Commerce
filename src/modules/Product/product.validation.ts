import joi from "joi";
import { generalFields } from "../../middlewares/validation.middleware.ts";

export const createProductSchema = {
  body: joi.object({
    subCategoryId: generalFields.id.required(),
    brandId: generalFields.id.required(),
    name: generalFields.name.required(),
    description: generalFields.description.required(),
    stock: generalFields.stock.required(),
    price: generalFields.price.required(),
    discount: generalFields.discount.optional(),
    colors: generalFields.colors.optional(),
    size: generalFields.size.optional(),
  }),
  files: joi.object({
    image: joi.array().items(generalFields.fileObject).required(),
    gallary: joi.array().items(generalFields.fileObject).optional(),
  }),
};

export const updateProductSchema = {
  params: joi
    .object({
      productId: generalFields.id.required(),
    })
    .required(),
  files: joi.object({
    image: joi.array().items(generalFields.fileObject).optional(),
    gallary: joi.array().items(generalFields.fileObject).optional(),
  }),
  body: joi.object({
    subCategoryId: generalFields.id.optional(),
    name: generalFields.name.optional(),
    description: generalFields.description.optional(),
    stock: generalFields.stock.optional(),
    price: generalFields.price.optional(),
    discount: generalFields.discount.optional(),
    colors: generalFields.colors.optional(),
    size: generalFields.size.optional(),
  }),
};

export const findProductSchema = {
  query: joi.object({
    subCategoryId: generalFields.id.optional(),
    productId: generalFields.id.optional(),
    name: generalFields.name.optional(),
    select: generalFields.select.optional(),
    sort: generalFields.sort.optional(),
    page: generalFields.page.optional(),
  }),
};
