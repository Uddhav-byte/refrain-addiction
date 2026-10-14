import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Leaf, Loader2, Sparkles, Database } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { api, isSupabaseConfigured } from '@/lib/api';
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
  const { register, loginDemo, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

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
      const res = await api.auth.register(formData.email, formData.username, formData.password, formData.name);
      await register(res);
      // Take new user to behavioral assessment onboarding
      navigate('/assessment');
    } catch (err: any) {
      setError(err?.message || 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setIsLoading(true);
    try {
      await loginDemo();
      navigate('/dashboard');
    } catch (err: any) {
      setError('Failed to start demo session');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/40 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl flex bg-card rounded-2xl shadow-2xl overflow-hidden border border-border min-h-[620px]">
        {/* Left side visual */}
        <div className="hidden md:flex flex-col justify-between w-1/2 p-10 bg-primary/5 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/15 via-transparent to-accent/10 pointer-events-none" />
          
          <div className="flex items-center gap-2 z-10">
            <Leaf className="w-8 h-8 text-primary" />
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Refrain
            </span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="z-10 my-auto text-left space-y-4"
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary">
              <Sparkles className="w-3.5 h-3.5" /> Start Your Recovery Today
            </span>
            <h1 className="text-3xl font-bold leading-tight">
              A private, supportive haven for your recovery journey.
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your data belongs strictly to you. With Supabase Row Level Security, your habit logs, assessments, and progress are 100% private.
            </p>
          </motion.div>

          <div className="z-10 text-xs text-muted-foreground flex items-center gap-2">
            {isSupabaseConfigured ? (
              <span className="flex items-center gap-1.5 text-emerald-500 font-medium">
                <Database className="w-3.5 h-3.5" /> Supabase PostgreSQL Enabled
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <Database className="w-3.5 h-3.5" /> Supabase Ready • Local Mode Active
              </span>
            )}
          </div>
        </div>

        {/* Right side form */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-8 sm:p-10">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full max-w-sm"
          >
            <div className="md:hidden flex items-center gap-2 mb-4 justify-center">
              <Leaf className="w-8 h-8 text-primary" />
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Refrain
              </span>
            </div>
            
            <Card className="border-0 shadow-none bg-transparent">
              <CardHeader className="px-0 pt-0 pb-4">
                <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
                <CardDescription>Join Refrain to start your personalized transformation</CardDescription>
              </CardHeader>
              <CardContent className="px-0 pb-0">
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground" htmlFor="name">
                      Full Name
                    </label>
                    <Input id="name" placeholder="Alex Rivera" value={formData.name} onChange={handleChange} disabled={isLoading} required />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground" htmlFor="username">
                      Username
                    </label>
                    <Input id="username" placeholder="alex_r" value={formData.username} onChange={handleChange} disabled={isLoading} required />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground" htmlFor="email">
                      Email address
                    </label>
                    <Input id="email" type="email" placeholder="alex@example.com" value={formData.email} onChange={handleChange} disabled={isLoading} required />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground" htmlFor="password">
                        Password
                      </label>
                      <Input id="password" type="password" placeholder="••••••••" value={formData.password} onChange={handleChange} disabled={isLoading} required />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground" htmlFor="confirmPassword">
                        Confirm
                      </label>
                      <Input id="confirmPassword" type="password" placeholder="••••••••" value={formData.confirmPassword} onChange={handleChange} disabled={isLoading} required />
                    </div>
                  </div>

                  {error && (
                    <div className="text-xs text-destructive bg-destructive/10 border border-destructive/20 p-2.5 rounded-lg font-medium mt-2">
                      {error}
                    </div>
                  )}

                  <Button className="w-full font-semibold mt-3" type="submit" disabled={isLoading}>
                    {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                    Create Account & Begin
                  </Button>
                </form>

                {/* Quick Demo */}
                <div className="mt-3">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="w-full gap-2 text-xs text-primary hover:bg-primary/10"
                    onClick={handleDemoLogin}
                    disabled={isLoading}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Or explore immediately with Demo Account
                  </Button>
                </div>

                <div className="mt-4 text-center text-xs text-muted-foreground">
                  Already have an account?{' '}
                  <Link to="/login" className="text-primary hover:underline font-semibold">
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
