import * as authServices from "../services/authServices.js";
import { ctrlWrapper, HttpError } from "../helpers/index.js";
import { sendEmail } from "../helpers/sendEmail.js";

export const registerUser = ctrlWrapper(async (req, res) => {
  const { name, email, birthDate } = req.body;

  const ifUserExist = await authServices.emailUnique(email);

  if (ifUserExist) {
    throw HttpError(409, "User with such email already in use");
  }

  const newUser = await authServices.registerUserDB(req.body);

  res.status(201).json({
    token: newUser.token,
    user: {
      name,
      email,
      birthDate,
    },
  });
});

export const verifyEmail = ctrlWrapper(async (req, res) => {
  const { verificationToken } = req.params;

  await authServices.verifyEmailDB(verificationToken);

  res.status(200).json({ message: "Verification successful" });
});

export const resendVerifyEmail = ctrlWrapper(async (req, res) => {
  const { email } = req.user;

  await authServices.resendVerifyEmailDB(email);

  res.status(200).json({ message: "Verification email sent" });
});

export const loginUser = ctrlWrapper(async (req, res) => {
  const { email, password } = req.body;

  const user = await authServices.emailUnique(email);

  if (!user) {
    throw HttpError(409, "User with this email not registrated");
  }

  const isVakidPassword = await user.comparePassword(password);

  if (!isVakidPassword) {
    throw HttpError(400, "invalid email or password ");
  }

  const newUser = await authServices.loginUserDB(user._id);

  const { token, name, birthDate } = newUser;

  res.json({
    token,
    user: {
      name,
      email,
      birthDate,
    },
  });
});

export const getCurrentUser = ctrlWrapper(async (req, res) => {
  const { name, email, birthDate } = req.user;
  res.json({ name, email, birthDate });
});

export const logoutUser = ctrlWrapper(async (req, res) => {
  await authServices.loginUserDB(req.user._id);

  res.json({
    message: "Logout was successful",
  });
});

export const updateUser = ctrlWrapper(async (req, res) => {
  const { _id } = req.user;
  // Перевірка наявності даних користувача в запиті
  if (req.body) {
    const { name, email } = req.body;
    const updatedUser = await authServices.updateUserDB(_id, {
      name,
      email,
    });
    res.status(200).json(updatedUser);
  }
});

export const updatePassword = ctrlWrapper(async (req, res) => {
  const { password, newPassword } = req.body;
  const { email, _id } = req.user;

  const user = await authServices.emailUnique(email);

  const isValidPassword = await user.comparePassword(password);

  if (!isValidPassword) {
    throw HttpError(400, "Invalid password");
  }

  await authServices.updatePasswordDB(_id, newPassword);

  res.status(200).json({ message: "Password has been updated" });
});

export const restorePassword = ctrlWrapper(async (req, res) => {
  await authServices.restorePasswordDB(
    req.params.otp,
    req.body.password,
    req.body.email
  );

  res.status(200).json({ message: "Password was successfully created" });
});

export const forgotPassword = ctrlWrapper(async (req, res) => {
  const { email } = req.body;

  const user = await authServices.emailUnique(email);

  if (!user) {
    throw HttpError(400, "User not exist");
  }

  const otp = user.createPasswordResetToken();
  await user.save();

  const verifyEmail = {
    to: user,
    subject: "Your one time password",
    html: `
    <p>Вітаємо! Ваш код:</p>
    <p>${otp}</p>
    <p>Якщо ви не робили запит на відновлення паролю, проігноруйте це повідомлення.</p>
    <p>Дякуємо, що користуєтеся нашим додатком!</p>
    <p>З повагою, команда додатку My Pocket French Book</p>
    
    <p>Welcome! Your code is:</p>
    <p>${otp}</p>
    <p>If you did not request a password reset, please ignore this message.</p>
    <p>Thank you for using our app!</p>
    <p>Best regards, the My Pocket French Book team</p>`,
  };

  await sendEmail(verifyEmail);

  user.passwordResetToken = undefined;
  user.passwordResetTokenExp = undefined;

  res.status(200).json({ message: "Password reset sent by email" });
});
