
    import React from 'react';
    import { Button } from "@/components/ui/button";
    import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
    import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
    import { Users, Download } from 'lucide-react';

    const StaffTable = ({ staffList, isLoading, onExport }) => {
      return (
        <Card className="shadow-lg border-none">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center text-xl text-primary">
              <Users className="mr-2 h-6 w-6" /> Staff List
            </CardTitle>
            <Button onClick={onExport} variant="outline" size="sm" className="ml-auto border-primary text-primary hover:bg-primary/10">
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

    export default StaffTable;
  