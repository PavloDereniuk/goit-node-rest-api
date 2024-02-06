import bcrypt from "bcrypt";
import { User } from "../models/user.js";
import { contactsControllersWrapper } from "../helpers/contactsControllersWrapper.js";
import { HttpError } from "../helpers/HttpError.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config();

const tokenKey = process.env.SECRET_KEY;

const registerUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, "Email in use");
  }
  const hashPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({ ...req.body, password: hashPassword });
  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
    },
  });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email or password is wrong");
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
  console.log(req.user);
  console.log(req.body);
  const owner = req.user.id;
  const { subscription } = req.body;
  await User.findByIdAndUpdate(owner, {subscription});

  res.status(202).json({
    message: "Subscription updated"
  });
};

export default {
  registerUser: contactsControllersWrapper(registerUser),
  loginUser: contactsControllersWrapper(loginUser),
  getCurrent: contactsControllersWrapper(getCurrent),
  logoutUser: contactsControllersWrapper(logoutUser),
  changeSubscription: contactsControllersWrapper(changeSubscription),
};
