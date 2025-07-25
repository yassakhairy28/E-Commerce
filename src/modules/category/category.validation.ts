import joi from "joi";
import { generalFields } from "../../middlewares/validation.middleware";
export const createCategorySchema = {
  body: joi
    .object({
      name: generalFields.name.required(),
      logo: generalFields.fileObject.optional(),
    })
    .required(),
};

export const updateCategorySchema = {
  body: joi.object({
    name: generalFields.name.optional(),
    logo: generalFields.fileObject.optional(),
  }),
  params: joi
    .object({
      categoryId: generalFields.id.required(),
    })
    .required(),
};

export const getCategorySchema = {
  query: joi.object({
    categoryId: generalFields.id.optional(),
    name: generalFields.name.optional(),
    select: generalFields.select.optional(),
    sort: generalFields.sort.optional(),
    page: generalFields.page.optional(),
  }),
};
