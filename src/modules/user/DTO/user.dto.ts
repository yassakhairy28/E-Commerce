import { Types } from "mongoose";

export interface IUpdateProfileDto {
  userId: Types.ObjectId;
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
