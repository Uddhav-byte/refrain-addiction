import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  Shield,
  Heart,
  MessageCircle,
  BarChart3,
  ArrowRight,
  Sparkles,
  Users,
  Brain,
  Leaf,
  Database,
  PlayCircle
} from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { isSupabaseConfigured } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 260, damping: 20 },
  },
};

const features = [
  {
    icon: Brain,
    title: 'Adaptive Assessment Engine',
    description:
      'Personalized behavioral evaluation measuring triggers, dopamine sensitivity, and relapse risk with adaptive guidance.',
    color: 'text-purple-400',
    bg: 'bg-purple-400/10',
  },
  {
    icon: BarChart3,
    title: 'Progress & Mood Analytics',
    description:
      'Track continuous streaks, daily mood & craving trends, trigger heatmaps, and unlock milestone achievement badges.',
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/10',
  },
  {
    icon: MessageCircle,
    title: 'Real-Time Peer Support',
    description:
      'Live community rooms with Supabase Realtime messaging. Share victories, encourage peers, and never feel isolated.',
    color: 'text-blue-400',
    bg: 'bg-blue-400/10',
  },
  {
    icon: Shield,
    title: 'Urge Surfing SOS Station',
    description:
      'Guided 4-7-8 breathing timer and community check-in system designed to ride out intense cravings until they subside.',
    color: 'text-amber-400',
    bg: 'bg-amber-400/10',
  },
];

export default function Landing() {
  const { isAuthenticated, user, loginDemo, logout } = useAuth();
  const navigate = useNavigate();

  const handleDemoLaunch = async () => {
    await loginDemo();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5 pointer-events-none" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

        <nav className="relative z-10 flex items-center justify-between px-6 py-5 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2.5"
          >
            <Leaf className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Refrain
            </span>
            {isSupabaseConfigured && (
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 font-medium border border-emerald-500/20">
                <Database className="w-3 h-3" /> Supabase DB
              </span>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            {isAuthenticated ? (
              <>
                <Link to="/dashboard">
                  <Button size="sm" className="gap-2 font-medium">
                    Dashboard
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={logout}>
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" onClick={handleDemoLaunch} className="hidden sm:inline-flex gap-1.5 text-primary">
                  <PlayCircle className="w-4 h-4" />
                  Demo Mode
                </Button>
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">
                    Get Started
                    <ArrowRight className="ml-1.5 h-4 w-4" />
                  </Button>
                </Link>
              </>
            )}
          </motion.div>
        </nav>

        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-28">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center max-w-3xl mx-auto"
          >
            <motion.div variants={itemVariants} className="mb-6">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20">
                <Sparkles className="h-4 w-4" />
                Adaptive Addiction Recovery & Habit Transformation
              </span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-5xl md:text-7xl font-bold tracking-tight mb-6"
            >
              Your journey to{' '}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                freedom
              </span>{' '}
              starts here
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              Refrain empowers you to deconstruct addictive urges, track resilient streaks, and regulate craving spikes with guided urge surfing and real-time peer support.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              {isAuthenticated ? (
                <Link to="/dashboard">
                  <Button size="lg" className="text-base px-8 py-6 gap-2">
                    Open Your Recovery Dashboard ({user?.full_name || user?.username})
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/register">
                    <Button size="lg" className="text-base px-8 py-6">
                      Start Your Recovery
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="lg"
                    className="text-base px-8 py-6 gap-2 border-primary/30 text-primary hover:bg-primary/10"
                    onClick={handleDemoLaunch}
                  >
                    <Sparkles className="h-5 w-5" />
                    Try 1-Click Demo
                  </Button>
                </>
              )}
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground"
            >
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                <span>10k+ Community Check-Ins</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-rose-500" />
                <span>Compassionate & Non-Judgmental</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-emerald-500" />
                <span>100% Private (Supabase RLS)</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything you need to{' '}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">transform</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            A comprehensive, clinically inspired toolkit built with modern web technologies.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {features.map((feature) => (
            <motion.div key={feature.title} variants={itemVariants}>
              <Card className="h-full hover:shadow-xl transition-all duration-300 border-border/60 hover:border-primary/40">
                <CardContent className="p-8">
                  <div
                    className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${feature.bg} mb-4`}
                  >
                    <feature.icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center bg-gradient-to-br from-primary/15 via-card to-accent/15 rounded-3xl p-12 md:p-16 border border-border shadow-2xl"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to reclaim your freedom?
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
            Urges last an average of 15-20 minutes. With the right tools and peer accountability, you can overcome every craving wave.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to={isAuthenticated ? "/dashboard" : "/register"}>
              <Button size="lg" className="text-base px-8 py-6 font-semibold">
                {isAuthenticated ? "Go to Dashboard" : "Begin Your Recovery"}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-6 bg-card/40">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Leaf className="h-5 w-5 text-primary" />
            <span className="font-bold">Refrain</span>
            <span className="text-xs text-muted-foreground ml-2">Adaptive Recovery Platform</span>
          </div>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Refrain. Built for real human healing and recovery.
          </p>
        </div>
      </footer>
    </div>
  );
}
