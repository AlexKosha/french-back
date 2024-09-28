import { Schema, model } from "mongoose";
import bcryptjs from "bcryptjs";
import { nanoid } from "nanoid";

const emailRegex = new RegExp("^[\\w-.]+@([\\w-]+\\.)+[\\w-]{2,4}$");
const themeList = ["dark", "light"];
const validateBirthDate = (value) => {
  return value <= new Date();
};

const userSchema = new Schema(
  {
    name: {
      type: String,
      reqired: [true, "Set name for user"],
    },
    birthDate: {
      type: String,
      // required: [true, "Set birth date for user"],
      // validate: {
      //   validator: validateBirthDate,
      //   message: "Birth date cannot be in the future",
      // },
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      match: emailRegex,
    },
    password: {
      type: String,
      required: [true, "Set password for user"],
    },
    theme: {
      type: String,
      enum: themeList,
      default: "dark",
    },
    avatarURL: {
      type: String,
      default: "",
    },
    token: {
      type: String,
      default: "",
    },
    verify: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      require: [true, "Verify token is required"],
    },
    passwordResetToken: { type: String },
    passwordResetTokenExp: { type: String },
  },
  { versionKey: false, timeseries: true }
);

userSchema.methods.hashPassword = async function () {
  this.password = await bcryptjs.hash(this.password, 10);
};

userSchema.methods.comparePassword = async function (userPassword) {
  return await bcryptjs.compare(userPassword, this.password);
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = nanoid(6);
  const salt = bcryptjs.genSaltSync(10);
  this.passwordResetToken = bcryptjs.hashSync(resetToken, salt);
  this.passwordResetTokenExp = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

userSchema.methods.comparePasswordResetToken = async function (oneTimeToken) {
  return await bcryptjs.compare(oneTimeToken, this.passwordResetToken);
};

export const UserModel = model("Users", userSchema);
