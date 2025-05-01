import { supabase } from './lib/supabase'

async function testSupabaseConnection() {
  try {
    // Test connection by getting the current user (should be null since we're not authenticated)
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error) {
      console.error('Error connecting to Supabase:', error.message)
    } else {
      console.log('Successfully connected to Supabase!')
      console.log('Current user:', user)
    }
  } catch (error) {
    console.error('Unexpected error:', error)
  }
}

testSupabaseConnection() 