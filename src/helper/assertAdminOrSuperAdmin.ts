import { NextFunction } from "express";
import { IUser, userRole } from "../types/types";
import { ApiError } from "../middlewares/error.handler.middleware";

const assertAdminOrSuperAdmin = (user: IUser, next: NextFunction) => {
  if (![userRole.Admin, userRole.SuperAdmin].includes(user.role)) {
    return next(new ApiError("Unauthorized", 403));
  }
};

export default assertAdminOrSuperAdmin;
