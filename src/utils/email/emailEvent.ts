import { EventEmitter } from "events";
import { hash } from "../hash/hash";
import { emailTemplate } from "./emailTemplate";
import DatabaseServices from "../../DB/DBservices";
import userModel from "../../DB/models/user.model";
import { OtpType } from "../../types/types";
import { sendEmail } from "./sendEmail";
import { v4 as uuidv4 } from "uuid";

export const message = {
  register:
    "Thank you for registering with [E-Commerce App]. To complete your registration, please use the following OTP.",
  login: "To complete your login, please Enter the Code.",
  resetPassword: "To reset your password, please enter the following OTP.",
  loginWithGoogle: "Thank you for using with [E-Commerce App].",
};

export const emailEmitter = new EventEmitter();

//Generate ID
function generateNumericId(length: number) {
  return uuidv4().replace(/\D/g, "").slice(0, length);
}

emailEmitter.on("sendEmail", async (email, userName, subjectType) => {
  const User = new DatabaseServices(userModel);
  //Generate Otp
  const otp = generateNumericId(6);
  const hashOtp = hash({ plainText: otp });
  const expiresIn = Date.now() + 10 * 60 * 1000;

  const user = await User.findOne({ filter: { email } });

  if (user.OTP.length === 0) {
    user.OTP.push({
      code: hashOtp,
      expiresIn,
      type: subjectType,
    });
    await user.save();
  } else {
    if (user.OTP[0].type == subjectType) {
      await userModel.updateOne(
        { email, "OTP.type": subjectType },
        {
          $set: {
            "OTP.$.code": hashOtp,
            "OTP.$.expiresIn": expiresIn,
          },
        }
      );
    } else {
      user.OTP = [
        {
          code: hashOtp,
          expiresIn,
          type: subjectType,
        },
      ];

      await user.save();
    }
  }

  let msg;
  switch (subjectType) {
    case OtpType.register:
      msg = message.register;
      break;
    case OtpType.login:
      msg = message.login;
      break;
    case OtpType.forgetPassword:
      msg = message.resetPassword;
      break;
    default:
      msg = "Here is your OTP code:";
  }

  const html = emailTemplate(subjectType, userName, msg, otp);

  await sendEmail({ to: email, subject: subjectType, html });
});

emailEmitter.on("sendEmailWithGoogle", async (email, fullName) => {
  await sendEmail({
    to: email,
    subject: OtpType.loginWithGoogle,
    html: emailTemplate(
      "E-Commerce Application",
      fullName,
      OtpType.loginWithGoogle,
      message.loginWithGoogle
    ),
  });
});
