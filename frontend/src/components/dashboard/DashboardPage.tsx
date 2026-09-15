import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { Dashboard } from '@/types';
import { StreakCard } from './StreakCard';
import { MoodChart } from './MoodChart';
import { TriggerHeatmap } from './TriggerHeatmap';
import { MilestonesBadges } from './MilestonesBadges';
import { InsightsPanel } from './InsightsPanel';
import { Skeleton } from '@/components/ui/Skeleton';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [data, setData] = useState<Dashboard | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const dashboardData = await api.analytics.getDashboard();
        setData(dashboardData);
      } catch (err) {
        console.error('Error fetching dashboard', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  if (loading) {
    return (
      <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto">
        <Skeleton className="h-10 w-64 mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Skeleton className="h-48 rounded-xl" />
          <Skeleton className="h-48 rounded-xl lg:col-span-2" />
          <Skeleton className="h-96 rounded-xl lg:col-span-3" />
          <Skeleton className="h-80 rounded-xl lg:col-span-2" />
          <Skeleton className="h-80 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!data) return <div className="p-8">Error loading dashboard</div>;

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto min-h-screen">
      <motion.div 
        initial={{ opacity: 0, x: -20 }} 
        animate={{ opacity: 1, x: 0 }} 
        className="mb-8"
      >
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
          Welcome back, {user?.name || 'Explorer'}
        </h1>
        <p className="text-muted-foreground mt-2">Here is your recovery progress overview.</p>
      </motion.div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {/* Top Row */}
        <motion.div variants={itemVariants}>
          <StreakCard streakData={data.streak} />
        </motion.div>
        
        <motion.div variants={itemVariants} className="lg:col-span-2 flex flex-col justify-center space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-card border rounded-xl p-6 shadow-sm">
              <h4 className="text-sm text-muted-foreground font-medium">Total Urges Resisted</h4>
              <p className="text-3xl font-bold mt-2 text-primary">{data.stats.urgesResisted}</p>
            </div>
            <div className="bg-card border rounded-xl p-6 shadow-sm">
              <h4 className="text-sm text-muted-foreground font-medium">Days Tracked</h4>
              <p className="text-3xl font-bold mt-2 text-primary">{data.stats.daysTracked}</p>
            </div>
            <div className="bg-card border rounded-xl p-6 shadow-sm col-span-2 md:col-span-1">
              <h4 className="text-sm text-muted-foreground font-medium">Current Risk Level</h4>
              <p className={`text-3xl font-bold mt-2 ${data.stats.riskLevel === 'High' ? 'text-destructive' : data.stats.riskLevel === 'Moderate' ? 'text-yellow-500' : 'text-green-500'}`}>
                {data.stats.riskLevel}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Middle Row */}
        <motion.div variants={itemVariants} className="lg:col-span-3">
          <MoodChart />
        </motion.div>

        {/* Bottom Row */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <TriggerHeatmap />
        </motion.div>

        <motion.div variants={itemVariants}>
          <InsightsPanel insights={data.insights} />
        </motion.div>

        <motion.div variants={itemVariants} className="lg:col-span-3 mt-6">
          <MilestonesBadges badges={data.badges} />
        </motion.div>
        
      </motion.div>
    </div>
  );
};
