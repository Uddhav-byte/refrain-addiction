import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { MilestoneBadge } from '@/types';
import { Trophy, Lock } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface MilestonesBadgesProps {
  badges: MilestoneBadge[];
}

export const MilestonesBadges: React.FC<MilestonesBadgesProps> = ({ badges }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold tracking-tight">Milestones & Achievements</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {badges.map((badge, index) => {
          const isEarned = badge.earned;
          const badgeId = badge.id || badge.badge_id || badge.name;
          const earnedDate = badge.earnedDate || badge.earned_at;
          const daysLeft = badge.daysRemaining ?? badge.days_required;
          
          return (
            <motion.div
              key={badgeId}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className={cn(
                "h-full transition-all duration-300",
                isEarned ? "border-yellow-400/50 bg-gradient-to-br from-yellow-500/10 to-transparent shadow-sm" : "bg-muted/30 border-dashed"
              )}>
                <CardContent className="p-6 flex flex-col items-center text-center h-full justify-between gap-4">
                  <div className={cn(
                    "p-4 rounded-full mb-2",
                    isEarned ? "bg-yellow-400 text-yellow-900 shadow-inner" : "bg-muted text-muted-foreground"
                  )}>
                    {isEarned ? <Trophy className="w-8 h-8" /> : <Lock className="w-8 h-8" />}
                  </div>
                  
                  <div>
                    <h4 className={cn("font-bold", isEarned ? "text-foreground" : "text-muted-foreground")}>
                      {badge.name}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1 leading-snug">
                      {badge.description}
                    </p>
                  </div>
                  
                  <div className="text-[10px] uppercase font-bold tracking-wider mt-2">
                    {isEarned ? (
                      <span className="text-green-600 dark:text-green-400">
                        {earnedDate ? `Earned ${formatDate(earnedDate)}` : 'Earned'}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">
                        {daysLeft ? `${daysLeft} Days Left` : 'Locked'}
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
