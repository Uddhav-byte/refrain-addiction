import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Leaf, Loader2, Sparkles, Database } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { api, isSupabaseConfigured } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, loginDemo, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    try {
      const res = await api.auth.login(email, password);
      await login(res);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err?.message || 'Invalid email or password');
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
      <div className="w-full max-w-4xl flex bg-card rounded-2xl shadow-2xl overflow-hidden border border-border min-h-[580px]">
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
              <Sparkles className="w-3.5 h-3.5" /> Adaptive Recovery Platform
            </span>
            <h1 className="text-3xl font-bold leading-tight">
              Transform urges into lasting personal resilience.
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Track your streaks, ride out peak cravings with guided urge surfing, and join a compassionate peer support community.
            </p>
          </motion.div>

          <div className="z-10 text-xs text-muted-foreground flex items-center gap-2">
            {isSupabaseConfigured ? (
              <span className="flex items-center gap-1.5 text-emerald-500 font-medium">
                <Database className="w-3.5 h-3.5" /> Connected to Supabase Auth & DB
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <Database className="w-3.5 h-3.5" /> Supabase Ready • Local Mode Active
              </span>
            )}
          </div>
        </div>

        {/* Right side form */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-8 sm:p-12">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full max-w-sm"
          >
            <div className="md:hidden flex items-center gap-2 mb-6 justify-center">
              <Leaf className="w-8 h-8 text-primary" />
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Refrain
              </span>
            </div>
            
            <Card className="border-0 shadow-none bg-transparent">
              <CardHeader className="px-0 pt-0">
                <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
                <CardDescription>Sign in to continue your streak and check in</CardDescription>
              </CardHeader>
              <CardContent className="px-0 pb-0">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground" htmlFor="email">
                      Email address
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading}
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground" htmlFor="password">
                        Password
                      </label>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                      required
                    />
                  </div>

                  {error && (
                    <div className="text-xs text-destructive bg-destructive/10 border border-destructive/20 p-3 rounded-lg font-medium">
                      {error}
                    </div>
                  )}

                  <Button className="w-full font-semibold" type="submit" disabled={isLoading}>
                    {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                    Sign In
                  </Button>
                </form>

                {/* Quick Demo Button */}
                <div className="mt-4">
                  <div className="relative flex py-2 items-center">
                    <div className="flex-grow border-t border-border"></div>
                    <span className="flex-shrink mx-2 text-xs text-muted-foreground uppercase">or explore</span>
                    <div className="flex-grow border-t border-border"></div>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full gap-2 border-primary/30 text-primary hover:bg-primary/10 font-medium"
                    onClick={handleDemoLogin}
                    disabled={isLoading}
                  >
                    <Sparkles className="w-4 h-4" />
                    1-Click Demo Account
                  </Button>
                </div>

                <div className="mt-6 text-center text-xs text-muted-foreground">
                  Don't have an account?{' '}
                  <Link to="/register" className="text-primary hover:underline font-semibold">
                    Sign up
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
