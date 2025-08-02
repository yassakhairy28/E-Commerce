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
import { userRole } from "../../types/types.ts";

const userRouter: Router = Router();

userRouter.get(
  "/",
  auth(),
  allowTo([userRole.Admin, userRole.User, userRole.SuperAdmin]),
  asyncHandler(userService.getProfile)
);

userRouter.patch(
  "/",
  auth(),
  allowTo([userRole.Admin, userRole.User, userRole.SuperAdmin]),
  validation(userValidation.updateProfileSchema),
  asyncHandler(userService.updateProfile)
);

userRouter.patch(
  "/profilePic",
  auth(),
  allowTo([userRole.Admin, userRole.User, userRole.SuperAdmin]),
  upload.single("profilePic"),
  filesFilter(allowedfiles.image, allowedfilesFilterForSharp.image),
  validation(userValidation.uploadProfilePicSchema),
  asyncHandler(userService.uploadProfilePic)
);

userRouter.delete(
  "/profilePic",
  auth(),
  allowTo([userRole.Admin, userRole.User, userRole.SuperAdmin]),
  asyncHandler(userService.deleteProfilePic)
);

userRouter.patch(
  "/updatePassword",
  auth(),
  allowTo([userRole.Admin, userRole.User, userRole.SuperAdmin]),
  validation(userValidation.updatePasswordSchema),
  asyncHandler(userService.updatePassword)
);

userRouter.delete(
  "/",
  auth(),
  allowTo([userRole.Admin, userRole.User, userRole.SuperAdmin]),
  asyncHandler(userService.deleteProfile)
);

export default userRouter;
