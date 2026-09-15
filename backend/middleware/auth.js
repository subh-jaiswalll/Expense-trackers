const jwt = require("jsonwebtoken");

const User = require("../models/userModels.js");

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");

    if (!authHeader) {
      return res.status(401).json({
        success: false,

        message: "Authorization header missing",
      });
    }

    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,

        message: "Invalid authorization format",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,

        message: "Token missing",
      });
    }

    const decoded = jwt.verify(
      token,

      process.env.TOKEN_SECRET,
    );

    // Find user

    const user = await User.findByPk(decoded.userId);

    if (!user) {
      return res.status(401).json({
        success: false,

        message: "User not found",
      });
    }

    req.user = user;

    next();
  } catch (err) {
    console.log("JWT ERROR:", err.message);

    return res.status(401).json({
      success: false,

      message: "Invalid or expired token",
    });
  }
};

module.exports = authenticate;
