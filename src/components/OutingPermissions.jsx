
    import React, { useState, useEffect } from "react";
    import { Button } from "@/components/ui/button";
    import { Input } from "@/components/ui/input";
    import { Textarea } from "@/components/ui/textarea";
    import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
    import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
    import { Label } from "@/components/ui/label";
    import { useToast } from "@/components/ui/use-toast";
    import { motion } from "framer-motion";
    import { Upload, Download } from "lucide-react";
    import { branchesData } from "@/utils/hostelData";
    import { exportToExcel } from "@/utils/exportToExcel";

    function OutingPermissions() {
      const [permissions, setPermissions] = useState([]);
      const [newPermission, setNewPermission] = useState({
        studentName: "",
        branch: "",
        destination: "",
        reason: "",
        departureTime: "",
        returnTime: "",
        parentNotified: "no",
        parentResponse: "",
        permissionLetter: null, // Store filename
      });
      const { toast } = useToast();

      const branches = branchesData.map(b => b.name);

      useEffect(() => {
        const savedPermissions = localStorage.getItem("outingPermissions");
        if (savedPermissions) {
          setPermissions(JSON.parse(savedPermissions));
        }
      }, []);

      const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
          // In a real app, you'd upload the file and store a URL/ID.
          // Here, we just store the filename for display.
          setNewPermission({ ...newPermission, permissionLetter: e.target.files[0].name });
           toast({ title: "File Selected", description: e.target.files[0].name });
        }
      };

      const handleSubmit = (e) => {
        e.preventDefault();
         if (!newPermission.studentName || !newPermission.branch || !newPermission.destination || !newPermission.departureTime || !newPermission.returnTime) {
           toast({ title: "Error", description: "Please fill all required fields.", variant: "destructive" });
           return;
         }
         if (newPermission.parentNotified === 'yes' && !newPermission.parentResponse) {
            toast({ title: "Error", description: "Please record parent's response.", variant: "destructive" });
           return;
         }

        const permissionEntry = {
          ...newPermission,
          id: Date.now(),
          status: "pending",
          requestDate: new Date().toISOString(),
        };

        const updatedPermissions = [permissionEntry, ...permissions];
        setPermissions(updatedPermissions);
        localStorage.setItem("outingPermissions", JSON.stringify(updatedPermissions));

        setNewPermission({
          studentName: "", branch: "", destination: "", reason: "",
          departureTime: "", returnTime: "", parentNotified: "no",
          parentResponse: "", permissionLetter: null,
        });
        // Reset file input visually if possible (browser limitation)
        const fileInput = document.getElementById('permissionLetter');
        if (fileInput) fileInput.value = '';


        toast({
          title: "Success",
          description: "Outing permission request submitted.",
        });
      };

      const handlePermissionStatus = (id, status) => {
         const updatedPermissionsList = permissions.map(p =>
           p.id === id ? { ...p, status: status } : p
         );
         setPermissions(updatedPermissionsList);
         localStorage.setItem("outingPermissions", JSON.stringify(updatedPermissionsList));
         toast({
           title: "Status Updated",
           description: `Permission status set to ${status}.`,
         });
      };

       const handleExport = () => {
         if (permissions.length === 0) {
           toast({ title: "No Data", description: "There are no outing permissions to export.", variant: "destructive" });
           return;
         }
         const dataToExport = permissions.map(({ id, ...rest }) => ({
           ...rest,
           requestDate: new Date(rest.requestDate).toLocaleString(),
           departureTime: new Date(rest.departureTime).toLocaleString(),
           returnTime: new Date(rest.returnTime).toLocaleString(),
         }));
         exportToExcel(dataToExport, "OutingPermissionsLog");
       };

      return (
        <div className="space-y-8">
           <div className="flex justify-between items-center">
             <h1 className="text-4xl font-bold">Outing Permissions</h1>
             <Button onClick={handleExport} variant="outline">
               <Download className="mr-2 h-4 w-4" /> Export Log
             </Button>
           </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Request Outing Permission</CardTitle>
                <CardDescription>Fill in the details for the outing request. Parent notification is required for approval.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="studentName">Student Name</Label>
                      <Input id="studentName" value={newPermission.studentName} onChange={(e) => setNewPermission({...newPermission, studentName: e.target.value})} />
                    </div>
                     <div>
                      <Label htmlFor="branch">Branch</Label>
                      <Select onValueChange={(value) => setNewPermission({...newPermission, branch: value})} value={newPermission.branch}>
                        <SelectTrigger id="branch"><SelectValue placeholder="Select Branch" /></SelectTrigger>
                        <SelectContent>
                          {branches.map(branch => (<SelectItem key={branch} value={branch}>{branch}</SelectItem>))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                   <div>
                    <Label htmlFor="destination">Destination</Label>
                    <Input id="destination" value={newPermission.destination} onChange={(e) => setNewPermission({...newPermission, destination: e.target.value})} />
                  </div>
                   <div>
                    <Label htmlFor="reason">Reason for Outing</Label>
                    <Textarea id="reason" value={newPermission.reason} onChange={(e) => setNewPermission({...newPermission, reason: e.target.value})} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                      <Label htmlFor="departureTime">Departure Time</Label>
                      <Input id="departureTime" type="datetime-local" value={newPermission.departureTime} onChange={(e) => setNewPermission({...newPermission, departureTime: e.target.value})} />
                    </div>
                     <div>
                      <Label htmlFor="returnTime">Expected Return Time</Label>
                      <Input id="returnTime" type="datetime-local" value={newPermission.returnTime} onChange={(e) => setNewPermission({...newPermission, returnTime: e.target.value})} />
                    </div>
                  </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                      <Label htmlFor="parentNotified">Parent Notified?</Label>
                      <Select onValueChange={(value) => setNewPermission({...newPermission, parentNotified: value})} value={newPermission.parentNotified}>
                        <SelectTrigger id="parentNotified"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yes">Yes</SelectItem>
                          <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                     <div>
                      <Label htmlFor="parentResponse">Parent Response</Label>
                      <Input id="parentResponse" placeholder="Record parent's response (verbal/written)" value={newPermission.parentResponse} onChange={(e) => setNewPermission({...newPermission, parentResponse: e.target.value})} disabled={newPermission.parentNotified === 'no'}/>
                    </div>
                  </div>
                   <div>
                     <Label htmlFor="permissionLetter">Upload Parent Letter (Optional)</Label>
                     <div className="flex items-center space-x-2">
                       <Input id="permissionLetter" type="file" className="hidden" onChange={handleFileChange} />
                       <Button type="button" variant="outline" onClick={() => document.getElementById('permissionLetter')?.click()}>
                         <Upload className="mr-2 h-4 w-4" /> Choose File
                       </Button>
                       {newPermission.permissionLetter && <span className="text-sm text-muted-foreground">{newPermission.permissionLetter}</span>}
                     </div>
                   </div>
                  <Button type="submit">Submit Request</Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Outing Log / Permission Status</h2>
             {permissions.length === 0 ? (
               <p className="text-muted-foreground">No outing requests logged yet.</p>
            ) : (
              permissions.map((perm, index) => (
                <motion.div
                  key={perm.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold">{perm.studentName} ({perm.branch})</p>
                          <p className="text-sm">Destination: {perm.destination}</p>
                          <p className="text-sm">Time: {new Date(perm.departureTime).toLocaleString()} - {new Date(perm.returnTime).toLocaleTimeString()}</p>
                          <p className="text-sm">Parent Notified: {perm.parentNotified}</p>
                          {perm.parentNotified === 'yes' && <p className="text-sm">Response: {perm.parentResponse}</p>}
                          {perm.permissionLetter && <p className="text-sm">Letter: {perm.permissionLetter}</p>}
                           <p className="text-sm capitalize">Status: <span className={`font-medium ${perm.status === 'approved' ? 'text-green-600' : perm.status === 'rejected' ? 'text-red-600' : 'text-yellow-600'}`}>{perm.status}</span></p>
                        </div>
                         <div className="flex flex-col space-y-1 items-end">
                           <p className="text-xs text-muted-foreground">Requested: {new Date(perm.requestDate).toLocaleDateString()}</p>
                           {perm.status === 'pending' && (
                             <div className="flex space-x-1">
                               <Button size="sm" variant="outline" className="text-green-600 border-green-600 hover:bg-green-100" onClick={() => handlePermissionStatus(perm.id, 'approved')}>Approve</Button>
                               <Button size="sm" variant="outline" className="text-red-600 border-red-600 hover:bg-red-100" onClick={() => handlePermissionStatus(perm.id, 'rejected')}>Reject</Button>
                             </div>
                           )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </div>
        </div>
      );
    }

    export default OutingPermissions;
  