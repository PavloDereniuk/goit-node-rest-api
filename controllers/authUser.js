import bcrypt from "bcrypt";
import { User } from "../models/user.js";
import { contactsControllersWrapper } from "../helpers/contactsControllersWrapper.js";
import { HttpError } from "../helpers/HttpError.js";
import { transport, standartEmail } from "../helpers/sendEmail.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config();
import gravatar from "gravatar";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs/promises";
import Jimp from "jimp";
import { nanoid } from "nanoid";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const avatarsDir = path.join(__dirname, "../", "public", "avatars");

const tokenKey = process.env.SECRET_KEY;
const baseURL = process.env.BASE_URL;

const registerUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, "Email in use");
  }
  const hashPassword = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email);
  const verificationToken = nanoid();

  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL,
    verificationToken,
  });

  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a target="_blank" href="${baseURL}/api/auth/verify/${verificationToken}">Click verify email</a>`,
  };

  const finalEmail = { ...standartEmail, ...verifyEmail };

  transport
    .sendMail(finalEmail)
    .then(() => console.log("Email send success"))
    .catch((error) => console.log(error.message));

  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
    },
  });
};

const verefyEmail = async (req, res) => {
  const { vereficationCode } = req.params;
  const user = await User.findOne({ verificationToken: vereficationCode });
  if (!user) {
    throw HttpError(404, "User not found");
  }

  await User.findByIdAndUpdate(user.id, {
    verify: true,
    verificationToken: "",
  });

  res.status(200).json({
    message: "Verification successful",
  });
};

const resendVerifyEmail = async (req, res) => {
  const { email } = req.body;
 
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email not found");
  }

  if (user.verify) {
    throw HttpError(400, "Verification has already been passed");
  }

  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a target="_blank" href="${baseURL}/api/auth/verify/${user.verificationToken}">Click verify email</a>`,
  };

  const finalEmail = { ...standartEmail, ...verifyEmail };

  transport
    .sendMail(finalEmail)
    .then(() => console.log("Email send success"))
    .catch((error) => console.log(error.message));

  res.json({
    message: "Verefy email send success",
  });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }

  if (!user.verify) {
    throw HttpError(401, "Email not varified");
  }

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "Email or password is wrong");
  }
  const peyload = {
    id: user.id,
  };
  const token = jwt.sign(peyload, tokenKey, { expiresIn: "23h" });
  await User.findByIdAndUpdate(user.id, { token });

  res.json({
    token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  });
};

const getCurrent = async (req, res) => {
  const { subscription, email } = req.user;
  res.json({ email, subscription });
};

const logoutUser = async (req, res) => {
  const owner = req.user.id;
  await User.findByIdAndUpdate(owner, { token: "" });
  res.status(204).json();
};

const changeSubscription = async (req, res) => {
  const owner = req.user.id;
  const { subscription } = req.body;
  await User.findByIdAndUpdate(owner, { subscription });

  res.status(200).json({
    message: "Subscription updated",
  });
};

const updateAvatar = async (req, res) => {
  const owner = req.user.id;
  const { path: tempUpload, originalname } = req.file;
  const filename = `${owner}_${originalname}`;
  const resultUpload = path.join(avatarsDir, filename);
  await fs.rename(tempUpload, resultUpload);
  const avatarURL = path.join("avatars", filename);

  Jimp.read(resultUpload, function (err, avatar) {
    if (err) throw err;
    avatar.resize(250, 250).write(resultUpload);
  });

  await User.findByIdAndUpdate(owner, { avatarURL });

  res.json({
    avatarURL,
  });
};

export default {
  registerUser: contactsControllersWrapper(registerUser),
  loginUser: contactsControllersWrapper(loginUser),
  getCurrent: contactsControllersWrapper(getCurrent),
  logoutUser: contactsControllersWrapper(logoutUser),
  changeSubscription: contactsControllersWrapper(changeSubscription),
  updateAvatar: contactsControllersWrapper(updateAvatar),
  verefyEmail: contactsControllersWrapper(verefyEmail),
  resendVerifyEmail: contactsControllersWrapper(resendVerifyEmail),
};
