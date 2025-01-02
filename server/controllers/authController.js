const { User } = require("../models");
const bcrypt = require("bcryptjs");
const createError = require("../utils/errors");
const jwt = require("jsonwebtoken");

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    console.log(name, email, password);

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "Email is already in use" });
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    await User.create({
      name,
      email,
      password: hash,
    });

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Error during user registration:", error);

    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: "Email is already in use" });
    }

    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return next(createError(404, "User not found"));

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    console.log(isPasswordMatch);
    if (!isPasswordMatch)
      return next(createError(400, "Username or password dosen't match"));

    //console.log(process.env.JWT_SECRET_KEY);
    const token = jwt.sign(
      { id: user.id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET_KEY
    );

    const { password: pass, isAdmin, ...otherDetails } = user.dataValues;
    res
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .status(200)
      .json(otherDetails);
  } catch (error) {
    next(error);
  }
};

const logout = (req, res) => {
  res.clearCookie("access_token", { httpOnly: true, sameSite: "Strict" });
  res.status(200).json({ message: "Logged out successfully" });
};

module.exports = { register, login, logout };
