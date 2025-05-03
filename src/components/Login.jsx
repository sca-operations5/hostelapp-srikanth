import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn, error, isLoading } = useAuth(); // Use signIn from context
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error: signInError } = await signIn(email, password);
    if (!signInError) {
        // Login successful, context listener should pick it up
        // Or we could navigate here, but let listener handle it for consistency
        // navigate('/'); 
        console.log('signIn function completed successfully in Login.jsx');
    } else {
        // Error is already set in context, maybe log it here too
        console.error('Error from signIn in Login.jsx:', signInError);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-8 border rounded shadow-lg bg-white">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <Label htmlFor="email-address">Email address</Label>
              <Input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center p-2 bg-red-100 rounded">
                {typeof error === 'string' ? error : error.message || 'Login failed'}
            </div>
          )}

          <div>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>
          </div>
        </form>
         {/* Optional: Add link to forgot password or sign up if needed */}
      </div>
    </div>
  );
}

export default Login;
