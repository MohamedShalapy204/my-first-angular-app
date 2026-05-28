import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mvzsdgazcvghmadzeqxb.supabase.co';
const supabaseKey = 'sb_publishable_0q_TcP_yMU5yTsUqVLuVaQ_lHEGQKDg';

export const supabase = createClient(supabaseUrl, supabaseKey);
