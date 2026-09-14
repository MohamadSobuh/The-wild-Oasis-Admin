import { createClient } from "@supabase/supabase-js";
export const supabaseUrl = "https://nnfigdczwbpgorjgjach.supabase.co";
const supabaseKey = "sb_publishable_EPZnvyyh6IBo3f5WVJnmRA_-Ro7yc5P";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
