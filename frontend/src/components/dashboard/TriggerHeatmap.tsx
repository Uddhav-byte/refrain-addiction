import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { api } from '@/lib/api';
import { TriggerHeatmap as HeatmapType } from '@/types';

export const TriggerHeatmap: React.FC = () => {
  const [data, setData] = useState<HeatmapType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.analytics.getTriggerHeatmap();
        setData(res);
      } catch (err) {
        console.error('Failed to load heatmap');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const hours = Array.from({ length: 24 }, (_, i) => i);

  if (loading) {
    return <Skeleton className="w-full h-[400px] rounded-xl" />;
  }

  if (!data || data.grid.length === 0) {
    return (
      <Card>
        <CardHeader><CardTitle>Trigger Activity Heatmap</CardTitle></CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center text-muted-foreground border-2 border-dashed rounded-xl mx-6 mb-6">
          No trigger data available to generate heatmap.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle>Trigger Activity Heatmap</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative overflow-x-auto">
          <div className="min-w-[600px]">
            {/* Header: Days */}
            <div className="flex ml-10 mb-2">
              {days.map((day) => (
                <div key={day} className="flex-1 text-center text-xs text-muted-foreground font-medium">
                  {day}
                </div>
              ))}
            </div>

            {/* Grid */}
            <div className="space-y-1">
              {hours.map((hour) => (
                <div key={hour} className="flex items-center gap-2">
                  <div className="w-8 text-right text-xs text-muted-foreground font-medium">
                    {hour.toString().padStart(2, '0')}
                  </div>
                  <div className="flex-1 flex gap-1">
                    {days.map((_, dayIndex) => {
                      const cell = data.grid.find(c => c.day === dayIndex && c.hour === hour);
                      const count = cell ? cell.count : 0;
                      // Opacity calculation based on count (assuming max is 10 for basic scaling)
                      const opacity = Math.min(count * 0.15 + 0.05, 1);
                      const hasData = count > 0;
                      
                      return (
                        <div
                          key={`${dayIndex}-${hour}`}
                          className="flex-1 aspect-[2/1] rounded-sm transition-colors relative group"
                          style={{
                            backgroundColor: hasData ? `rgba(244, 63, 94, ${opacity})` : 'hsl(var(--muted))',
                          }}
                        >
                          {hasData && (
                            <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity z-10 bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-popover text-popover-foreground text-xs rounded shadow-lg whitespace-nowrap pointer-events-none">
                              {count} trigger{count !== 1 ? 's' : ''}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
