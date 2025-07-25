import { NextFunction, Request, Response } from "express";
import userModel from "../../DB/models/user.model";
import { ApiError } from "../../middlewares/error.handler.middleware";
import { emailEmitter } from "./emailEvent";

const resendOtp = (subject: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) return next(new ApiError("User not found", 404));

    if (!user.OTP || !Array.isArray(user.OTP)) {
      return next(new ApiError("OTP data is missing or invalid", 400));
    }
    const otpData = user.OTP?.find((otp: any) => otp.type === subject);
    if (!otpData) return next(new ApiError("OTP data not found", 400));

    if (otpData.waitingTime && otpData.waitingTime > Date.now()) {
      const remainingTime = Math.ceil(
        (otpData.waitingTime - Date.now()) / 60000
      );
      return next(
        new ApiError(
          `Please wait for ${remainingTime} minutes and try again`,
          409
        )
      );
    }
    otpData.countOfSentCode++;

    switch (otpData.countOfSentCode) {
      case 3:
        otpData.waitingTime = Date.now() + 1 * 60 * 1000;
        otpData.lastSentCount = 1;
        break;
      case 5:
        otpData.waitingTime = Date.now() + 3 * 60 * 1000;
        otpData.lastSentCount = 3;
        break;
      case 7:
        otpData.waitingTime = Date.now() + 5 * 60 * 1000;
        otpData.lastSentCount = 5;
        break;
      case 9:
        otpData.waitingTime = Date.now() + 60 * 60 * 1000;
        otpData.lastSentCount = 7;
        break;
      default:
        break;
    }

    emailEmitter.emit("sendEmail", user.email, user.fullName, subject);
    await user.save();

    return res
      .status(200)
      .json({ success: true, message: "Code Sent Successfully" });
  };
};

export default resendOtp;
