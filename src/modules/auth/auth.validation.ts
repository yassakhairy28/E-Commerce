import { generalFields } from "../../middlewares/validation.middleware";
import joi from "joi";
export const signUpSchema = {
  body: joi.object({
    firstName: generalFields.name.required(),
    lastName: generalFields.name.required(),
    email: generalFields.email.required(),
    password: generalFields.password.required(),
    confirmPassword: generalFields.confirmPassword.required(),
    mobileNumber: generalFields.mobileNumber.required(),
    age: generalFields.age.required(),
    address: generalFields.address.required(),
    role: generalFields.role,
  }),
};

export const resendOtpSchema = {
  body: joi.object({
    email: generalFields.email.required(),
  }),
};

export const confirmEmailSchema = {
  body: joi.object({
    email: generalFields.email.required(),
    otp: generalFields.otp.required(),
  }),
};

export const signInSchema = {
  body: joi.object({
    email: generalFields.email.required(),
    password: generalFields.password.required(),
  }),
};

export const confirmSignInSchema = {
  body: joi.object({
    email: generalFields.email.required(),
    otp: generalFields.otp.required(),
  }),
};

export const forgotPasswordSchema = {
  body: joi.object({
    email: generalFields.email.required(),
  }),
};

export const resetPasswordSchema = {
  body: joi.object({
    email: generalFields.email.required(),
    otp: generalFields.otp.required(),
    password: generalFields.password.required(),
    confirmPassword: generalFields.confirmPassword.required(),
  }),
};

export const refreshTokenSchema = {
  headers: joi
    .object({
      authorization: generalFields.token.required(),
    })
    .unknown(true),
};
