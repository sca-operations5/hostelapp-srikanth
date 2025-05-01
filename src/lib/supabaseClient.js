
    import { createClient } from '@supabase/supabase-js'

    const supabaseUrl = "https://paakuvaheiweqojxcfyk.supabase.co";
    const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBhYWt1dmFoZWl3ZXFvanhjZnlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYwMDQ0NTgsImV4cCI6MjA2MTU4MDQ1OH0.-IcmLZqybaqKBuAUqijUUYyNwPoTSCrtrT5mBuW4oS4";

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error("Supabase URL or Anon Key is missing. Make sure environment variables are set.");
      // Optionally throw an error or handle this scenario appropriately
      // throw new Error("Supabase credentials missing.");
    }

    export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
       auth: {
         // Options like persistSession, autoRefreshToken can be set here if needed
         // persistSession: true,
         // autoRefreshToken: true,
       },
       global: {
         fetch: (...args) => {
           // Basic fetch wrapper for potential future logging or header injection
           // console.log('Supabase fetch called with:', args);
           return fetch(...args);
         }
       }
     });
  