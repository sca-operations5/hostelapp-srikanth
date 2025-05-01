
    import React, { useState, useEffect } from 'react';
    import { useNavigate } from 'react-router-dom';
    import { supabase } from '@/lib/supabaseClient';
    import { Button } from "@/components/ui/button";
    import { Input } from "@/components/ui/input";
    import { Label } from "@/components/ui/label";
    import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
    import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
    import { useToast } from "@/components/ui/use-toast";
    import { UserPlus, Mail, Lock } from 'lucide-react';
    import { motion } from 'framer-motion';
    import { branchesData as branches } from '@/utils/hostelData';

    const SetupAdmin = () => {
      const [adminDetails, setAdminDetails] = useState({
        staff_id: 'ADMIN001', // Default suggestion
        name: '',
        branch: '',
        role: 'Administrator', // Default role
        contact_number: '',
        email: '',
        password: ''
      });
      const [isLoading, setIsLoading] = useState(false);
      const [checkingUsers, setCheckingUsers] = useState(true);
      const { toast } = useToast();
      const navigate = useNavigate();

      useEffect(() => {
        // Check if any staff users already exist. If so, redirect away.
        const checkExistingUsers = async () => {
          try {
            // Use head: true for a faster count check without fetching data
            const { count, error } = await supabase
              .from('staff')
              .select('*', { count: 'exact', head: true });

            if (error) throw error;

            if (count > 0) {
              toast({
                title: "Setup Complete",
                description: "An administrator account already exists. Redirecting to login.",
              });
              navigate('/login');
            }
          } catch (error) {
            console.error("Error checking for existing users:", error);
            // Proceed with setup even if check fails, better than blocking entirely
          } finally {
            setCheckingUsers(false);
          }
        };
        checkExistingUsers();
      }, [navigate, toast]);


      const handleInputChange = (e) => {
        const { name, value } = e.target;
        setAdminDetails(prevState => ({ ...prevState, [name]: value }));
      };

      const handleBranchChange = (value) => {
        setAdminDetails(prevState => ({ ...prevState, branch: value }));
      };

      const createAdmin = async (e) => {
        e.preventDefault();
        if (!adminDetails.staff_id || !adminDetails.name || !adminDetails.branch || !adminDetails.email || !adminDetails.password) {
          toast({
            title: "Missing Information",
            description: "Please fill in all required fields.",
            variant: "destructive",
          });
          return;
        }
        if (adminDetails.password.length < 6) {
          toast({
            title: "Weak Password",
            description: "Password must be at least 6 characters long.",
            variant: "destructive",
          });
          return;
        }

        setIsLoading(true);
        try {
           // Double-check no users were created concurrently
           const { count: existingCount, error: checkError } = await supabase
             .from('staff')
             .select('*', { count: 'exact', head: true });

           if (checkError) throw checkError;
           if (existingCount > 0) {
             toast({
               title: "Setup Already Done",
               description: "Another user was just created. Redirecting to login.",
               variant: "destructive",
             });
             navigate('/login');
             return;
           }


          // 1. Create Auth User - Explicitly disable email confirmation
          const { data: authData, error: authError } = await supabase.auth.signUp({
            email: adminDetails.email,
            password: adminDetails.password,
            options: {
              email_confirm: false, // Force disable email confirmation
              data: {
                full_name: adminDetails.name,
                role: 'admin'
              }
            }
          });

          if (authError) throw authError;
          // Check if user object exists, even if email confirmation is disabled
          if (!authData.user && !authData.session) {
             // If both user and session are null, sign up likely failed silently or needs verification still
             // This case might happen if Supabase settings override the option
             throw new Error("Failed to create authentication user or session. Please check Supabase settings.");
          }

          // Use user ID from user object if available, otherwise handle potential session-only response
          const userId = authData.user?.id;
          if (!userId) {
             // This shouldn't happen with email_confirm: false, but handle defensively
             throw new Error("Could not retrieve user ID after sign up.");
          }


          // 2. Create Staff Record
          const { error: dbError } = await supabase
            .from('staff')
            .insert([{
              staff_id: adminDetails.staff_id,
              name: adminDetails.name,
              branch: adminDetails.branch,
              role: adminDetails.role,
              contact_number: adminDetails.contact_number,
              email: adminDetails.email,
              user_id: userId // Link to the auth user
            }]);

          if (dbError) {
            // Attempt to clean up the auth user if DB insert fails
            // Note: This requires admin privileges. If it fails, manual cleanup might be needed.
            try {
               // Check if admin API is available (won't be in browser usually)
               if (supabase.auth.admin) {
                 await supabase.auth.admin.deleteUser(userId);
               } else {
                 console.warn("Cannot automatically clean up auth user without admin privileges.");
               }
            } catch (cleanupError) {
               console.error("Failed to cleanup auth user:", cleanupError);
            }
            throw dbError;
          }

          toast({
            title: "Administrator Created",
            description: "Your admin account is set up. Please log in.",
          });
          navigate('/login'); // Redirect to login page

        } catch (error) {
          let description = error.message;
           if (error.message?.includes('duplicate key value violates unique constraint')) {
               description = `An account with this email or Staff ID might already exist.`;
           } else if (error.message?.includes('sign up user') || error.message?.includes('sign up requires')) {
               description = `Could not create login. Check if email is valid or already taken. Ensure Supabase email confirmation is disabled if intended.`
           } else if (error.message?.includes('already registered')) {
               description = `This email address is already registered. Please use a different email or log in.`
           }
          toast({
            title: "Error Creating Admin",
            description: description,
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      };

      if (checkingUsers) {
         return <div className="min-h-screen flex items-center justify-center">Checking setup status...</div>;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-teal-100 to-cyan-100 p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-2xl"
          >
            <Card className="shadow-2xl border border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center text-2xl text-primary">
                  <UserPlus className="mr-3 h-7 w-7" /> Create Initial Administrator Account
                </CardTitle>
                 <p className="text-muted-foreground pt-2">
                   Set up the first user account to manage the Hostel System. This page will only be shown once. <strong className="text-destructive">Please use a new email address if you tried before.</strong>
                 </p>
              </CardHeader>
              <form onSubmit={createAdmin}>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="staff_id">Staff ID</Label>
                    <Input id="staff_id" name="staff_id" value={adminDetails.staff_id} onChange={handleInputChange} placeholder="e.g., ADMIN001" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" name="name" value={adminDetails.name} onChange={handleInputChange} placeholder="Administrator's Name" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="branch">Primary Branch</Label>
                    <Select onValueChange={handleBranchChange} value={adminDetails.branch} name="branch" required>
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
                     <Input id="role" name="role" value={adminDetails.role} onChange={handleInputChange} disabled />
                   </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email (Login) <span className="text-destructive">*Use New Email*</span></Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input id="email" name="email" type="email" value={adminDetails.email} onChange={handleInputChange} placeholder="new.admin.email@example.com" required className="pl-10"/>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input id="password" name="password" type="password" value={adminDetails.password} onChange={handleInputChange} placeholder="Min. 6 characters" required className="pl-10"/>
                    </div>
                  </div>
                   <div className="space-y-2 md:col-span-2">
                     <Label htmlFor="contact_number">Contact Number (Optional)</Label>
                     <Input id="contact_number" name="contact_number" type="tel" value={adminDetails.contact_number} onChange={handleInputChange} placeholder="Phone Number" />
                   </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" disabled={isLoading} className="w-full md:w-auto bg-primary hover:bg-primary/90 text-white">
                    {isLoading ? 'Creating Account...' : 'Create Admin Account & Proceed to Login'}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </motion.div>
        </div>
      );
    };

    export default SetupAdmin;
  