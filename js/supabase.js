const SUPABASE_URL = "https://qebxskjwfrbalztxcxzj.supabase.co";

const SUPABASE_KEY = "sb_publishable_qpDmkFQPuu84OA1eccZpww_lqbYUisM";

if (!window.supabase) {
    alert("Supabase library failed to load!");
} else {
    alert("Supabase library loaded successfully!");
}

const supabase = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);
