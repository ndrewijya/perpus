import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dlqqcokzmtwxpbfpdgoy.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRscXFjb2t6bXR3eHBiZnBkZ295Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ3NjA2NzIsImV4cCI6MjA2MDMzNjY3Mn0.GkBqfsMfMEV2GGIRVqAAK_ll71otyMTHt5-QjPq_LyI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
