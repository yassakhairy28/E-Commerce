import { Types } from "mongoose";

export interface IUpdateProfileDto {
  firstName?: string;
  lastName?: string;
  age?: number;
  mobileNumber?: string;
  address?: string;
}

export interface IUpdatePasswordDto {
  oldPassword: string;
  password: string;
  confirmPassword: string;
}
