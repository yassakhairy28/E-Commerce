import { NextFunction, RequestHandler, Response } from "express";
import { IAuthRequest, IUser, userRole } from "../types/types";
import { generateToken, verifyToken } from "../utils/token/token";
import { ApiError, asyncHandler } from "./error.handler.middleware";
import DatabaseServices from "../DB/DBservices";
import userModel from "../DB/models/user.model";

export const auth = () => {
  return asyncHandler(
    async (req: IAuthRequest, res: Response, next: NextFunction) => {
      const User = new DatabaseServices<IUser>(userModel);
      const { authorization } = req.headers as { authorization?: string };

      if (!authorization) return next(new ApiError("Unauthorized", 401));
      if (
        !authorization?.startsWith(`${userRole.User} `) &&
        !authorization?.startsWith(`${userRole.Admin} `) &&
        !authorization?.startsWith(`${userRole.SuperAdmin} `)
      )
        return next(new ApiError("Unauthorized", 401));

      const [Bearer, token] = authorization.split(" ");
      if (!Bearer || !token) return next(new ApiError("Unauthorized", 401));

      let signature: string = "";

      switch (Bearer) {
        case userRole.User:
          signature = process.env.ACCESS_TOKEN_USER as string;
          break;
        case userRole.Admin:
          signature = process.env.ACCESS_TOKEN_ADMIN as string;
          break;
        case userRole.SuperAdmin:
          signature = process.env.ACCESS_TOKEN_SuperAdmin as string;
          break;
        default:
          return next(new ApiError("Unauthorized", 401));
      }

      const decodedToken = verifyToken(token, signature);
      if (!decodedToken || !decodedToken.id)
        return next(new ApiError("Invalid token", 401));

      const user = await User.findOne({
        filter: {
          _id: decodedToken.id,
          "delete.isDeleted": false,
          "block.isBlocked": false,
        },
      });
      if (!user) return next(new ApiError("User Not Found", 401));

      if (user.role !== Bearer) return next(new ApiError("Unauthorized", 401));

      if (decodedToken.exp! < Date.now() / 1000)
        return next(new ApiError("Token Expired", 401));

      if (!user.isConfirmed)
        return next(new ApiError("Email not confirmed", 401));

      req.user = user;
      return next();
    }
  );
};

export const allowTo = (roles: string[]): RequestHandler => {
  return (req, res, next) => {
    const { user } = req as IAuthRequest;

    if (!user || !roles.includes(user.role)) {
      return next(new ApiError("Forbidden", 401));
    }

    next();
  };
};

export const generateAccessToken = (user: IUser): string => {
  const token = generateToken(
    { id: user._id },
    user.role === userRole.SuperAdmin
      ? (process.env.ACCESS_TOKEN_SuperAdmin as string)
      : user.role === userRole.Admin
      ? (process.env.ACCESS_TOKEN_ADMIN as string)
      : (process.env.ACCESS_TOKEN_USER as string),
    {
      expiresIn: "1h",
    }
  );

  return token;
};
export const generateRefreshToken = (user: IUser): string => {
  const token = generateToken(
    { id: user._id },
    user.role === userRole.SuperAdmin
      ? (process.env.REFRESH_TOKEN_SuperAdmin as string)
      : user.role === userRole.Admin
      ? (process.env.REFRESH_TOKEN_ADMIN as string)
      : (process.env.REFRESH_TOKEN_USER as string),
    {
      expiresIn: "7d",
    }
  );

  return token;
};
