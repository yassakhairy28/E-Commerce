import joi from "joi";
import { generalFields } from "../../middlewares/validation.middleware";

export const getProfileSchema = {
  params: joi
    .object({
      userId: generalFields.id.required(),
    })
    .required(),
};

export const updateProfileSchema = {
  body: joi
    .object({
      firstName: generalFields.name,
      lastName: generalFields.name,
      age: generalFields.age,
      mobileNumber: generalFields.mobileNumber,
      adress: generalFields.address,
    })
    .required(),
  params: joi
    .object({
      userId: generalFields.id.required(),
    })
    .required(),
};

export const uploadProfilePicSchema = {
  params: joi
    .object({
      userId: generalFields.id.required(),
    })
    .required(),
  file: generalFields.fileObject.required(),
};

export const updatePasswordSchema = {
  body: joi
    .object({
      oldPassword: generalFields.password.required(),
      password: generalFields.password.required(),
      confirmPassword: generalFields.confirmPassword.required(),
    })
    .required(),
};
