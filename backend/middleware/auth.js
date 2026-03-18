const User = require("../models/User");
const { verifyToken } = require("../utils/jwt");
const { sendError } = require("../utils/response");

const protect = async (req, res, next) => {
  try {
    // Get token from HttpOnly cookie or Authorization header (fallback)
    let token = req.cookies?.token;

    if (!token && req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return sendError(res, 401, "Not authorized. Please login.");
    }

    // Verify token
    const decoded = verifyToken(token);

    // Check if user still exists
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return sendError(res, 401, "User no longer exists.");
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return sendError(res, 401, "Invalid token.");
    }
    if (error.name === "TokenExpiredError") {
      return sendError(res, 401, "Token expired. Please login again.");
    }
    sendError(res, 500, "Authentication error.");
  }
};

module.exports = { protect };
