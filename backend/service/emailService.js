const { BrevoClient } = require("@getbrevo/brevo");

const client = new BrevoClient({
  apiKey: process.env.BREVO_API_KEY,
});

const sendPasswordResetEmail = async (email, name, resetLink) => {
  try {
    const response = await client.transactionalEmails.sendTransacEmail({
      sender: {
        email: process.env.BREVO_SENDER_EMAIL,
        name: process.env.BREVO_SENDER_NAME || "DevProInExp",
      },

      to: [
        {
          email: email,
          name: name || "User",
        },
      ],

      subject: "Reset Your Password",

      htmlContent: `
                    <!DOCTYPE html>

                    <html>

                    <head>
                        <meta charset="UTF-8">
                    </head>

                    <body
                        style="
                            font-family: Arial, sans-serif;
                            background: #f4f6f8;
                            padding: 30px;
                        "
                    >

                        <div
                            style="
                                max-width: 600px;
                                margin: auto;
                                background: white;
                                padding: 30px;
                                border-radius: 10px;
                            "
                        >

                            <h2>
                                Password Reset Request
                            </h2>

                            <p>
                                Hello ${name || "User"},
                            </p>

                            <p>
                                We received a request to reset
                                your password.
                            </p>

                            <p>
                                Click the button below to create
                                a new password.
                            </p>

                            <a
                                href="${resetLink}"
                                style="
                                    display: inline-block;
                                    padding: 12px 20px;
                                    background: #007bff;
                                    color: white;
                                    text-decoration: none;
                                    border-radius: 6px;
                                "
                            >
                                Reset Password
                            </a>

                            <p style="margin-top: 25px;">
                                This link will expire in
                                <strong>15 minutes</strong>.
                            </p>

                            <p>
                                If you did not request a password
                                reset, you can safely ignore
                                this email.
                            </p>

                        </div>

                    </body>

                    </html>
                `,
    });

    console.log("Password reset email sent:", response);

    return response;
  } catch (error) {
    console.error("Brevo email error:", error);

    throw error;
  }
};

module.exports = {
  sendPasswordResetEmail,
};
