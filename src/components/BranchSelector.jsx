import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext'; // Assuming useAuth provides the user object
import { useNavigate } from 'react-router-dom';

function BranchSelector() {
  const { user } = useAuth(); // Get the logged-in user
  const navigate = useNavigate();
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch branches
  useEffect(() => {
    const fetchBranches = async () => {
      setLoading(true);
      setError('');
      try {
        const { data, error: fetchError } = await supabase
          .from('branches')
          .select('id, name')
          .order('name');

        if (fetchError) throw fetchError;

        setBranches(data || []);
        if (data && data.length > 0) {
          setSelectedBranch(data[0].id); // Default selection
        }
      } catch (err) {
        console.error('Error fetching branches:', err);
        setError(`Failed to load branches: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchBranches();
  }, []);

  const handleSaveBranch = async () => {
    if (!user || !selectedBranch) {
      setError('User not found or no branch selected.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Attempt to insert the profile record
      const { error: insertError } = await supabase
        .from('profiles')
        .insert({
          id: user.id, // Link to the logged-in user's ID
          email: user.email,
          assigned_branch_id: selectedBranch,
          is_admin: false // Default for self-selection
        });

      if (insertError) {
         // Handle potential race condition or unique constraint violation
         // if profile was somehow created between login and this save
         if (insertError.code === '23505') { // unique_violation code for PostgreSQL
             console.warn('Profile already exists, likely race condition. Proceeding...');
              // Optionally, try to update instead, but for MVP let's just navigate
         } else {
             throw insertError; // Throw other errors
         }
      }

      // Profile saved (or already existed), navigate to the main app
      // You might need to refresh auth context state if it holds profile data
      // For now, just navigate.
      navigate('/'); // Redirect to dashboard or main page

    } catch (err) {
      console.error('Error saving profile:', err);
      setError(`Failed to save branch selection: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    // Should not happen if routed correctly, but good practice
    return <p>Loading user information...</p>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 border rounded shadow-lg">
        <h2 className="text-2xl font-semibold mb-6 text-center">Select Your Branch</h2>
        <p className="text-center text-gray-600 mb-6">
          Please select the primary branch you are associated with.
        </p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <div className="mb-6">
          <label htmlFor="branch" className="block text-sm font-medium text-gray-700 mb-1">
            Branch:
          </label>
          <select
            id="branch"
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            disabled={loading || branches.length === 0}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100"
          >
            {loading && branches.length === 0 ? (
              <option>Loading branches...</option>
            ) : (
              branches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.name}
                </option>
              ))
            )}
          </select>
        </div>

        <button
          onClick={handleSaveBranch}
          disabled={loading || !selectedBranch}
          className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Branch Selection'}
        </button>
      </div>
    </div>
  );
}

export default BranchSelector; 