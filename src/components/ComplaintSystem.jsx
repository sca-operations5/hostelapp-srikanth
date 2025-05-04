import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format, parseISO } from 'date-fns';
import ComplaintForm from './ComplaintForm';
import ManageComplaintDialog from './ManageComplaintDialog';
import { Pencil } from 'lucide-react';

// Role check removed for prototype
// const complaintManagerRoles = ['admin', 'warden', 'repair_person'];

function ComplaintSystem() {
  // Remove userRole and isProfileSetupComplete from useAuth() if not needed elsewhere
  // Keep user if needed for resolved_by_user_id (or make that null too)
  const { user } = useAuth(); 
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchComplaints = useCallback(async () => {
    // Removed profile setup check
    setLoading(true);
    setError('');
    try {
        const { data, error: fetchError } = await supabase
            .from('complaints')
            .select(`
                id,
                description,
                status,
                created_at,
                resolved_at,
                cost,
                resolution_comment,
                expected_resolution_date,
                branches ( name )
            `)
            .order('created_at', { ascending: false });

        if (fetchError) throw fetchError;

        const formattedData = data.map(c => ({
            ...c,
            branch_name: c.branches?.name || 'N/A'
        }));

        setComplaints(formattedData || []);
    } catch (err) {
        console.error('Error fetching complaints:', err);
        setError(`Failed to load complaints: ${err.message}`);
    } finally {
        setLoading(false);
    }
  // Removed dependency on isProfileSetupComplete
  }, []); 

  useEffect(() => {
      fetchComplaints();
  // Removed dependency on isProfileSetupComplete
  }, [fetchComplaints]);

  // Removed canManageComplaints check

  if (loading) {
    return <p>Loading complaints...</p>;
  }

   // Simplified error check
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
      <h1 className="text-3xl font-bold">Complaint Management (Prototype - Open Access)</h1>

      {/* Always show form in prototype mode */}
      <div className="mb-8 p-4 border rounded shadow-md">
          <h2 className="text-xl font-semibold mb-4">Submit a New Complaint</h2>
          <ComplaintForm onComplaintSubmitted={fetchComplaints} />
      </div>

      <h2 className="text-2xl font-semibold">Current Complaints</h2>
      {complaints.length === 0 ? (
        <p>No complaints found.</p> // Simplified message
      ) : (
        <div className="border rounded-lg overflow-hidden">
           <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Reported</TableHead>
                <TableHead>Branch</TableHead>
                <TableHead className="w-1/3">Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Cost (INR)</TableHead>
                <TableHead className="w-1/4">Resolution/Comment</TableHead>
                <TableHead>Expected Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {complaints.map((complaint) => (
                <TableRow key={complaint.id}>
                  <TableCell>{format(parseISO(complaint.created_at), 'yyyy-MM-dd HH:mm')}</TableCell>
                  <TableCell>{complaint.branch_name}</TableCell>
                  <TableCell className="whitespace-pre-wrap text-sm">{complaint.description}</TableCell>
                  <TableCell>
                     <Badge variant={complaint.status === 'Resolved' ? 'success' : 'destructive'}>
                        {complaint.status}
                     </Badge>
                     {complaint.status === 'Resolved' && complaint.resolved_at && (
                         <p className="text-xs text-muted-foreground mt-1">
                            {format(parseISO(complaint.resolved_at), 'yyyy-MM-dd')}
                         </p>
                     )}
                  </TableCell>
                  <TableCell className="text-right">{complaint.cost ? complaint.cost.toFixed(2) : '-'}</TableCell>
                  <TableCell className="whitespace-pre-wrap text-xs text-muted-foreground">{complaint.resolution_comment || '-'}</TableCell>
                  <TableCell>
                      {complaint.expected_resolution_date ? format(parseISO(complaint.expected_resolution_date), 'yyyy-MM-dd HH:mm') : '-'}
                  </TableCell>
                  <TableCell>
                    {/* Always show Manage button in prototype */}
                    <ManageComplaintDialog complaint={complaint} onUpdate={fetchComplaints}>
                        <Button size="sm" variant="outline">
                            <Pencil className="h-4 w-4 mr-1" /> Manage
                        </Button>
                    </ManageComplaintDialog>
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
  