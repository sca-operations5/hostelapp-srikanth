import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://paakuvaheiweqojxcfyk.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBhYWt1dmFoZWl3ZXFvanhjZnlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYwMDQ0NTgsImV4cCI6MjA2MTU4MDQ1OH0.-IcmLZqybaqKBuAUqijUUYyNwPoTSCrtrT5mBuW4oS4'

export const supabase = createClient(supabaseUrl, supabaseAnonKey) 