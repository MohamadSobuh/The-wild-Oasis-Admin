import { createClient } from "@supabase/supabase-js";
export const supabaseUrl = "https://ujjcpmzovebymcmaiozz.supabase.co";
const supabaseKey = "sb_publishable_tHAwxm4thdOMTG4fVWmNQg_GKMeuTWq";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
