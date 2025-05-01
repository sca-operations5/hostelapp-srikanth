
    import React, { useState } from 'react';
    import { useNavigate, Link } from 'react-router-dom';
    import { Button } from "@/components/ui/button";
    import { Input } from "@/components/ui/input";
    import { Label } from "@/components/ui/label";
    import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card";
    import { useToast } from "@/components/ui/use-toast";
    import { motion } from "framer-motion";
    import { UserPlus } from 'lucide-react';
    import { supabase } from '@/lib/supabaseClient'; // Import Supabase client directly for signup

    function Signup() {
      const [email, setEmail] = useState('');
      const [password, setPassword] = useState('');
      const [confirmPassword, setConfirmPassword] = useState('');
      const [isLoading, setIsLoading] = useState(false);
      const navigate = useNavigate();
      const { toast } = useToast();

      const handleSignup = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
          toast({
            title: "Signup Failed",
            description: "Passwords do not match.",
            variant: "destructive",
          });
          return;
        }
        setIsLoading(true);
        try {
          // Sign up the user with Supabase Auth
          const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
            // You can add options here, like user metadata (e.g., default role) if needed
            // options: {
            //   data: {
            //     role: 'staff' // Example: Assign 'staff' role by default
            //   }
            // }
          });

          if (error) throw error;

          // Check if email confirmation is required (Supabase default)
          if (data.user && !data.user.email_confirmed_at) {
             toast({
               title: "Signup Successful",
               description: "Please check your email to confirm your account.",
             });
             navigate("/login"); // Redirect to login page after signup
          } else if (data.user) {
             toast({
               title: "Signup Successful",
               description: "You can now log in.",
             });
             navigate("/login"); // Redirect to login page
          } else {
             // Handle cases where user object might be null unexpectedly
             throw new Error("Signup completed but user data not received.");
          }

        } catch (error) {
          toast({
            title: "Signup Failed",
            description: error.message || "Could not create account.",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      };

      return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="w-full max-w-sm shadow-2xl border-none bg-background/80 backdrop-blur-sm">
              <CardHeader className="space-y-1 text-center">
                 <motion.div
                   initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring' }}
                   className="flex justify-center mb-4"
                 >
                   <div className="p-3 bg-secondary rounded-full text-secondary-foreground">
                      <UserPlus className="h-6 w-6" />
                   </div>
                 </motion.div>
                <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
                <CardDescription>Enter your details to register</CardDescription>
              </CardHeader>
              <form onSubmit={handleSignup}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                    />
                  </div>
                   <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                  <Button type="submit" className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground" disabled={isLoading}>
                    {isLoading ? 'Creating Account...' : 'Sign Up'}
                  </Button>
                   <p className="text-sm text-muted-foreground">
                     Already have an account?{' '}
                     <Link to="/login" className="font-medium text-primary hover:underline">
                       Login
                     </Link>
                   </p>
                </CardFooter>
              </form>
            </Card>
          </motion.div>
        </div>
      );
    }

    export default Signup;
  