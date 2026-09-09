
const { sendOTPEmail } = require("../service/emailService.js");

function generateOTP() {
    return Math.floor(
        100000 + Math.random() * 900000
    ).toString();
}

const sendOTP = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required"
            });
        }

        const otp = generateOTP();

        await sendOTPEmail(email, otp);

        res.status(200).json({
            success: true,
            message: "OTP sent successfully"
        });

    } catch (error) {
        console.error("OTP Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to send OTP"
        });
    }
};

module.exports = {
    sendOTP
};
