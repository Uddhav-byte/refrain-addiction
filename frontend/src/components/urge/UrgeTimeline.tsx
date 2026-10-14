import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';
import { UrgeLog } from '@/types';
import { formatDate, cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { CheckCircle2, XCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface UrgeTimelineProps {
  logs?: UrgeLog[];
}

export const UrgeTimeline: React.FC<UrgeTimelineProps> = ({ logs: propLogs }) => {
  const [logs, setLogs] = useState<UrgeLog[]>(propLogs || []);
  const [loading, setLoading] = useState(!propLogs);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (propLogs) {
      setLogs(propLogs);
      setLoading(false);
    }
  }, [propLogs]);

  useEffect(() => {
    if (propLogs) return;
    const fetchLogs = async () => {
      try {
        const data = await api.urges.getUrgeLogs(page);
        if (page === 1) setLogs(data);
        else setLogs(prev => [...prev, ...data]);
      } catch (err) {
        console.error('Failed to load urges');
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, [page, propLogs]);

  const getIntensityColor = (level: number) => {
    if (level < 4) return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
    if (level < 8) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
    return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
  };

  if (loading && page === 1) {
    return (
      <div className="space-y-8 p-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="flex gap-4">
            <Skeleton className="w-12 h-12 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-16 w-full rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <div className="text-center p-12 border-2 border-dashed rounded-xl text-muted-foreground bg-muted/10">
        No urges logged yet. Great job!
      </div>
    );
  }

  return (
    <div className="relative p-4 md:p-8 max-w-3xl mx-auto">
      <div className="absolute left-10 md:left-14 top-8 bottom-8 w-px bg-border z-0" />
      
      <div className="space-y-12">
        {logs.map((log, index) => (
          <motion.div 
            key={log.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative z-10 flex gap-6"
          >
            <div className="flex flex-col items-center mt-1">
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center border-4 border-background shadow-sm",
                log.resisted ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
              )}>
                {log.resisted ? <CheckCircle2 className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
              </div>
            </div>

            <div className="flex-1 bg-card border rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    Urge Intensity: {log.intensity}/10
                    <Badge variant="secondary" className={cn("text-xs", getIntensityColor(log.intensity))}>
                      {log.intensity >= 8 ? 'High' : log.intensity >= 4 ? 'Moderate' : 'Low'}
                    </Badge>
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                    <Clock className="w-3.5 h-3.5" />
                    {formatDate(log.timestamp || log.created_at || new Date().toISOString(), 'MMM d, yyyy - h:mm a')} • {log.durationMinutes ?? log.duration_minutes ?? 0} mins
                  </div>
                </div>
              </div>

              {(log.triggers.length > 0 || log.emotions.length > 0) && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {log.triggers.map(t => (
                    <Badge key={`t-${t}`} variant="outline" className="bg-orange-500/5 text-orange-600 border-orange-500/20">{t}</Badge>
                  ))}
                  {log.emotions.map(e => (
                    <Badge key={`e-${e}`} variant="outline" className="bg-blue-500/5 text-blue-600 border-blue-500/20">{e}</Badge>
                  ))}
                </div>
              )}

              {log.notes && (
                <div className="mt-4 pt-4 border-t border-dashed">
                  <p className="text-sm text-muted-foreground italic">"{log.notes}"</p>
                </div>
              )}
              
              {log.copingStrategyUsed && (
                <div className="mt-3 text-xs bg-muted/50 inline-block px-3 py-1.5 rounded-md text-muted-foreground">
                  <span className="font-semibold text-foreground">Strategy:</span> {log.copingStrategyUsed}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Button variant="outline" onClick={() => setPage(p => p + 1)}>
          Load Older Logs
        </Button>
      </div>
    </div>
  );
};
