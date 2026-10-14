import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api, isSupabaseConfigured } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { Dashboard } from '@/types';
import { MindoDashboard } from './MindoDashboard';
import { StreakCard } from './StreakCard';
import { MoodChart } from './MoodChart';
import { TriggerHeatmap } from './TriggerHeatmap';
import { MilestonesBadges } from './MilestonesBadges';
import { InsightsPanel } from './InsightsPanel';
import { MoodLogModal } from './MoodLogModal';
import { UrgeSurfingModal } from '@/components/urge/UrgeSurfingModal';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import {
  ShieldAlert,
  Database,
  RefreshCw,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Activity
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [data, setData] = useState<Dashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [showMoodModal, setShowMoodModal] = useState(false);
  const [showUrgeSurfing, setShowUrgeSurfing] = useState(false);
  const [showAdvancedMetrics, setShowAdvancedMetrics] = useState(false);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const dashboardData = await api.analytics.getDashboard();
      setData(dashboardData);
    } catch (err) {
      console.error('Error fetching dashboard', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-8 space-y-6 max-w-[1400px] mx-auto min-h-screen">
        <Skeleton className="h-12 w-80 mb-6 rounded-2xl bg-purple-100/60" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <Skeleton className="h-[420px] rounded-[28px] lg:col-span-7 bg-purple-100/40" />
          <Skeleton className="h-[420px] rounded-[28px] lg:col-span-5 bg-purple-100/40" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <Skeleton className="h-64 rounded-[28px] bg-purple-100/40" />
          <Skeleton className="h-64 rounded-[28px] bg-purple-100/40" />
          <Skeleton className="h-64 rounded-[28px] bg-purple-100/40" />
        </div>
      </div>
    );
  }

  const streak = data?.streak || {
    current: data?.streak_days ?? user?.streak_days ?? 14,
    longest: data?.longest_streak ?? user?.longest_streak ?? 28,
    nextMilestone: 30,
  };
  const urgesResisted = data?.stats?.urgesResisted ?? data?.total_urges_resisted ?? 19;
  const daysTracked = data?.stats?.daysTracked ?? data?.total_days_tracked ?? Math.max(1, streak.current);
  const riskLevel = data?.stats?.riskLevel || data?.relapse_risk_level || 'Low';
  const insights = data?.insights || [];
  const badges = data?.badges || data?.current_milestones || [];

  return (
    <div className="min-h-screen bg-[#F2EFFE] text-slate-800 transition-colors">
      {/* Flagship Mindo UI matching reference image */}
      <MindoDashboard
        onOpenUrgeSurfing={() => setShowUrgeSurfing(true)}
        onOpenMoodLog={() => setShowMoodModal(true)}
        onOpenDetailedAnalytics={() => setShowAdvancedMetrics(true)}
      />

      {/* Toggle to view deeper clinical analytics & recovery tools */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 pb-16">
        <div className="flex items-center justify-center pt-2 pb-6">
          <Button
            variant="outline"
            onClick={() => setShowAdvancedMetrics(!showAdvancedMetrics)}
            className="rounded-full px-6 py-2 bg-white/90 border border-purple-200 text-purple-700 hover:bg-purple-50 text-xs sm:text-sm font-semibold shadow-xs gap-2 transition-all"
          >
            <Activity className="w-4 h-4 text-purple-600" />
            {showAdvancedMetrics ? 'Collapse Detailed Clinical History' : 'Expand Detailed Clinical History & Badges'}
            {showAdvancedMetrics ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
        </div>

        <AnimatePresence>
          {showAdvancedMetrics && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
              className="space-y-8 overflow-hidden pt-2"
            >
              {/* Detailed Recovery Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-white/90 rounded-[28px] border border-purple-100 shadow-sm">
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl font-bold text-slate-900">
                      Deep Habit & Relapse Resistance Analysis
                    </h2>
                    {isSupabaseConfigured ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                        <Database className="w-3 h-3" /> Supabase Live
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-700 border border-purple-500/20">
                        <CheckCircle2 className="w-3 h-3" /> Local Mode Active
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Continuous streak tracking, biometric emotion correlations, and trigger frequency logs.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => setShowUrgeSurfing(true)}
                    variant="destructive"
                    size="sm"
                    className="gap-2 rounded-full shadow-sm text-xs"
                  >
                    <ShieldAlert className="w-4 h-4" />
                    Urge Surfing SOS
                  </Button>
                  <Button
                    onClick={fetchDashboard}
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 rounded-full border-purple-200"
                    title="Refresh analytics"
                  >
                    <RefreshCw className="w-4 h-4 text-purple-700" />
                  </Button>
                </div>
              </div>

              {/* Extended Grid */}
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {/* Streak Ring Card */}
                <motion.div variants={itemVariants}>
                  <StreakCard streakData={streak} />
                </motion.div>

                {/* Core Stats Overview */}
                <motion.div variants={itemVariants} className="lg:col-span-2 flex flex-col justify-center space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="bg-white border border-purple-100 rounded-2xl p-5 shadow-xs">
                      <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Urges Resisted</span>
                      <p className="text-3xl font-bold mt-2 text-purple-600">{urgesResisted}</p>
                      <p className="text-xs text-slate-500 mt-1">Craving episodes surfed</p>
                    </div>

                    <div className="bg-white border border-purple-100 rounded-2xl p-5 shadow-xs">
                      <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Days Tracked</span>
                      <p className="text-3xl font-bold mt-2 text-purple-600">{daysTracked}</p>
                      <p className="text-xs text-slate-500 mt-1">Sustained discipline</p>
                    </div>

                    <div className="bg-white border border-purple-100 rounded-2xl p-5 shadow-xs col-span-2 md:col-span-1">
                      <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Relapse Vulnerability</span>
                      <p className={`text-3xl font-bold mt-2 ${riskLevel === 'High' ? 'text-destructive' : riskLevel === 'Moderate' ? 'text-yellow-500' : 'text-emerald-500'}`}>
                        {riskLevel}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">Behavioral assessment score</p>
                    </div>
                  </div>
                </motion.div>

                {/* Mood & Craving History Chart */}
                <motion.div variants={itemVariants} className="lg:col-span-3">
                  <MoodChart />
                </motion.div>

                {/* Trigger Heatmap */}
                <motion.div variants={itemVariants} className="lg:col-span-2">
                  <TriggerHeatmap />
                </motion.div>

                {/* Daily Personalized Insights */}
                <motion.div variants={itemVariants}>
                  <InsightsPanel insights={insights} />
                </motion.div>

                {/* Milestones & Badges */}
                <motion.div variants={itemVariants} className="lg:col-span-3">
                  <MilestonesBadges badges={badges} />
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mood Log Modal */}
      <MoodLogModal
        isOpen={showMoodModal}
        onClose={() => setShowMoodModal(false)}
        onSuccess={fetchDashboard}
      />

      {/* Emergency Urge Surfing Modal */}
      <UrgeSurfingModal
        isOpen={showUrgeSurfing}
        onClose={() => setShowUrgeSurfing(false)}
      />
    </div>
  );
};
