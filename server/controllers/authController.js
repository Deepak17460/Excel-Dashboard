const { User } = require("../models");
const bcrypt = require("bcryptjs");
const createError = require("../utils/errors");
const jwt = require("jsonwebtoken");

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    await User.create({
      name,
      email,
      password: hash,
    });
    res.status(201).json("User created successfully");
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return next(createError(404, "User not found"));

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch)
      return next(createError(400, "Username or password dosen't match"));
    console.log(process.env.JWT_SECRET_KEY);
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

module.exports = { register, login };
