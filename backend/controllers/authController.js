const User = require("../models/User");
const { generateToken, cookieOptions } = require("../utils/jwt");
const { sendSuccess, sendError } = require("../utils/response");

// @desc    Register new user
// @route   POST /api/auth/register
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return sendError(res, 409, "Email already registered.");
    }

    const user = await User.create({ name, email, password });
    const token = generateToken(user._id);

    res.cookie("token", token, cookieOptions);

    sendSuccess(res, 201, "Registration successful", {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
      return sendError(res, 401, "Invalid email or password.");
    }

    const token = generateToken(user._id);
    res.cookie("token", token, cookieOptions);

    sendSuccess(res, 200, "Login successful", {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });
  sendSuccess(res, 200, "Logged out successfully");
};

// @desc    Get current user
// @route   GET /api/auth/me
const getMe = (req, res) => {
  sendSuccess(res, 200, "User fetched", {
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
    },
  });
};

module.exports = { register, login, logout, getMe };
