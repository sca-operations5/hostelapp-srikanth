import React, { useState, useEffect } from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '../lib/supabaseClient'; // Your Supabase client

function AuthComponent() {
  const [session, setSession] = useState(null);
  const [branches, setBranches] = useState([]);
  const [loadingBranches, setLoadingBranches] = useState(true);

  // Fetch branches for the signup form's metadata field
  useEffect(() => {
    const fetchBranches = async () => {
      setLoadingBranches(true);
      try {
        const { data, error } = await supabase
          .from('branches')
          .select('id, name')
          .order('name');
        if (error) throw error;
        setBranches(data || []);
      } catch (error) {
        console.error('Error fetching branches for auth:', error);
        // Handle error appropriately, maybe show a message
      } finally {
        setLoadingBranches(false);
      }
    };
    fetchBranches();
  }, []);

  // Check for existing session and subscribe to auth state changes
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      // Optional: You might want to redirect here if a session is established
      // e.g., navigate('/'); // Make sure to import useNavigate from react-router-dom
    });

    return () => subscription.unsubscribe(); // Cleanup subscription on unmount
  }, []);

  // Create the options needed for the signup form to include assigned_branch_id
  const signUpOptions = {
    data: {
      // Placeholder: will be set dynamically based on dropdown selection
      // assigned_branch_id: '',
    },
    // Need to override the default fields to add our branch selector
    // This requires more customization than the basic Auth component provides easily.
    // For the MVP, let's simplify: We will rely on manually setting the
    // metadata *after* signup or during user invite via the Supabase dashboard.
    // The trigger we created handles the profile creation if metadata is present.
    // A more advanced implementation would involve a custom form.
  };


  if (!session) {
    return (
      <div className="max-w-md mx-auto p-4 border rounded shadow">
        <h2 className="text-2xl font-semibold mb-4 text-center">Staff Login / Sign Up</h2>
         {/* For MVP simplicity, we remove the branch selection during signup here.
             Admin/Warden needs to set 'assigned_branch_id' in user metadata manually
             in Supabase dashboard after signup or via Invite.
             Example Metadata: { "assigned_branch_id": "your-actual-branch-uuid" }
             The handle_new_user trigger requires this metadata.
         */}
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          providers={['google', 'github']} // Optional: Add social providers
          // view="sign_up" // Can default to sign_in or sign_up
          // additionalData is not a standard prop. Metadata is set differently.
          // signUpOptions={signUpOptions} // Simplified - removed complex signup override for MVP
          localization={{
            variables: {
              sign_in: {
                email_label: 'Email address',
                password_label: 'Password',
              },
               sign_up: {
                email_label: 'Email address',
                password_label: 'Create a Password',
                // We cannot easily add custom fields like branch dropdown here
                // without overriding the component significantly.
              },
            },
          }}
        />
         <p className="text-xs text-center text-gray-600 mt-4">
             Note: New staff sign-ups require an Administrator to set the 'assigned_branch_id'
             in the User Metadata via the Supabase dashboard before login is fully functional.
         </p>
      </div>
    );
  } else {
     // If session exists, redirect or show logged-in state
     // In App.jsx, the ProtectedRoute should handle redirection
     // We can just return null or a loading indicator here.
    return null; // Or <Navigate to="/" /> if useNavigate is set up here
  }
}

export default AuthComponent; 