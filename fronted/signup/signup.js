const signupForm = document.getElementById("signupForm");

signupForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;


    

    try {

        const response = await fetch(
            "https://expense-trackers-application.onrender.com/user/signup",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    name,
                    email,
                    password
                })
            }
        );


        const data = await response.json();

        console.log(data);


        if (response.ok) {

            // alert("Signup successful!");

            signupForm.reset();

            // Go to login
            window.location.href = "../login/login.html";

        } else {

            alert(data.message || "Signup failed");

        }

    } catch (error) {

        console.error(error);

        alert("Server error");

    }

});