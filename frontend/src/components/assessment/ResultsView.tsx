import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip } from 'recharts';
import { AlertCircle, TrendingDown, ShieldAlert, Activity, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { api } from '@/lib/api';
import { Assessment, DailyInsight } from '@/types';
import { cn } from '@/lib/utils';

export const ResultsView: React.FC = () => {
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [insights, setInsights] = useState<DailyInsight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [assData, insData] = await Promise.all([
          api.assessments.getLatestAssessment(),
          api.assessments.getInsights()
        ]);
        setAssessment(assData);
        setInsights(insData);
      } catch (error) {
        console.error('Failed to load results', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="p-8 space-y-8 max-w-4xl mx-auto">
        <Skeleton className="h-[400px] w-full rounded-xl" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }

  if (!assessment) return <div className="p-8 text-center">No assessment data available.</div>;

  const vector = assessment.signals;
  const radarData = [
    { subject: 'Dopamine Sensitivity', A: vector.dopamineSensitivity, fullMark: 100 },
    { subject: 'Stress Rating', A: vector.stressRating, fullMark: 100 },
    { subject: 'Trigger Freq', A: vector.triggerFrequency, fullMark: 100 },
    { subject: 'Relapse Risk', A: vector.relapseRisk, fullMark: 100 }
  ];

  const getRiskColor = (value: number) => {
    if (value < 40) return 'text-green-500 bg-green-500/10 border-green-200';
    if (value < 70) return 'text-yellow-500 bg-yellow-500/10 border-yellow-200';
    return 'text-red-500 bg-red-500/10 border-red-200';
  };

  const getRiskLabel = (value: number) => {
    if (value < 40) return 'Low';
    if (value < 70) return 'Moderate';
    return 'High';
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your Assessment Results</h1>
          <p className="text-muted-foreground mt-1">Based on your recent check-in, here is your behavioral analysis.</p>
        </div>
        <Button onClick={() => navigate('/assessment/take')} className="gap-2">
          <RefreshCw className="w-4 h-4" />
          Retake Assessment
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Behavioral Signal Vector</CardTitle>
            <CardDescription>Multi-dimensional view of your current state</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                <PolarGrid stroke="hsl(var(--muted))" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                <Radar name="Signal" dataKey="A" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.4} />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', borderRadius: '8px', border: '1px solid hsl(var(--border))' }} />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="space-y-4 flex flex-col justify-center">
          <h3 className="text-xl font-semibold mb-2">Signal Breakdown</h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Relapse Risk', val: vector.relapseRisk, icon: ShieldAlert },
              { label: 'Dopamine Sens.', val: vector.dopamineSensitivity, icon: Activity },
              { label: 'Stress Level', val: vector.stressRating, icon: TrendingDown },
              { label: 'Trigger Freq.', val: vector.triggerFrequency, icon: AlertCircle }
            ].map((stat, i) => (
              <Card key={i} className={cn("border", getRiskColor(stat.val))}>
                <CardContent className="p-4 flex flex-col items-start gap-2">
                  <stat.icon className="w-6 h-6 opacity-80" />
                  <div>
                    <p className="text-sm font-medium opacity-80">{stat.label}</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold">{stat.val}</span>
                      <span className="text-xs uppercase font-bold opacity-70 tracking-wider">{getRiskLabel(stat.val)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-4 pt-6 border-t">
        <h2 className="text-2xl font-bold">Actionable Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {insights.map(insight => (
            <Card key={insight.id} className="flex flex-col h-full shadow-sm hover:shadow transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <Badge variant={insight.priority === 'high' ? 'destructive' : insight.priority === 'medium' ? 'default' : 'secondary'} className="mb-2 uppercase text-[10px]">
                    {insight.priority} Priority
                  </Badge>
                </div>
                <CardTitle className="text-lg">{insight.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{insight.description}</p>
              </CardContent>
            </Card>
          ))}
          {insights.length === 0 && (
            <div className="col-span-full p-8 text-center text-muted-foreground border rounded-lg bg-muted/20">
              No specific insights available at the moment.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
