const form = document.getElementById("loginForm");

const email = document.getElementById("email");

const password = document.getElementById("password");

const message = document.getElementById("message");

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    message.style.color = "white";
    message.textContent = "Signing in...";

    const { error } = await window.supabaseClient.auth.signInWithPassword({

        email: email.value,

        password: password.value

    });

    if (error) {

        message.style.color = "red";
        message.textContent = error.message;

        return;

    }

    message.style.color = "#22c55e";
    message.textContent = "Login successful!";

    window.location.href = "dashboard.html";

});
