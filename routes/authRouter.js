import express from "express";
import { authenticate, validateBody } from "../middlewares/index.js";

import * as authControllers from "../controllers/authControllers.js";
import * as userSchema from "../schemas/userSchema.js";

const authRouter = express.Router();

authRouter.post(
  "/register",
  validateBody(userSchema.registerSchema),
  authControllers.registerUser
);

authRouter.get("/verify/:verificationToken", authControllers.verifyEmail);

authRouter.post(
  "/verify",
  authenticate,
  validateBody(userSchema.emailSchema),
  authControllers.resendVerifyEmail
);

authRouter.post(
  "/login",
  validateBody(userSchema.loginSchema),
  authControllers.loginUser
);

authRouter.post("/logout", authenticate, authControllers.logoutUser);

authRouter.get("/current", authenticate, authControllers.getCurrentUser);

authRouter.put(
  "/update",
  authenticate,
  validateBody(userSchema.updateUserSchema),
  authControllers.updateUser
);

authRouter.patch(
  "/updatePassword",
  authenticate,
  validateBody(userSchema.updatePassword),
  authControllers.updatePassword
);

// otp = one time password
authRouter.post(
  "/restorePassword/:otp",
  validateBody(userSchema.restorePassword),
  authControllers.restorePassword
);

authRouter.post("/forgotPassword", authControllers.forgotPassword);

authRouter.patch(
  "/updateProgressUser",
  authenticate,
  authControllers.updateProgressUser
);

export default authRouter;
