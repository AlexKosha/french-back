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
      croissants: newUser.croissants,
    },
  });
});

export const verifyEmail = ctrlWrapper(async (req, res) => {
  const { verificationToken } = req.params;

  await authServices.verifyEmailDB(verificationToken);

  // Відправляємо HTML-сторінку у відповідь
  res.status(200).send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Email Verified / Електронна пошта Підтверджена</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          margin: 0;
          background-color: #f4f4f9;
          color: #333;
        }
        .container {
          text-align: center;
          padding: 20px;
          max-width: 750px;
          background: #ffffff;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        h2 {
          color: #67104c;
        }
        p {
          margin: 15px 0;
        }
        .button {
          display: inline-block;
          margin-top: 20px;
          padding: 10px 20px;
          font-size: 16px;
          color: #fff;
          background-color: #67104c;
          text-decoration: none;
          border-radius: 5px;
        }
        .button:hover {
          background-color: #45a049;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h2>Email Verified Successfully! / Електронна пошта успішно підтверджена!</h2>
        <p>Thank you for verifying your email address. You can now access all features of our app.</p>
        <p>Дякуємо за підтвердження вашої електронної пошти. Тепер ви можете користуватися всіма функціями нашого додатку.</p>
        <p>To modify your email options, please visit the Settings page in your account.</p>
        <p>Щоб змінити налаштування електронної пошти, перейдіть у сторінку Налаштувань вашого акаунту.</p>
        <hr style="border: 0; height: 1px; background-color: #ddd;">
      
      <p style="font-size: 0.9em; color: #555; text-align: center;">
        © 2024 My Pocket French Book. Всі права захищені. / © 2024 My Pocket French Book. All rights reserved.
      </p>
      </div>
    </body>
    </html>
  `);
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

  const { token, name, birthDate, croissants } = newUser;

  res.json({
    token,
    user: {
      name,
      email,
      birthDate,
      croissants,
    },
  });
});

export const getCurrentUser = ctrlWrapper(async (req, res) => {
  const { name, email, birthDate, croissants } = req.user;
  res.json({ name, email, birthDate, croissants });
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

  const today = new Date().toISOString().split("T")[0];

  if (
    user.lastPasswordChangeDate === tomorrowStr &&
    user.passwordChangeCount >= 2
  ) {
    throw HttpError(429, "You can only change password twice per day.");
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

export const updateProgressUser = ctrlWrapper(async (req, res) => {
  const user = req.user;

  if (typeof user.croissants !== "number") {
    user.croissants = 0;
  }

  user.croissants += 1;

  await user.save();

  res.status(200).json({ croissants: user.croissants });
});
