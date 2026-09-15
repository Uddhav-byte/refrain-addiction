import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { UrgeLogForm } from '@/components/urge/UrgeLogForm';
import { UrgeTimeline } from '@/components/urge/UrgeTimeline';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/lib/api';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import type { UrgeLog, UrgeTrend } from '@/types';

export default function UrgeLogPage() {
  const [logs, setLogs] = useState<UrgeLog[]>([]);
  const [trends, setTrends] = useState<UrgeTrend | null>(null);
  const [trendPeriod, setTrendPeriod] = useState('30d');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    loadTrends();
  }, [trendPeriod]);

  const loadData = async () => {
    try {
      const [logsData, trendsData] = await Promise.all([
        api.urges.getUrgeLogs(),
        api.urges.getUrgeTrends('30d'),
      ]);
      setLogs(logsData);
      setTrends(trendsData);
    } catch (err) {
      console.error('Failed to load urge data:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadTrends = async () => {
    try {
      const data = await api.urges.getUrgeTrends(trendPeriod);
      setTrends(data);
    } catch (err) {
      console.error('Failed to load trends:', err);
    }
  };

  const handleUrgeLogged = (newLog: UrgeLog) => {
    setLogs((prev) => [newLog, ...prev]);
    loadTrends();
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-96" />
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="p-6 space-y-6"
    >
      <h1 className="text-2xl font-bold">Urge Log</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Log Form */}
        <Card>
          <CardHeader>
            <CardTitle>Log an Urge</CardTitle>
          </CardHeader>
          <CardContent>
            <UrgeLogForm onSuccess={handleUrgeLogged} />
          </CardContent>
        </Card>

        {/* Trends Chart */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Intensity Trends</CardTitle>
            <div className="flex gap-1">
              {['7d', '30d', '90d'].map((p) => (
                <button
                  key={p}
                  onClick={() => setTrendPeriod(p)}
                  className={`px-3 py-1 text-xs rounded-full transition-colors ${
                    trendPeriod === p
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              {trends && trends.data_points && trends.data_points.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trends.data_points}>
                    <defs>
                      <linearGradient id="urgeGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(0, 84%, 60%)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(0, 84%, 60%)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                    <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} domain={[0, 10]} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '0.5rem',
                        color: 'hsl(var(--card-foreground))',
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="avg_intensity"
                      stroke="hsl(0, 84%, 60%)"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#urgeGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  No trend data yet. Start logging urges to see patterns.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Urge History</CardTitle>
        </CardHeader>
        <CardContent>
          <UrgeTimeline logs={logs} />
        </CardContent>
      </Card>
    </motion.div>
  );
}
