import { Router } from "express";
import { allowTo, auth } from "../../middlewares/auth.middleware.ts";
import { asyncHandler } from "../../middlewares/error.handler.middleware.ts";
import userService from "./user.service.ts";
import { validation } from "../../middlewares/validation.middleware.ts";
import * as userValidation from "./user.validation.ts";
import {
  allowedfiles,
  allowedfilesFilterForSharp,
  filesFilter,
  upload,
} from "../../middlewares/multer.middleware.ts";

const userRouter: Router = Router();

userRouter.get(
  "/:userId",
  auth(),
  allowTo(["Admin", "User"]),
  validation(userValidation.getProfileSchema),
  asyncHandler(userService.getProfile)
);

userRouter.patch(
  "/:userId",
  auth(),
  allowTo(["Admin", "User"]),
  validation(userValidation.updateProfileSchema),
  asyncHandler(userService.updateProfile)
);

userRouter.patch(
  "/:userId/profilePic",
  auth(),
  allowTo(["Admin", "User"]),
  upload.single("profilePic"),
  filesFilter(allowedfiles.image, allowedfilesFilterForSharp.image),
  validation(userValidation.uploadProfilePicSchema),
  asyncHandler(userService.uploadProfilePic)
);

userRouter.delete(
  "/:userId/profilePic",
  auth(),
  allowTo(["Admin", "User"]),
  validation(userValidation.getProfileSchema),
  asyncHandler(userService.deleteProfilePic)
);

userRouter.patch(
  "/updatePassword",
  auth(),
  allowTo(["Admin", "User"]),
  validation(userValidation.updatePasswordSchema),
  asyncHandler(userService.updatePassword)
);

export default userRouter;
