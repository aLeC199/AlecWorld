const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {

    logoutBtn.addEventListener("click", async () => {

        await window.supabaseClient.auth.signOut();

        window.location.href = "login.html";

    });

}
