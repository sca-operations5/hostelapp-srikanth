
    import React, { useState } from 'react';
    import { Button } from "@/components/ui/button";
    import { Input } from "@/components/ui/input";
    import { Label } from "@/components/ui/label";
    import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
    import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
    import { useToast } from "@/components/ui/use-toast";
    import { PlusCircle, Mail, Lock } from 'lucide-react';

    const StaffForm = ({ onSubmit, isLoading, branches }) => {
      const [newStaff, setNewStaff] = useState({
        staff_id: '',
        name: '',
        branch: '',
        role: '',
        contact_number: '',
        email: '',
        password: ''
      });
      const { toast } = useToast();

      const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewStaff(prevState => ({ ...prevState, [name]: value }));
      };

      const handleBranchChange = (value) => {
        setNewStaff(prevState => ({ ...prevState, branch: value }));
      };

      const handleSubmit = (e) => {
        e.preventDefault();
        if (!newStaff.staff_id || !newStaff.name || !newStaff.branch || !newStaff.email || !newStaff.password) {
          toast({
            title: "Missing Information",
            description: "Please fill in all required fields (Staff ID, Name, Branch, Email, Password).",
            variant: "destructive",
          });
          return;
        }
        if (newStaff.password.length < 6) {
          toast({
            title: "Weak Password",
            description: "Password must be at least 6 characters long.",
            variant: "destructive",
          });
          return;
        }
        onSubmit(newStaff).then(() => {
           setNewStaff({ staff_id: '', name: '', branch: '', role: '', contact_number: '', email: '', password: '' });
        });
      };

      return (
        <Card className="mb-6 bg-gradient-to-br from-blue-50 to-indigo-100 shadow-lg border-none">
          <CardHeader>
            <CardTitle className="flex items-center text-xl text-primary">
              <PlusCircle className="mr-2 h-6 w-6" /> Add New Staff Member
            </CardTitle>
          </CardHeader>
          <form onSubmit={handleSubmit}>
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
                <Label htmlFor="email">Email (Login)</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input id="email" name="email" type="email" value={newStaff.email} onChange={handleInputChange} placeholder="staff.email@example.com" required className="pl-10"/>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input id="password" name="password" type="password" value={newStaff.password} onChange={handleInputChange} placeholder="Min. 6 characters" required className="pl-10"/>
                </div>
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
                {isLoading ? 'Adding...' : 'Add Staff & Create Login'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      );
    };

    export default StaffForm;
  