import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import * as fs from "fs/promises";
import dotenv from "dotenv";
import { nanoid } from "nanoid";
import { UserModel } from "../models/userModel.js";

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

  return newUser;
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
