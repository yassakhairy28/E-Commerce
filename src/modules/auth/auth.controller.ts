import { Router } from "express";
import { validation } from "../../middlewares/validation.middleware";
import * as authValidation from "./auth.validation";
import { asyncHandler } from "../../middlewares/error.handler.middleware";
import authService from "./auth.service";
import resendOtp from "../../utils/email/resendOtp";
import { OtpType } from "../../types/types";
const authRouter: Router = Router();

authRouter.post(
  "/signUp",
  validation(authValidation.signUpSchema),
  asyncHandler(authService.signUp)
);

authRouter.post(
  "/resendOtpSignUp",
  validation(authValidation.resendOtpSchema),
  asyncHandler(resendOtp(OtpType.register))
);

authRouter.post(
  "/confirmEmail",
  validation(authValidation.confirmEmailSchema),
  asyncHandler(authService.confirmEmail)
);

authRouter.post(
  "/signIn",
  validation(authValidation.signInSchema),
  asyncHandler(authService.signIn)
);

authRouter.post(
  "/resendOtpSignIn",
  validation(authValidation.resendOtpSchema),
  asyncHandler(resendOtp(OtpType.login))
);

authRouter.post(
  "/confirmSignIn",
  validation(authValidation.confirmSignInSchema),
  asyncHandler(authService.confirmSignIn)
);

authRouter.post(
  "/forgetPassword",
  validation(authValidation.forgotPasswordSchema),
  asyncHandler(authService.forgotPassword)
);

authRouter.post(
  "/resendOtpForgetPassword",
  validation(authValidation.resendOtpSchema),
  asyncHandler(resendOtp(OtpType.forgetPassword))
);

authRouter.post(
  "/resetPassword",
  validation(authValidation.resetPasswordSchema),
  asyncHandler(authService.resetPassword)
);

authRouter.get(
  "/refreshToken",
  validation(authValidation.refreshTokenSchema),
  asyncHandler(authService.refreshToken)
);


export default authRouter;
