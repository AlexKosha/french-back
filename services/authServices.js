import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import * as fs from "fs/promises";
import dotenv from "dotenv";
import { nanoid } from "nanoid";
import { UserModel } from "../models/userModel.js";
import { sendEmail } from "../helpers/sendEmail.js";
import { HttpError } from "../helpers/HttpError.js";

dotenv.config();
const { BASE_URL, SECRET_KEY } = process.env;

export const emailUnique = async (email) => await UserModel.findOne({ email });

export const registerUserDB = async (userData) => {
  const verificationToken = nanoid();

  const user = new UserModel({ ...userData, verificationToken });

  await user.hashPassword();
  await user.save();

  const payload = {
    id: user._id,
  };

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "7d" });

  const newUser = await UserModel.findByIdAndUpdate(
    user._id,
    { token },
    { new: true }
  );

  const verifyEmail = {
    to: user.email,
    subject: "Підтвердження електронної пошти / Email Verification",
    // html: `<a target = "_blank" href ='${BASE_URL}/users/verify/${verificationToken}'>Click here to verify email</a>`,
    html: `
    <div style="font-family: Arial, sans-serif; color: #333; max-width: 750px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
      <h2 style="color: #67104c; text-align: center;">Підтвердження електронної пошти / Email Verification</h2>
      
      <p>Дякуємо за реєстрацію! Щоб завершити процес, будь ласка, підтвердіть свою електронну адресу, натиснувши на посилання нижче:</p>
      <p>Thank you for registering! To complete the process, please confirm your email address by clicking the link below:</p>
      
      <p style="text-align: center; margin: 20px 0;">
        <a href='${BASE_URL}/users/verify/${verificationToken}' target="_blank" style="background-color: #67104c; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
          Підтвердити електронну пошту / Verify Email
        </a>
      </p>
      
      <p>Якщо ви не реєструвалися на нашому сайті, просто ігноруйте цей лист.</p>
      <p>If you did not sign up on our website, please ignore this email.</p>
      
      <hr style="border: 0; height: 1px; background-color: #ddd;">
      
      <p style="font-size: 0.9em; color: #555; text-align: center;">
        © 2024 My Pocket French Book. Всі права захищені. / © 2024 My Pocket French Book. All rights reserved.
      </p>
    </div>
  `,
  };

  await sendEmail(verifyEmail);
  return newUser;
};

export const verifyEmailDB = async (token) => {
  const user = await UserModel.findOne({ verificationToken: token });

  if (!user) {
    throw HttpError(401, "User not found");
  }

  await UserModel.findByIdAndUpdate(user._id, {
    verify: true,
    verificationToken: "",
  });

  return;
};

export const resendVerifyEmailDB = async (email) => {
  const user = await emailUnique(email);

  if (!user) {
    throw HttpError(401, "Email not found");
  }

  if (user.verify) {
    throw HttpError(400, "Verification has already been passed");
  }

  const verifyEmail = {
    to: email,
    subject: "Підтвердження електронної пошти",
    text: `
    Ласкаво просимо до нашої спільноти! 
    Будь ласка, скопіюйте та вставте це посилання у ваш браузер, щоб підтвердити вашу електронну адресу: ${BASE_URL}/users/verify/${user.verificationToken} 
    Якщо ви не реєструвалися на нашому сайті, проігноруйте це повідомлення.
    Дякуємо за реєстрацію!
    З повагою, команда додатку Опора
  `,
    html: `
    <p>Ласкаво просимо до нашої спільноти!</p>
    <a target = "_black" href ='${BASE_URL}/users/verify/${user.verificationToken}'>Підтвердити зараз</a>
     <p>Якщо ви не реєструвалися на нашому сайті, проігноруйте це повідомлення.</p>
      <p>Дякуємо за реєстрацію!</p>
       <p>З повагою, команда додатку Опора</p>

    `,
  };

  await sendEmail(verifyEmail);

  return;
};

export const loginUserDB = async (userId) => {
  const payload = {
    id: userId,
  };

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "7d" });

  const newUser = await UserModel.findByIdAndUpdate(
    userId,
    { token },
    { new: true }
  );

  return newUser;
};

export const logoutUserDB = async (_id, token) => {
  const user = await UserModel.findByIdAndUpdate(_id, token);
  return user;
};

export const updateUserDB = async (_id, userData) => {
  const updateUser = await UserModel.findByIdAndUpdate(_id, userData, {
    new: true,
  });

  return updateUser;
};

export const updatePasswordDB = async (_id, password) => {
  const newPassword = await bcryptjs.hash(password, 10);

  await UserModel.findByIdAndUpdate(_id, { password: newPassword });

  return;
};

export const restorePasswordDB = async (otp, newPassword, email) => {
  const user = await emailUnique(email);
  if (!user) throw HttpError(400, "Token is invalid");

  await user.comparePasswordResetToken(otp);

  const hashedPassword = await bcryptjs.hash(newPassword, 10);
  user.password = hashedPassword;
  user.passwordResetToken = undefined;
  user.passwordResetTokenExp = undefined;

  await user.save();
};
