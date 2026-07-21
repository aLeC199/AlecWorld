const SUPABASE_URL = "https://qebxskjwfrbalztxcxzj.supabase.co";

const SUPABASE_KEY = "sb_publishable_qpDmkFQPuu84OA1eccZpww_lqbYUisM";

const { createClient } = supabase;

const client = createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

window.supabaseClient = client;
