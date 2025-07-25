import joi from "joi";
import { generalFields } from "../../middlewares/validation.middleware.ts";

export const createBrandSchema = {
  body: joi
    .object({
      name: generalFields.name.required(),
    })
    .required(),
  file: generalFields.fileObject.required(),
};

export const updateBrandSchema = {
  body: joi.object({
    name: generalFields.name.optional(),
  }),
  params: joi.object({
    brandId: generalFields.id.required(),
  }),
  file: generalFields.fileObject.optional(),
};

export const getSubBrandSchema = {
  query: joi.object({
    brandId: generalFields.id.optional(),
    name: generalFields.name.optional(),
    select: generalFields.select.optional(),
    sort: generalFields.sort.optional(),
    page: generalFields.page.optional(),
  }),
};
