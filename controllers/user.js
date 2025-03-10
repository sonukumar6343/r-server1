import { ErrorHandler } from "../utils/utility.js";
import { TryCatch } from "../middlewares/error.js";
import { sendToken } from "../utils/features.js";
import { User } from "../models/user.js";
import bcrypt from "bcryptjs";
import {Contact} from "../models/contact.js";
const register = TryCatch(async (req, res, next) => {
  const { name, email, password } = req.body;
  const existinguser = await User.findOne({ email }).select("+password");
  if (existinguser)
    return next(new ErrorHandler("This email is already registered", 404));
  const user = await User.create({
    name,
    email,
    password,
  });

  sendToken(res, user, 201, "Welcome ");
});
const login = TryCatch(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");

  if (!user) return next(new ErrorHandler("Invalid Credentials", 404));

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) return next(new ErrorHandler("Invalid Credentials", 404));

  sendToken(res, user, 200, `Welcome Back, ${user.name}`);
});
const getMyProfile = TryCatch(async (req, res, next) => {
  const user = await User.findById(req.user);

  if (!user) return next(new ErrorHandler("User not found", 404));

  res.status(200).json({
    success: true,
    user,
  });
});
const registercontact = TryCatch(async (req, res) => {
  const { name, phoneNumber, email, feedback } = req.body;
  await Contact.create({
    name,
    email,
    phoneNumber,
    feedback,
  });
  res.status(200).json({
    success: true,
    message:"we will contact you soon"
  });
});
export { register, login, getMyProfile, registercontact };
