
    import React, { useState } from 'react';
    import { supabase } from '@/lib/supabaseClient';
    import { Button } from "@/components/ui/button";
    import { Input } from "@/components/ui/input";
    import { Label } from "@/components/ui/label";
    import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
    import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
    import { useToast } from "@/components/ui/use-toast";
    import { PlusCircle } from 'lucide-react';
    import { branchesData as branches } from '@/utils/hostelData';

    const AddStaffForm = ({ onStaffAdded }) => {
      const [newStaff, setNewStaff] = useState({
        staff_id: '',
        name: '',
        branch: '',
        role: '',
        contact_number: '',
        email: '' // Added email field
      });
      const [isLoading, setIsLoading] = useState(false);
      const { toast } = useToast();

      const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewStaff(prevState => ({ ...prevState, [name]: value }));
      };

      const handleBranchChange = (value) => {
        setNewStaff(prevState => ({ ...prevState, branch: value }));
      };

      const addStaff = async (e) => {
        e.preventDefault();
        if (!newStaff.staff_id || !newStaff.name || !newStaff.branch || !newStaff.email) { // Added email validation
          toast({
            title: "Missing Information",
            description: "Please fill in Staff ID, Name, Branch, and Email.", // Updated message
            variant: "destructive",
          });
          return;
        }

        setIsLoading(true);
        try {
          const { data, error } = await supabase
            .from('staff')
            .insert([newStaff])
            .select();

          if (error) throw error;

          setNewStaff({ staff_id: '', name: '', branch: '', role: '', contact_number: '', email: '' }); // Reset email field
          toast({
            title: "Staff Added",
            description: `${newStaff.name} has been successfully added.`,
          });
          if (onStaffAdded) {
            onStaffAdded(); // Callback to refresh list
          }
        } catch (error) {
           let description = error.message;
           if (error.message?.includes('duplicate key value violates unique constraint "staff_staff_id_key"')) {
             description = `Staff with ID ${newStaff.staff_id} already exists.`;
           } else if (error.message?.includes('duplicate key value violates unique constraint "staff_email_key"')) {
             description = `Staff with email ${newStaff.email} already exists.`;
           } else if (error.message?.includes('violates not-null constraint')) {
             description = "Please ensure all required fields (Staff ID, Name, Branch, Email) are filled.";
           }
           toast({
             title: "Error adding staff",
             description: description,
             variant: "destructive",
           });
        } finally {
          setIsLoading(false);
        }
      };

      return (
        <Card className="mb-6 bg-gradient-to-br from-blue-50 to-indigo-100 shadow-lg border-none">
          <CardHeader>
            <CardTitle className="flex items-center text-xl text-primary">
              <PlusCircle className="mr-2 h-6 w-6" /> Add New Staff Member
            </CardTitle>
          </CardHeader>
          <form onSubmit={addStaff}>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="staff_id">Staff ID</Label>
                <Input id="staff_id" name="staff_id" value={newStaff.staff_id} onChange={handleInputChange} placeholder="e.g., STF001" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" value={newStaff.name} onChange={handleInputChange} placeholder="Full Name" required />
              </div>
               <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" value={newStaff.email} onChange={handleInputChange} placeholder="Email Address" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="branch">Branch</Label>
                <Select onValueChange={handleBranchChange} value={newStaff.branch} name="branch" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Branch" />
                  </SelectTrigger>
                  <SelectContent>
                    {branches.map(branch => (
                      <SelectItem key={branch.id} value={branch.name}>{branch.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Input id="role" name="role" value={newStaff.role} onChange={handleInputChange} placeholder="e.g., Warden, Security" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact_number">Contact Number</Label>
                <Input id="contact_number" name="contact_number" type="tel" value={newStaff.contact_number} onChange={handleInputChange} placeholder="Phone Number" />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isLoading} className="bg-primary hover:bg-primary/90 text-white">
                {isLoading ? 'Adding...' : 'Add Staff'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      );
    };

    export default AddStaffForm;
  