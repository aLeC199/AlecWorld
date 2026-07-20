const form = document.getElementById("loginForm");

const email = document.getElementById("email");

const password = document.getElementById("password");

const message = document.getElementById("message");

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    message.textContent = "Signing in...";

    const { error } = await supabase.auth.signInWithPassword({

        email: email.value,

        password: password.value

    });

    if (error) {

        message.textContent = error.message;

        message.style.color = "red";

        return;

    }

    message.style.color = "#22c55e";

    message.textContent = "Login successful!";

    window.location.href = "dashboard.html";

});
