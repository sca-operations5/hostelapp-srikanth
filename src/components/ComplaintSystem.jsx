import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns'; // For formatting dates
import ComplaintForm from './ComplaintForm'; // Reuse the form for staff submissions

function ComplaintSystem() {
  const { user, profile } = useAuth(); // Need profile to confirm user is set up
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchComplaints = useCallback(async () => {
    if (!profile && !profile?.is_admin) {
        // Don't fetch if profile isn't loaded or user isn't admin
        // The profile check ensures we know the user's branch or admin status
        // This prevents fetching before the profile is confirmed.
        // A loading state could be shown based on profile loading from useAuth if needed.
        setLoading(false);
        return;
    }

    setLoading(true);
    setError('');
    try {
        // RLS automatically handles filtering by assigned_branch_id or is_admin
        // Fetch branch name along with complaint details
        const { data, error: fetchError } = await supabase
            .from('complaints')
            .select(`
                id,
                description,
                status,
                created_at,
                resolved_at,
                branches ( name ) // Fetch the related branch name
            `)
            .order('created_at', { ascending: false }); // Show newest first

        if (fetchError) throw fetchError;

        // Process data to handle nested branch name
        const formattedData = data.map(c => ({
            ...c,
            branch_name: c.branches?.name || 'N/A' // Handle potential null if branch deleted
        }));

        setComplaints(formattedData || []);
    } catch (err) {
        console.error('Error fetching complaints:', err);
        setError(`Failed to load complaints: ${err.message}`);
    } finally {
        setLoading(false);
    }
  }, [profile]); // Dependency on profile ensures fetch runs when profile is loaded/updated

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]); // Run fetchComplaints when the function reference changes (due to profile change)

  const handleResolve = async (complaintId) => {
    if (!user) return; // Should not happen if component is protected

    // Optional: Add a confirmation dialog here

    setLoading(true); // Indicate loading state for the update
    setError('');
    try {
      const { error: updateError } = await supabase
        .from('complaints')
        .update({
          status: 'Resolved',
          resolved_at: new Date().toISOString(), // Record resolution time
          resolved_by_user_id: user.id // Optional: Track who resolved it
          // resolution_comment: 'Resolved via system' // Add a comment field later if needed
        })
        .eq('id', complaintId);

      if (updateError) throw updateError;

      // Refresh the complaints list after successful update
      fetchComplaints();

    } catch (err) {
      console.error('Error resolving complaint:', err);
      setError(`Failed to update complaint status: ${err.message}`);
      setLoading(false); // Ensure loading is turned off on error
    }
    // setLoading(false) is handled in fetchComplaints' finally block after refresh
  };

  // Render logic based on state
  if (loading && complaints.length === 0) {
    return <p>Loading complaints...</p>;
  }

  if (!profile && !user) {
     // Should be handled by routing/AuthContext, but as fallback:
     return <p>Please log in and select your branch to view complaints.</p>;
  }

  if (error) {
    return (
        <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
        </Alert>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold">Complaint Management</h1>

      {/* Optionally include the form for staff to submit complaints */}
      <div className="mb-8 p-4 border rounded shadow-md">
          <h2 className="text-xl font-semibold mb-4">Submit a New Complaint</h2>
          <ComplaintForm />
      </div>

      <h2 className="text-2xl font-semibold">Current Complaints</h2>
      {complaints.length === 0 && !loading ? (
        <p>No complaints found matching your view.</p>
      ) : (
        <div className="border rounded-lg overflow-hidden">
           <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Reported</TableHead>
                <TableHead>Branch</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {complaints.map((complaint) => (
                <TableRow key={complaint.id}>
                  <TableCell>{format(new Date(complaint.created_at), 'yyyy-MM-dd HH:mm')}</TableCell>
                  <TableCell>{complaint.branch_name}</TableCell> {/* Display fetched branch name */}
                  <TableCell className="whitespace-pre-wrap">{complaint.description}</TableCell>
                  <TableCell>
                     <Badge variant={complaint.status === 'Resolved' ? 'success' : 'destructive'}>
                        {complaint.status}
                     </Badge>
                  </TableCell>
                  <TableCell>
                    {complaint.status === 'New' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleResolve(complaint.id)}
                        disabled={loading} // Disable button during any loading action
                      >
                        Mark Resolved
                      </Button>
                    )}
                    {complaint.status === 'Resolved' && complaint.resolved_at && (
                         <span className="text-xs text-gray-500">
                            Resolved: {format(new Date(complaint.resolved_at), 'yyyy-MM-dd')}
                         </span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

export default ComplaintSystem;
  