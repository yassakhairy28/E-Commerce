import joi from "joi";
import { generalFields } from "../../middlewares/validation.middleware.ts";

export const createSubCategorySchema = {
  body: joi
    .object({
      name: generalFields.name.required(),
      categoryId: generalFields.id.required(),
    })
    .required(),
  file: generalFields.fileObject.required(),
};

export const updateSubCategorySchema = {
  body: joi.object({
    name: generalFields.name.optional(),
  }),
  params: joi.object({
    subCategoryId: generalFields.id.required(),
  }),
  file: generalFields.fileObject.optional(),
};

export const getSubCategorySchema = {
  query: joi.object({
    subCategoryId: generalFields.id.optional(),
    name: generalFields.name.optional(),
    select: generalFields.select.optional(),
    sort: generalFields.sort.optional(),
    page: generalFields.page.optional(),
  }),
};
