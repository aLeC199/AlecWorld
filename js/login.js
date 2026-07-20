const form = document.getElementById("loginForm");
const email = document.getElementById("email");
const password = document.getElementById("password");
const message = document.getElementById("message");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    message.style.color = "white";
    message.textContent = "Signing in...";

    try {

        const { data, error } = await supabase.auth.signInWithPassword({
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

        setTimeout(() => {
            window.location.href = "dashboard.html";
        }, 1000);

    } catch (err) {

        message.style.color = "red";
        message.textContent = err.message;

    }
});
