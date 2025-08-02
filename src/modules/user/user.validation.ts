import joi from "joi";
import { generalFields } from "../../middlewares/validation.middleware";

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
};

export const uploadProfilePicSchema = {
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
