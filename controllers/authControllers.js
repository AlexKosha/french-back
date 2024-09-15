import * as authServices from "../services/authServices.js";
import { ctrlWrapper, HttpError } from "../helpers/index.js";

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

  if (req.body) {
    const updateUser = await authServices.updateUserDB(_id, {
      name: req.body.name,
      email: req.body.email,
    });

    const { name, email, birthDate } = updateUser;

    res.status(200).json({
      name,
      email,
      birthDate,
    });
  }
});

export const updateUserTheme = ctrlWrapper(async (req, res) => {
  const { _id } = req.user;
  const { theme } = req.body;

  const updateTheme = await authServices.updateThemeDB(_id, theme);

  res.status(200).json({
    email: updateTheme.email,
    theme: updateTheme.theme,
  });
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

// export const deleteUser = ctrlWrapper(async (req, res) => {
//   await authServices.hideUserDB(req.params.id);

//   res.status(204);
// });
