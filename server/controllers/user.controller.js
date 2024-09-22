import errorHandler from "../middleware/errorHandler.js";
import UserModel from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return next(errorHandler(400, "Fill the required fields"));
  }

  if (password.length < 6) {
    return next(errorHandler(400, "Password should be atleast 6 character"));
  }

  try {
    const existUser = await UserModel.findOne({ email });
    if (existUser) {
      return next(errorHandler(409, "This email is already registered"));
    }

    const hashedPass = bcryptjs.hashSync(password, 10);

    const newUser = new UserModel({
      name,
      email,
      password: hashedPass,
    });

    const savedUser = await newUser.save();

    const { password: hashedPassword, ...rest } = savedUser._doc;

    return res.status(201).json({ message: "Successfully Signup", user: rest });
  } catch (error) {
    next(errorHandler(error));
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(errorHandler(400, "Fill the required fields"));
  }

  try {
    const validUser = await UserModel.findOne({ email });
    if (!validUser) {
      return next(errorHandler(404, "Wrong credentials"));
    }

    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(401, "Wrong credentials"));
    }

    const token = jwt.sign(
      { id: validUser._id, role: validUser.role },
      process.env.SECRET_KEY
    );

    const { password: hashedPassword, ...rest } = validUser._doc;

    return res
      .status(200)
      .cookie("digitalflakeUser", token, { httpOnly: true })
      .json({ message: "Successfully signin", user: rest });
  } catch (error) {
    next(errorHandler(error));
  }
};

export const signout = (req, res, next) => {
  try {
    return res
      .status(200)
      .clearCookie("digitalflakeUser")
      .json({ message: "Successfully signout" });
  } catch (error) {
    return next(errorHandler(error));
  }
};
