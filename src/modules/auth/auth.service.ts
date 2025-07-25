import { Request, Response, NextFunction } from "express";
import DatabaseServices from "../../DB/DBservices";
import userModel from "../../DB/models/user.model";
import {
  IConfirmEmailDto,
  IConfirmSignInDto,
  IForgetPasswordDto,
  IResetPasswordDto,
  ISignInDto,
  ISignUpDto,
} from "./DTO/auth.dto";
import { ApiError } from "../../middlewares/error.handler.middleware";
import { emailEmitter } from "../../utils/email/emailEvent";
import { IOtpType, OtpType } from "../../types/types";
import { compare } from "../../utils/hash/hash";
import {
  generateAccessToken,
  generateRefreshToken,
} from "./../../middlewares/auth.middleware";
import { verifyToken } from "../../utils/token/token";

class AuthService {
  private User = new DatabaseServices(userModel);

  signUp = async (req: Request, res: Response, next: NextFunction) => {
    const data = { ...req.body } as ISignUpDto;

    const checkUser = await this.User.findOne({
      filter: { email: data.email },
    });

    if (checkUser) return next(new ApiError("User already exists", 409));

    emailEmitter.emit(
      "sendEmail",
      data.email,
      data.firstName,
      OtpType.register
    );

    const user = await this.User.create(data);
    return res.status(201).json(user);
  };

  confirmEmail = async (req: Request, res: Response, next: NextFunction) => {
    const data = { ...req.body } as IConfirmEmailDto;

    const user = await this.User.findOne({ filter: { email: data.email } });

    if (!user) return next(new ApiError("User not found", 404));

    if (user.confiemEmail)
      return next(new ApiError("User already confirmed", 409));

    if (!Array.isArray(user.OTP) || user.OTP.length == 0) {
      return next(new ApiError("OTP data is missing or invalid", 400));
    }

    const otpData = user.OTP.find(
      (otp: IOtpType) => otp.type === OtpType.register
    );

    if (!(otpData?.expiresIn instanceof Date)) {
      return next(new ApiError("Invalid OTP data", 400));
    }

    if (otpData?.expiresIn.getTime() < Date.now())
      return next(new ApiError("OTP Expired", 400));

    const compareOtp = compare(data.otp, otpData.code);

    if (compareOtp) {
      await this.User.findOneAndUpdate({
        filter: { email: data.email },
        update: { isConfirmed: true, OTP: [] },
      });
      return res.status(200).json({ message: "Email confirmed successfully" });
    } else {
      return next(new ApiError("Invalid OTP", 400));
    }
  };

  signIn = async (req: Request, res: Response, next: NextFunction) => {
    const data = { ...req.body } as ISignInDto;

    const user = await this.User.findOne({ filter: { email: data.email } });
    if (!user) return next(new ApiError("User Not Found", 404));

    if (!user.isConfirmed) return next(new ApiError("User Not Confirmed", 409));

    const comparePassword = compare(data.password, user.password);

    if (!comparePassword)
      return next(new ApiError("Invalid Email or Password", 401));

    emailEmitter.emit("sendEmail", data.email, user.firstName, OtpType.login);

    return res.status(200).json({ message: "please enter otp to login" });
  };

  confirmSignIn = async (req: Request, res: Response, next: NextFunction) => {
    const data = { ...req.body } as IConfirmSignInDto;

    const user = await this.User.findOne({ filter: { email: data.email } });
    if (!user) return next(new ApiError("User Not Found", 404));

    if (!Array.isArray(user.OTP) || user.OTP.length == 0) {
      return next(new ApiError("OTP data is missing or invalid", 400));
    }

    const otpData = user.OTP.find(
      (otp: IOtpType) => otp.type === OtpType.login
    );

    if (!(otpData?.expiresIn instanceof Date)) {
      return next(new ApiError("Invalid OTP data", 400));
    }

    if (otpData?.expiresIn.getTime() < Date.now())
      return next(new ApiError("OTP Expired", 400));

    const compareOtp = compare(data.otp, otpData.code);

    if (compareOtp) {
      await this.User.findOneAndUpdate({
        filter: { email: data.email },
        update: { OTP: [] },
      });

      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);
      return res.status(200).json({
        message: "Sign In successfully",
        Tokens: { accessToken, refreshToken },
      });
    } else {
      return next(new ApiError("Invalid OTP", 400));
    }
  };

  forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body as IForgetPasswordDto;

    const user = await this.User.findOne({ filter: { email } });
    if (!user) return next(new ApiError("User Not Found", 404));

    if (!user.isConfirmed) return next(new ApiError("User Not Confirmed", 409));

    emailEmitter.emit(
      "sendEmail",
      email,
      user.firstName,
      OtpType.forgetPassword
    );

    return res
      .status(200)
      .json({ message: "please enter otp to reset password" });
  };

  resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    const data = { ...req.body } as IResetPasswordDto;

    const user = await this.User.findOne({ filter: { email: data.email } });
    if (!user) return next(new ApiError("User Not Found", 404));

    if (!Array.isArray(user.OTP) || user.OTP.length == 0) {
      return next(new ApiError("OTP data is missing or invalid", 400));
    }

    const otpData = user.OTP.find(
      (otp: IOtpType) => otp.type === OtpType.forgetPassword
    );

    if (!(otpData?.expiresIn instanceof Date)) {
      return next(new ApiError("Invalid OTP data", 400));
    }

    if (otpData?.expiresIn.getTime() < Date.now())
      return next(new ApiError("OTP Expired", 400));

    const compareOtp = compare(data.otp, otpData.code);

    if (compareOtp) {
      user.password = data.password;
      user.OTP = [];
      await user.save();

      return res.status(200).json({ message: "Password reset successfully" });
    } else {
      return next(new ApiError("Invalid OTP", 400));
    }
  };
  refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    const { authorization } = req.headers;
    if (!authorization) return next(new ApiError("Unauthorized", 401));
    const [Bearer, token] = authorization.split(" ");
    if (!Bearer || !token) return next(new ApiError("Unauthorized", 401));

    let signature: string = "";

    switch (Bearer) {
      case "User":
        signature = process.env.REFRESH_TOKEN_USER as string;
        break;
      case "Admin":
        signature = process.env.REFRESH_TOKEN_ADMIN as string;
        break;
      default:
        return next(new ApiError("Unauthorized", 401));
    }

    const decodedToken = verifyToken(token, signature);

    const user = await this.User.findOne({ filter: { _id: decodedToken.id } });
    if (!user) return next(new ApiError("User Not Found", 401));

    if (user.role !== Bearer) return next(new ApiError("Unauthorized", 401));

    if (decodedToken.exp! < Date.now() / 1000)
      return next(new ApiError("Token expired", 401));

    if (!user.isConfirmed)
      return next(new ApiError("Email not confirmed", 401));

    await userModel.findOneAndUpdate(
      { _id: decodedToken.id },
      { changeCredentials: Date.now() + 60 * 60 * 1000 }
    );

    const accessToken = generateAccessToken(user);
    return res.status(200).json({ accessToken: accessToken });
  };
}

export default new AuthService();
