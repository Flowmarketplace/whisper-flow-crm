import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://yokrdxvxppwxiehvvirv.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlva3JkeHZ4cHB3eGllaHZ2aXJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyNjE0MTQsImV4cCI6MjA3NzgzNzQxNH0.UGfBmSJB1Rer584Dw0pdk7lO_S8VCGgizVJrk6oT_Xk'

export const supabase = createClient(supabaseUrl, supabaseKey)