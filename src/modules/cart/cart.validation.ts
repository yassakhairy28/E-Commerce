import joi from "joi";
import { generalFields } from "../../middlewares/validation.middleware.ts";

export const addToCartSchema = {
  body: joi
    .object({
      productId: generalFields.id.required(),
      quantity: generalFields.quantity.required(),
    })
    .required(),
};

export const deleteFromCartSchema = {
  params: joi
    .object({
      productId: generalFields.id.required(),
    })
    .required(),
};
