import joi from "joi";
import { generalFields } from "../../middlewares/validation.middleware.ts";

export const createReviewSchema = {
  body: joi
    .object({
      productId: generalFields.id.required(),
      text: generalFields.text.required(),
      rating: generalFields.rating.required(),
    })
    .required(),
};

export const updateReviewSchema = {
  params: joi
    .object({
      reviewId: generalFields.id.required(),
    })
    .required(),
  body: joi.object({
    text: generalFields.text.optional(),
    rating: generalFields.rating.optional(),
  }),
};

export const getReviewSchema = {
  params: joi
    .object({
      reviewId: generalFields.id.required(),
    })
    .required(),
};

export const getAllReviewByUserSchema = {
  query: joi.object({
    page: generalFields.page.optional(),
  }),
};
export const getAllReviewByProductSchema = {
  body: joi.object({
    productId: generalFields.id.required(),
    page: generalFields.page.optional(),
  }),
};
