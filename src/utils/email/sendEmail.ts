import nodemailer from "nodemailer";
import { emailOptions } from "../../types/types";

// send email
export const sendEmail = async ({ to, subject, html }: emailOptions) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });


  const info = await transporter.sendMail({
    from: `"E-Commerce Application" <yassa7000@gmail.com>`,
    to,
    subject,
    html,
  });
  return info.rejected.length === 0 ? true : false;
};
