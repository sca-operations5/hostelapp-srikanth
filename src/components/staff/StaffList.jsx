
    import React, { useState } from 'react';
    import { supabase } from '@/lib/supabaseClient';
    import { Button, buttonVariants } from "@/components/ui/button";
    import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
    import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
    import { useToast } from "@/components/ui/use-toast";
    import { Users, Download, Trash2 } from 'lucide-react';
    import { exportToExcel } from '@/utils/exportToExcel';
    import {
      AlertDialog,
      AlertDialogAction,
      AlertDialogCancel,
      AlertDialogContent,
      AlertDialogDescription,
      AlertDialogFooter,
      AlertDialogHeader,
      AlertDialogTitle,
      AlertDialogTrigger,
    } from "@/components/ui/alert-dialog";

    const StaffList = ({ staffList, isLoading, onStaffDeleted }) => {
      const [isDeleting, setIsDeleting] = useState(false);
      const { toast } = useToast();

      const deleteStaff = async (staffId, staffName) => {
        setIsDeleting(true);
        try {
          const { error } = await supabase
            .from('staff')
            .delete()
            .match({ id: staffId });

          if (error) throw error;

          toast({
            title: "Staff Removed",
            description: `${staffName} has been successfully removed.`,
          });
          if (onStaffDeleted) {
            onStaffDeleted(); // Callback to refresh list
          }
        } catch (error) {
          toast({
            title: "Error removing staff",
            description: error.message,
            variant: "destructive",
          });
        } finally {
          setIsDeleting(false);
        }
      };

      const handleExport = () => {
        if (staffList.length === 0) {
          toast({
            title: "No Data",
            description: "There is no staff data to export.",
            variant: "destructive",
          });
          return;
        }
         const exportData = staffList.map(s => ({
             'Staff ID': s.staff_id,
             'Name': s.name,
             'Email': s.email, // Added email to export
             'Branch': s.branch,
             'Role': s.role,
             'Contact': s.contact_number,
             'Added On': new Date(s.created_at).toLocaleDateString(),
         }));
        exportToExcel(exportData, 'Staff_List');
        toast({
          title: "Export Successful",
          description: "Staff list exported to Excel.",
        });
      };

      return (
        <Card className="shadow-lg border-none">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center text-xl text-primary">
              <Users className="mr-2 h-6 w-6" /> Staff List
            </CardTitle>
            <Button onClick={handleExport} variant="outline" size="sm" className="ml-auto border-primary text-primary hover:bg-primary/10">
              <Download className="mr-2 h-4 w-4" /> Export to Excel
            </Button>
          </CardHeader>
          <CardContent>
            {isLoading && staffList.length === 0 ? (
               <p className="text-center text-gray-500">Loading staff data...</p>
            ) : staffList.length === 0 ? (
               <p className="text-center text-gray-500">No staff members added yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Staff ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Branch</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Added On</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {staffList.map((staff) => (
                      <TableRow key={staff.id}>
                        <TableCell className="font-medium">{staff.staff_id}</TableCell>
                        <TableCell>{staff.name}</TableCell>
                        <TableCell>{staff.email}</TableCell>
                        <TableCell>{staff.branch}</TableCell>
                        <TableCell>{staff.role || '-'}</TableCell>
                        <TableCell>{staff.contact_number || '-'}</TableCell>
                        <TableCell>{new Date(staff.created_at).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                           <AlertDialog>
                             <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive/80" disabled={isDeleting}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                             </AlertDialogTrigger>
                             <AlertDialogContent>
                               <AlertDialogHeader>
                                 <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                 <AlertDialogDescription>
                                   This action cannot be undone. This will permanently remove {staff.name} from the staff list.
                                 </AlertDialogDescription>
                               </AlertDialogHeader>
                               <AlertDialogFooter>
                                 <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                                 <AlertDialogAction
                                   onClick={() => deleteStaff(staff.id, staff.name)}
                                   disabled={isDeleting}
                                   className={buttonVariants({ variant: "destructive" })}
                                  >
                                   {isDeleting ? 'Removing...' : 'Remove'}
                                 </AlertDialogAction>
                               </AlertDialogFooter>
                             </AlertDialogContent>
                           </AlertDialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      );
    };

    export default StaffList;
  