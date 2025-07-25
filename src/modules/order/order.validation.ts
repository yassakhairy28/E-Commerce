import joi from "joi";
import { generalFields } from "../../middlewares/validation.middleware.ts";

export const createOrderSchema = {
  body: joi
    .object({
      address: generalFields.address.required(),
      phone: generalFields.mobileNumber.required(),
      note: generalFields.text.optional(),
      couponCode: generalFields.code.optional(),
      paymentMethod: generalFields.paymentMethod.required(),
    })
    .required(),
};

export const getOrderSchema = {
  params: joi
    .object({
      orderId: generalFields.id.required(),
    })
    .required(),
};
