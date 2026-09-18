
const forgotPasswordForm =
    document.getElementById("forgotPasswordForm");

forgotPasswordForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const email =
        document.getElementById("email").value.trim();

    const message =
        document.getElementById("message");

    message.textContent = "Sending...";

    try {

        const response = await fetch(
            "https://hero-factors-items-kevin.trycloudflare.com/user/forgot-password",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    email: email
                })
            }
        );

        const data = await response.json();

        console.log(data);

        if (!response.ok) {
            message.textContent =
                data.message || "Something went wrong";
            return;
        }

        message.textContent = data.message;

        // Clear input after successful request
        document.getElementById("email").value = "";

    } catch (error) {

        console.error("Forgot password error:", error);

        message.textContent =
            "Unable to connect to server";

    }

});

