import React, { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/Card';
import { cn } from '@/lib/utils';

interface StreakCardProps {
  streakData: {
    current: number;
    longest: number;
    nextMilestone: number;
  };
}

export const StreakCard: React.FC<StreakCardProps> = ({ streakData }) => {
  const [count, setCount] = useState(0);
  const controls = useAnimation();

  const progress = Math.min((streakData.current / streakData.nextMilestone) * 100, 100);
  const circumference = 2 * Math.PI * 45; // r=45
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  useEffect(() => {
    let start = 0;
    const end = streakData.current;
    if (start === end) return;
    
    const duration = 1500;
    const incrementTime = (duration / end);

    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start === end) clearInterval(timer);
    }, incrementTime);

    return () => clearInterval(timer);
  }, [streakData.current]);

  useEffect(() => {
    controls.start({
      strokeDashoffset,
      transition: { duration: 1.5, ease: "easeOut" }
    });
  }, [strokeDashoffset, controls]);

  const isActive = streakData.current > 0;

  return (
    <Card className="h-full relative overflow-hidden flex flex-col justify-center items-center p-6 text-center border-2 border-primary/10">
      <CardContent className="p-0 flex flex-col items-center w-full">
        <h3 className="font-semibold text-lg mb-6 text-muted-foreground w-full text-left">Current Streak</h3>
        
        <div className="relative w-40 h-40 flex items-center justify-center">
          <svg className="absolute inset-0 w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="transparent"
              stroke="currentColor"
              strokeWidth="6"
              className="text-muted opacity-20"
            />
            <motion.circle
              cx="50"
              cy="50"
              r="45"
              fill="transparent"
              stroke="currentColor"
              strokeWidth="6"
              strokeLinecap="round"
              className={cn("transition-colors duration-300", isActive ? "text-orange-500" : "text-muted-foreground")}
              initial={{ strokeDashoffset: circumference }}
              animate={controls}
              style={{ strokeDasharray: circumference }}
            />
          </svg>
          
          <div className="flex flex-col items-center justify-center relative z-10">
            <motion.div
              animate={isActive ? { scale: [1, 1.1, 1] } : {}}
              transition={{ repeat: Infinity, duration: 2 }}
              className="text-4xl mb-1"
            >
              🔥
            </motion.div>
            <span className={cn("text-4xl font-bold tracking-tighter", isActive ? "text-foreground" : "text-muted-foreground")}>
              {count}
            </span>
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider mt-1">Days</span>
          </div>
        </div>

        <div className="mt-8 flex w-full justify-between items-center text-sm bg-muted/50 p-3 rounded-lg">
          <span className="text-muted-foreground">Longest Streak</span>
          <span className="font-bold text-foreground">{streakData.longest} days</span>
        </div>
      </CardContent>
    </Card>
  );
};
