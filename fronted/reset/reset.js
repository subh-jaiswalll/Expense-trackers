const resetPasswordForm = document.getElementById("resetPasswordForm");

const message = document.getElementById("message");

// ===============================
// Get token from URL
// ===============================

const urlParams = new URLSearchParams(window.location.search);

const token = urlParams.get("token");

console.log("Reset token:", token);

console.log("Reset token:", token);

// ===============================
// Check token
// ===============================

if (!token) {
  message.textContent = "Invalid or missing reset token.";

  resetPasswordForm.style.display = "none";
}

// ===============================
// Form submit
// ===============================

resetPasswordForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const password = document.getElementById("password").value;

  const confirmPassword = document.getElementById("confirmPassword").value;

  // ===============================
  // Check password
  // ===============================

  if (password.length < 8) {
    message.textContent = "Password must be at least 8 characters.";

    return;
  }

  // ===============================
  // Check confirm password
  // ===============================

  if (password !== confirmPassword) {
    message.textContent = "Passwords do not match.";

    return;
  }

  message.textContent = "Resetting password...";

  const API_URL = "https://hero-factors-items-kevin.trycloudflare.com";
  try {
    const response = await fetch(
     `${API_URL}/user/reset-password/${token}`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          password: password,
        }),
      },
    );

    const data = await response.json();

    console.log(data);

    if (!response.ok) {
      message.textContent = data.message || "Unable to reset password.";

      return;
    }

    message.textContent = data.message;

    // Clear form
    resetPasswordForm.reset();

    // Redirect to login
    setTimeout(() => {
      window.location.href = "/login/login.html";
    }, 2000);
  } catch (error) {
    console.error("Reset password error:", error);

    message.textContent = "Unable to connect to server.";
  }
});
