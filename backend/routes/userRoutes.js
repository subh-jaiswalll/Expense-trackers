const express = require("express");

const router = express.Router();

const userController = require("../controller/userController.js");

router.post("/signup", userController.createUser);
router.post("/login", userController.loginUser);

router.post("/forgot-password", userController.forgotPassword);

router.post("/reset-password/:token", userController.resetPassword);

module.exports = router;
