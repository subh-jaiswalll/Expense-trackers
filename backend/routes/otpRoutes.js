
const express = require("express");

const router = express.Router();

const otpController = require("../controller/otpController.js");

router.post("/forgot-password", otpController.sendOTP);

module.exports = router;

