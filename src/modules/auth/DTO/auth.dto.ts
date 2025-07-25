import { userRole } from "../../../types/types";

export interface ISignUpDto {
  firstName: string;
  lastName: string;
  email: string;
  role: userRole;
  password: string;
  confirmPassword: string;
  mobileNumber: string;
  age: number;
  address: string;
}

export interface IConfirmEmailDto {
  email: string;
  otp: string;
}

export interface ISignInDto {
  email: string;
  password: string;
}

export interface IConfirmSignInDto {
  email: string;
  otp: string;
}

export interface IForgetPasswordDto {
  email: string;
}

export interface IResetPasswordDto {
  email: string;
  otp: string;
  password: string;
  confirmPassword: string;
}
