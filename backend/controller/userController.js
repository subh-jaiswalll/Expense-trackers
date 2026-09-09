const userModels = require("../models/userModels.js");

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

const crypto = require("crypto");

// const User = require("../models/userModel");

const { sendPasswordResetEmail } = require("../service/emailService.js");


// ================= CREATE USER =================

const createUser = async (req, res) => {

    try {

        const { name, email, password } = req.body;


        // Check fields

        if (!name || !email || !password) {

            return res.status(400).json({
                message: "All fields are required"
            });

        }


        // Check existing user

        const existingUser = await userModels.findOne({
            where: {
                email: email
            }
        });


        if (existingUser) {

            return res.status(409).json({
                message: "Email already found"
            });

        }


        // Hash password

        const hashedPassword = await bcrypt.hash(
            password,
            10
        );


        // Create user

        const user = await userModels.create({

            name: name,
            email: email,
            password: hashedPassword

        });


        return res.status(201).json({

            success: true,

            message: "User created successfully",

            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }

        });

    }

    catch (err) {

        console.log(err);

        return res.status(500).json({

            success: false,

            message: "Server Error",

            error: err.message

        });

    }

};


// ================= GENERATE TOKEN =================

function generateAccessToken(user) {

    return jwt.sign(

        {
            userId: user.id,
            name: user.name,
            email: user.email
        },

        process.env.TOKEN_SECRET,

        {
            expiresIn: "1h"
        }

    );

}


// ================= LOGIN =================

const loginUser = async (req, res) => {

    try {

        const { email, password } = req.body;


        // Check fields

        if (!email || !password) {

            return res.status(400).json({

                success: false,

                message: "Email and password are required"

            });

        }


        // Find user

        const user = await userModels.findOne({

            where: {
                email: email
            }

        });


        if (!user) {

            return res.status(404).json({

                success: false,

                message: "User not found!"

            });

        }


        // Compare password

        const isCorrectPassword = await bcrypt.compare(

            password,

            user.password

        );


        if (!isCorrectPassword) {

            return res.status(401).json({

                success: false,

                message: "Incorrect Password"

            });

        }


        // Generate token

        const token = generateAccessToken(user);


        return res.status(200).json({

            success: true,

            message: "User logged in successfully",

            user: {

                id: user.id,

                name: user.name,

                email: user.email

            },

            token: token

        });

    }

    catch (err) {

        console.log(err);

        return res.status(500).json({

            success: false,

            message: "Server error",

            error: err.message

        });

    }

};


const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await userModels.findOne({
      where: {
        email,
      },
    });

    // Don't reveal whether email exists
    if (!user) {
      return res.status(200).json({
        success: true,
        message:
          "If an account with that email exists, a password reset link has been sent.",
      });
    }

    // Generate secure random token
    const rawToken = crypto.randomBytes(32).toString("hex");

    // Hash token before storing in database
    const hashedToken = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

    // Token expires after 15 minutes
    const expiry = new Date(Date.now() + 15 * 60 * 1000);

    await user.update({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: expiry,
    });

    // Link sent to user
const resetLink =
    `${process.env.FRONTEND_URL}/reset/reset.html?token=${rawToken}`;
    
    await sendPasswordResetEmail(
      user.email,
      user.name,
      resetLink
    );

    return res.status(200).json({
      success: true,
      message:
        "If an account with that email exists, a password reset link has been sent.",
    });

  } catch (error) {
    console.error("Forgot password error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}; 




const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Invalid reset token",
      });
    }

    if (!password) {
      return res.status(400).json({
        success: false,
        message: "New password is required",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters",
      });
    }

    // Hash token received from URL
    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await userModels.findOne({
      where: {
        resetPasswordToken: hashedToken,
      },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token",
      });
    }

    // Check expiration
    if (
      !user.resetPasswordExpires ||
      user.resetPasswordExpires < new Date()
    ) {
      return res.status(400).json({
        success: false,
        message: "Reset token has expired",
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 12);

    await user.update({
      password: hashedPassword,

      // Invalidate token after successful reset
      resetPasswordToken: null,
      resetPasswordExpires: null,
    });

    return res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });

  } catch (error) {
    console.error("Reset password error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};


module.exports = {

    loginUser,

    createUser,

    forgotPassword,

    resetPassword,

};