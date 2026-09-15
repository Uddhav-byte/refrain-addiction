import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { DailyInsight } from '@/types';
import { CheckCircle2, Circle, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface InsightsPanelProps {
  insights: DailyInsight[];
}

export const InsightsPanel: React.FC<InsightsPanelProps> = ({ insights }) => {
  const [completed, setCompleted] = useState<Set<string>>(new Set());

  const toggleInsight = (id: string) => {
    setCompleted(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  if (!insights || insights.length === 0) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
            Daily Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-12 text-muted-foreground">
          Take your daily assessment to generate personalized insights and action plans.
        </CardContent>
      </Card>
    );
  }

  // Sort: High priority first, then completed last
  const sortedInsights = [...insights].sort((a, b) => {
    if (completed.has(a.id) !== completed.has(b.id)) {
      return completed.has(a.id) ? 1 : -1;
    }
    const priorityWeight = { high: 3, medium: 2, low: 1 };
    return priorityWeight[b.priority] - priorityWeight[a.priority];
  });

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-yellow-500" />
          Recommended Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto">
        <div className="space-y-3">
          {sortedInsights.map((insight) => {
            const isDone = completed.has(insight.id);
            return (
              <motion.div
                layout
                key={insight.id}
                className={cn(
                  "flex items-start gap-3 p-3 rounded-lg border transition-all cursor-pointer hover:bg-muted/50",
                  isDone ? "opacity-60 bg-muted/30" : "bg-card shadow-sm"
                )}
                onClick={() => toggleInsight(insight.id)}
              >
                <div className="mt-0.5 text-primary">
                  {isDone ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex justify-between items-start gap-2">
                    <h5 className={cn("font-medium text-sm", isDone && "line-through")}>
                      {insight.title}
                    </h5>
                    {!isDone && (
                      <Badge variant={insight.priority === 'high' ? 'destructive' : 'secondary'} className="text-[10px] uppercase px-1.5 py-0">
                        {insight.priority}
                      </Badge>
                    )}
                  </div>
                  <p className={cn("text-xs", isDone ? "text-muted-foreground/70 line-through" : "text-muted-foreground")}>
                    {insight.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
