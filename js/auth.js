(async () => {

    const { data, error } = await window.supabaseClient.auth.getSession();

    if (error) {

        window.location.href = "login.html";

        return;

    }

    if (!data.session) {

        window.location.href = "login.html";

        return;

    }

})();
