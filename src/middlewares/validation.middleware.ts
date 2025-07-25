import joi, { ObjectSchema } from "joi";
import { Types } from "mongoose";
import { discountTypes, IPaymentMethod, userRole } from "../types/types";
import { asyncHandler } from "./error.handler.middleware";
import { NextFunction, Request, Response } from "express";
import { parseExpiresAt } from "../helper/dateHandle.ts";

export const validation = (schema: Record<string, ObjectSchema>) => {
  return asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const schemaKeys = Object.keys(schema);

      const validationErrors: { key: string; errors: string[] }[] = [];

      for (const key of schemaKeys) {
        const { error } = schema[key].validate(req[key as keyof Request], {
          abortEarly: false,
        });

        if (error) {
          validationErrors.push({
            key,
            errors: error.details.map((e) => e.message),
          });
        }
      }

      if (validationErrors.length) {
        return res
          .status(400)
          .json({ message: "Validation Error", validationErrors });
      }

      next();
    }
  );
};

export const generalFields = {
  name: joi.string().min(2).max(30),
  email: joi.string().email(),
  password: joi
    .string()
    .pattern(
      new RegExp(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!#%*?&])[A-Za-z\d@$!%*?&]{8,}$/
      )
    )
    .message(
      "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character."
    ),
  confirmPassword: joi.string().valid(joi.ref("password")).min(6),
  file: joi.object({
    secure_url: joi.string(),
    public_id: joi.string(),
  }),
  mobileNumber: joi
    .string()
    .pattern(new RegExp(/^(\+201|01|00201)[0-2,5]{1}[0-9]{8}/))
    .message("in-valid mobile number"),
  role: joi.string().custom((value, helper: any) => {
    return Object.values(userRole).includes(value)
      ? true
      : helper.message("in-valid role");
  }),
  id: joi.string().custom((value, helper: any) => {
    return Types.ObjectId.isValid(value)
      ? value
      : helper.message("in-valid id");
  }),
  fileObject: joi.object({
    fieldname: joi.string().required(),
    originalname: joi.string().required(),
    encoding: joi.string().required(),
    mimetype: joi.string().required(),
    buffer: joi.any().required(),
    size: joi.number().required(),
  }),
  otp: joi.string().pattern(/^[0-9]{6}$/),
  age: joi.number().min(16),
  address: joi.string(),
  token: joi.string().pattern(/^(Admin|User)\s[\w-]+\.[\w-]+\.[\w-]+$/),
  select: joi.string().min(1),
  sort: joi.string().min(1),
  populate: joi.array().items(joi.string()),
  page: joi.number().min(1),
  description: joi.string().min(4).max(4000),
  price: joi.number().min(0.01),
  discount: joi
    .number()
    .min(1)
    .message("can`t be less than 1%")
    .max(100)
    .message("can`t be more than 100%"),
  discountType: joi.string().custom((value, helper: any) => {
    return Object.values(discountTypes).includes(value)
      ? true
      : helper.message("in-valid discountType");
  }),
  colors: joi.array().items(joi.string()),
  size: joi.string().valid("S", "M", "L", "XL", "XXL", "XXXL"),
  stock: joi.number().min(1),
  quantity: joi.number().min(1),
  code: joi
    .string()
    .pattern(/^[A-Za-z0-9]{2,20}$/)
    .min(0)
    .max(20),
  expiresAt: joi
    .string()
    .pattern(/^(\d{4}-\d{2}-\d{2}T.*Z$)|^(\d{1,2}-\d{1,2}-\d{4})$/),
  text: joi.string().min(4).max(4000),
  paymentMethod: joi.string().custom((value, helper: any) => {
    return Object.values(IPaymentMethod).includes(value)
      ? true
      : helper.message("in-valid paymentMethod");
  }),
  rating: joi.number().min(1).max(5),
};
