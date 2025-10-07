import { createClient } from '@supabase/supabase-js';

// Lovable Cloud automatically provides these values
const supabaseUrl = 'https://your-project.supabase.co';
const supabaseKey = 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseKey);
