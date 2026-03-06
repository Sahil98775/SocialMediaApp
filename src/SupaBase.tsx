import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://jktrfhcofxbhvodwmpzl.supabase.co";
const supabaseAnonKey = "sb_publishable_3iAJB61HAMz1dxoT5NQZTA_lDcVQ14p";
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
