import { NextFunction, Response } from "express";
import DatabaseServices from "../../DB/DBservices.ts";
import userModel, {
  defaultProfilePic,
  defaultPublicIdOnCloud,
} from "../../DB/models/user.model.ts";
import {
  IAuthAndUploadRequest,
  IAuthRequest,
  IFile,
  IUser,
  userRole,
} from "../../types/types.ts";
import { ApiError } from "../../middlewares/error.handler.middleware.ts";
import { cacheHandler } from "../../utils/cashing/cacheHandler.ts";
import { decrypt, encrypt } from "../../utils/encryption/encryption.ts";
import { config } from "dotenv";
import * as userDTO from "./DTO/user.dto.ts";
import { Types } from "mongoose";
import { fileDelete, fileUpload } from "../../middlewares/multer.middleware.ts";
import { compare, hash } from "../../utils/hash/hash.ts";
config({ path: "../../config/.env" });

class UserService {
  private User = new DatabaseServices<IUser>(userModel);

  getProfile = async (req: IAuthRequest, res: Response, next: NextFunction) => {
    const { userId } = req.params;

    if (
      String(req.user._id) !== String(userId) &&
      req.user.role !== userRole.Admin
    )
      return next(
        new ApiError("You are not authorized to view this profile", 403)
      );

    const cashUser = await cacheHandler.get(userId);
    if (cashUser) {
      return res.status(200).json({ cashUser });
    }

    let user: IUser | null = await this.User.findOne({
      filter: { _id: userId },
      select:
        "firstName lastName email mobileNumber age profilePic address -_id",
    });

    // check if user exists
    if (!user) return next(new ApiError("User not found", 404));

    user.mobileNumber = decrypt({
      payload: user?.mobileNumber,
      signature: process.env.MOBILENUMBER as string,
    });

    cacheHandler.set(userId, user, 300);

    return res.status(200).json({ user });
  };
  updateProfile = async (
    req: IAuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    const { userId } = req.params;
    const data = { ...req.body } as userDTO.IUpdateProfileDto;

    if (
      String(req.user._id) !== String(userId) &&
      req.user.role !== userRole.Admin
    )
      return next(
        new ApiError("You are not authorized to edit this profile", 403)
      );

    if (data.mobileNumber) {
      data.mobileNumber = encrypt({
        payload: data.mobileNumber,
        signature: process.env.MOBILENUMBER as string,
      });
    }
    const user = await this.User.findOneAndUpdate({
      filter: { _id: userId },
      update: { ...data },
      select:
        "firstName lastName email mobileNumber age profilePic address -_id",
    });

    if (!user) return next(new ApiError("Something went wrong", 500));

    cacheHandler.del(userId);

    return res.status(200).json({ message: "User updated successfully", user });
  };
  uploadProfilePic = async (
    req: IAuthAndUploadRequest,
    res: Response,
    next: NextFunction
  ) => {
    const userId = new Types.ObjectId(req.params.userId);
    const profilePic = req.file as IFile;

    const user = await this.User.findById(userId);
    if (!user) return next(new ApiError("User not found", 404));

    const { secure_url, public_id } = await fileUpload(profilePic, {
      folder: `E-Commerce/users/${userId}/profilePicture`,
    });

    if (user.profilePic?.public_id !== defaultPublicIdOnCloud) {
      await fileDelete(user.profilePic.public_id);
    }

    user.profilePic = { secure_url, public_id };
    await user.save();
    await cacheHandler.del(String(userId));
    return res
      .status(200)
      .json({ success: true, message: "Profile picture uploaded" });
  };
  deleteProfilePic = async (
    req: IAuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    const userId = new Types.ObjectId(req.params.userId);
    const user = await this.User.findById(userId);
    if (!user) return next(new Error("User not found", { cause: 404 }));

    if (user.profilePic.public_id === defaultPublicIdOnCloud)
      return next(new ApiError("Don't have a profile picture", 400));

    const public_id = user.profilePic.public_id;
    user.profilePic.secure_url = defaultProfilePic;
    user.profilePic.public_id = defaultPublicIdOnCloud;
    await fileDelete(public_id);
    await user.save();
    await cacheHandler.del(String(userId));
    return res
      .status(200)
      .json({ success: true, message: "Profile picture deleted" });
  };
  updatePassword = async (
    req: IAuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    const data = {
      ...req.body,
      userId: req.params.userId,
    } as userDTO.IUpdatePasswordDto;

    const user = await this.User.findById(req.user._id);
    if (!user) return next(new ApiError("User not found", 404));

    const isValidPassword = compare(data.oldPassword, user.password);

    if (!isValidPassword) return next(new ApiError("Invalid password", 400));

    const isSamePassword = compare(data.password, user.password);

    if (isSamePassword)
      return next(
        new ApiError(
          "New password must be different from the old password",
          400
        )
      );

    if (data.password !== data.confirmPassword)
      return next(new ApiError("Password doesn't match", 400));

    user.password = hash({ plainText: data.password });
    await user.save();
    return res
      .status(200)
      .json({ success: true, message: "Password updated successfully" });
  };
}

export default new UserService();
