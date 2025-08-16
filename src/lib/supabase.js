import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://gycywakrmwycimimrapt.supabase.co'
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd5Y3l3YWtybXd5Y2ltaW1yYXB0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE1OTkxMjAsImV4cCI6MjA2NzE3NTEyMH0.bLvyAt6tImqelkwvT5C8rD5jVgGiLLrbUCfoVeU234w'

console.log('Supabase URL:', supabaseUrl)
console.log('Supabase Key:', supabaseAnonKey ? 'Loaded' : 'Not loaded')

export const supabase = createClient(supabaseUrl, supabaseAnonKey)