import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://soilfbwiobkcbdzssitq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNvaWxmYndpb2JrY2JkenNzaXRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAxMTcxMjMsImV4cCI6MjA3NTY5MzEyM30.nF_m0Ny1g8ZU1h25qtSvVSYhU6AjGG-UF5fQYWX8jv8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
