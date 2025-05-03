import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient'; // Import the client

function ComplaintForm() {
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(''); // For success/error messages
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'

  // Fetch branches on component mount
  useEffect(() => {
    const fetchBranches = async () => {
      setLoading(true);
      setMessage(''); // Clear previous messages
      try {
        const { data, error } = await supabase
          .from('branches')
          .select('id, name')
          .order('name'); // Optional: order alphabetically

        if (error) throw error;

        setBranches(data || []);
        if (data && data.length > 0) {
          setSelectedBranch(data[0].id); // Default to the first branch
        }
      } catch (error) {
        console.error('Error fetching branches:', error);
        setMessage(`Failed to load branches: ${error.message}`);
        setMessageType('error');
      } finally {
        setLoading(false);
      }
    };

    fetchBranches();
  }, []); // Empty dependency array means this runs once on mount

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission behaviour
    setLoading(true);
    setMessage('');
    setMessageType('');

    if (!selectedBranch || !description.trim()) {
      setMessage('Please select a branch and enter a description.');
      setMessageType('error');
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase
        .from('complaints')
        .insert([
          {
            branch_id: selectedBranch,
            description: description.trim(),
            // status defaults to 'New' in the database
          },
        ]);

      if (error) throw error;

      setMessage('Complaint submitted successfully!');
      setMessageType('success');
      setDescription(''); // Clear description field
      // Optionally reset selected branch or keep it
      // setSelectedBranch(branches[0]?.id || '');
    } catch (error) {
      console.error('Error submitting complaint:', error);
      setMessage(`Failed to submit complaint: ${error.message}`);
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 border rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">Report a Problem</h2>
      <form onSubmit={handleSubmit}>
        {/* Branch Selection */}
        <div className="mb-4">
          <label htmlFor="branch" className="block text-sm font-medium text-gray-700 mb-1">
            Select Branch:
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

        {/* Description Input */}
        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Problem Description:
          </label>
          <textarea
            id="description"
            rows="4"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={loading}
            required
            placeholder="Describe the issue in detail..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100"
          />
        </div>

        {/* Submit Button */}
        <div className="mb-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Submit Complaint'}
          </button>
        </div>

        {/* Message Area */}
        {message && (
          <div className={`p-3 rounded text-sm ${messageType === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {message}
          </div>
        )}
      </form>
    </div>
  );
}

export default ComplaintForm; 