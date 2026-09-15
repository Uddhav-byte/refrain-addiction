import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Leaf, Loader2 } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.username || !formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      await register(formData);
      navigate('/');
    } catch (err) {
      setError('Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
      <div className="w-full max-w-4xl flex bg-card rounded-2xl shadow-xl overflow-hidden border border-border min-h-[600px]">
        {/* Left side visual */}
        <div className="hidden md:flex flex-col justify-center items-center w-1/2 p-12 bg-primary/5 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent pointer-events-none" />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="z-10 text-center"
          >
            <div className="flex justify-center mb-6">
              <Leaf className="w-20 h-20 text-primary" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Refrain</h1>
            <p className="text-lg text-muted-foreground">Take the first step towards a better you.</p>
          </motion.div>
        </div>

        {/* Right side form */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-8">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full max-w-sm"
          >
            <div className="md:hidden flex items-center gap-2 mb-6 justify-center">
              <Leaf className="w-8 h-8 text-primary" />
              <span className="text-2xl font-bold">Refrain</span>
            </div>
            
            <Card className="border-0 shadow-none bg-transparent">
              <CardHeader className="px-0 pt-0">
                <CardTitle className="text-2xl">Create account</CardTitle>
                <CardDescription>Join Refrain to start your recovery journey</CardDescription>
              </CardHeader>
              <CardContent className="px-0 pb-0">
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-sm font-medium" htmlFor="name">Full Name</label>
                    <Input id="name" value={formData.name} onChange={handleChange} disabled={isLoading} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium" htmlFor="username">Username</label>
                    <Input id="username" value={formData.username} onChange={handleChange} disabled={isLoading} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium" htmlFor="email">Email</label>
                    <Input id="email" type="email" value={formData.email} onChange={handleChange} disabled={isLoading} />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-sm font-medium" htmlFor="password">Password</label>
                      <Input id="password" type="password" value={formData.password} onChange={handleChange} disabled={isLoading} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium" htmlFor="confirmPassword">Confirm</label>
                      <Input id="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} disabled={isLoading} />
                    </div>
                  </div>

                  {error && (
                    <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md mt-2">
                      {error}
                    </div>
                  )}

                  <Button className="w-full mt-4" type="submit" disabled={isLoading}>
                    {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                    Sign up
                  </Button>
                </form>

                <div className="mt-6 text-center text-sm text-muted-foreground">
                  Already have an account?{' '}
                  <Link to="/login" className="text-primary hover:underline font-medium">
                    Sign in
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
