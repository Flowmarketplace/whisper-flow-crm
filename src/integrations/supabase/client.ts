import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://zeckplredicprdxnczor.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InplY2twbHJlZGljcHJkeG5jemNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIwOTI1ODAsImV4cCI6MjA2NzY2ODU4MH0.sAONNZJICl2nday_KvUq8ZMgMIBPM51LI_FByWc51Oo'

export const supabase = createClient(supabaseUrl, supabaseKey)