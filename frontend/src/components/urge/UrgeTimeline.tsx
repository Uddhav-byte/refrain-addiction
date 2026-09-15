import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { UrgeLog } from '@/types';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, Clock, Activity, ChevronDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

export default function UrgeTimeline() {
  const [logs, setLogs] = useState<UrgeLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const data = await api.urges.getUrgeLogs();
        setLogs(data);
      } catch (error) {
        console.error('Failed to load logs', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLogs();
  }, []);

  const getIntensityColor = (intensity: number) => {
    if (intensity <= 3) return 'bg-green-100 text-green-800 border-green-200';
    if (intensity <= 7) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };

  if (isLoading) {
    return (
      <div className="space-y-4 max-w-2xl mx-auto p-4">
        {[1,2,3].map(i => <Skeleton key={i} className="h-24 w-full rounded-xl" />)}
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <div className="text-center p-12 text-muted-foreground bg-muted/20 rounded-xl max-w-2xl mx-auto">
        No urge logs yet. Your timeline will appear here.
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4 relative before:absolute before:inset-0 before:ml-5 md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-muted-foreground/20 before:to-transparent">
      <div className="space-y-6">
        {logs.map((log, index) => (
          <motion.div 
            key={log.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
          >
            {/* Timeline Icon */}
            <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-background bg-background shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 absolute left-0 md:left-1/2 -translate-x-1/2 z-10">
              {log.resisted ? (
                <CheckCircle2 className="w-5 h-5 text-green-500" />
              ) : (
                <XCircle className="w-5 h-5 text-red-500" />
              )}
            </div>

            {/* Card */}
            <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] ml-auto md:ml-0 p-4 rounded-xl border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md cursor-pointer"
                 onClick={() => setExpandedId(expandedId === log.id ? null : log.id)}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {format(new Date(log.timestamp), 'MMM d, h:mm a')}
                </span>
                <Badge variant="outline" className={getIntensityColor(log.intensity)}>
                  Intensity: {log.intensity}/10
                </Badge>
              </div>

              <div className="mb-2">
                <h4 className="font-semibold text-sm mb-1 flex items-center justify-between">
                  <span>{log.resisted ? 'Resisted Urge' : 'Gave In'}</span>
                  <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${expandedId === log.id ? 'rotate-180' : ''}`} />
                </h4>
                
                {log.triggers && log.triggers.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {log.triggers.map(t => (
                      <span key={t} className="text-[10px] bg-secondary px-1.5 py-0.5 rounded-sm">{t}</span>
                    ))}
                  </div>
                )}
              </div>

              {expandedId === log.id && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="pt-3 mt-3 border-t text-sm space-y-2 overflow-hidden"
                >
                  {log.emotions && log.emotions.length > 0 && (
                    <div>
                      <span className="text-muted-foreground text-xs block mb-1">Emotions</span>
                      <div className="flex flex-wrap gap-1">
                        {log.emotions.map(e => <span key={e} className="text-xs border px-1.5 rounded">{e}</span>)}
                      </div>
                    </div>
                  )}
                  {log.coping_strategy_used && (
                    <div>
                      <span className="text-muted-foreground text-xs block">Strategy Used</span>
                      <p>{log.coping_strategy_used}</p>
                    </div>
                  )}
                  {log.notes && (
                    <div>
                      <span className="text-muted-foreground text-xs block">Notes</span>
                      <p className="italic">{log.notes}</p>
                    </div>
                  )}
                  <div className="flex items-center gap-1 text-xs text-muted-foreground pt-1">
                    <Activity className="w-3 h-3" /> Duration: {log.duration_minutes || '< 1'} min
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
