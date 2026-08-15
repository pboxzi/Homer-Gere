import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://jqtpheututmeyitqlxxx.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpxdHBoZXV0dXRtZXlpdHFseHh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY2MzQwOTgsImV4cCI6MjEwMjIxMDA5OH0.Z3FwaA88u6oFx1-xb-6pVN-7fz4NC44SEccXnnCfzQQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
