import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { toast } from 'react-hot-toast';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';
import { Check, X } from 'lucide-react';

const TRIGGERS = ['Stress', 'Boredom', 'Social Pressure', 'Emotional Pain', 'Celebration', 'Habit', 'Loneliness', 'Anxiety'];
const EMOTIONS = ['Anxious', 'Stressed', 'Sad', 'Angry', 'Bored', 'Lonely', 'Overwhelmed', 'Hopeful'];

interface UrgeLogFormProps {
  onSuccess?: () => void;
}

export default function UrgeLogForm({ onSuccess }: UrgeLogFormProps) {
  const [intensity, setIntensity] = useState(5);
  const [selectedTriggers, setSelectedTriggers] = useState<string[]>([]);
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
  const [duration, setDuration] = useState('');
  const [copingStrategy, setCopingStrategy] = useState('');
  const [notes, setNotes] = useState('');
  const [resisted, setResisted] = useState<boolean | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleSelection = (item: string, list: string[], setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    if (list.includes(item)) {
      setter(list.filter(i => i !== item));
    } else {
      setter([...list, item]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (resisted === null) {
      toast.error('Please indicate if you resisted the urge');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.urges.logUrge({
        intensity,
        triggers: selectedTriggers,
        emotions: selectedEmotions,
        duration_minutes: parseInt(duration) || 0,
        coping_strategy_used: copingStrategy,
        notes,
        resisted
      });
      toast.success('Urge logged successfully');
      
      // Reset form
      setIntensity(5);
      setSelectedTriggers([]);
      setSelectedEmotions([]);
      setDuration('');
      setCopingStrategy('');
      setNotes('');
      setResisted(null);
      
      if (onSuccess) onSuccess();
    } catch (error) {
      toast.error('Failed to log urge');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Color gradient for intensity slider
  const getSliderColor = (val: number) => {
    if (val <= 3) return 'accent-green-500';
    if (val <= 7) return 'accent-yellow-500';
    return 'accent-red-500';
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-sm">
      <CardHeader>
        <CardTitle>Log an Urge</CardTitle>
        <CardDescription>Tracking your urges helps identify patterns and triggers.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-8">
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium">Intensity (1-10)</label>
              <span className="text-2xl font-bold">{intensity}</span>
            </div>
            <input 
              type="range"
              min="1" max="10"
              value={intensity}
              onChange={(e) => setIntensity(Number(e.target.value))}
              className={cn("w-full h-2 rounded-lg appearance-none cursor-pointer bg-muted", getSliderColor(intensity))}
            />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium">What triggered this urge?</label>
            <div className="flex flex-wrap gap-2">
              {TRIGGERS.map(t => (
                <Badge
                  key={t}
                  variant={selectedTriggers.includes(t) ? "default" : "outline"}
                  className="cursor-pointer hover:bg-primary/80 transition-colors"
                  onClick={() => toggleSelection(t, selectedTriggers, setSelectedTriggers)}
                >
                  {t}
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium">What emotions are you feeling?</label>
            <div className="flex flex-wrap gap-2">
              {EMOTIONS.map(e => (
                <Badge
                  key={e}
                  variant={selectedEmotions.includes(e) ? "secondary" : "outline"}
                  className="cursor-pointer transition-colors"
                  onClick={() => toggleSelection(e, selectedEmotions, setSelectedEmotions)}
                >
                  {e}
                </Badge>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Duration (minutes)</label>
              <Input 
                type="number" 
                placeholder="e.g., 15" 
                value={duration} 
                onChange={(e) => setDuration(e.target.value)} 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Coping Strategy Used</label>
              <Input 
                type="text" 
                placeholder="e.g., Deep breathing" 
                value={copingStrategy} 
                onChange={(e) => setCopingStrategy(e.target.value)} 
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Notes (optional)</label>
            <textarea 
              className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Any other thoughts..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div className="pt-4 border-t space-y-4">
            <label className="text-base font-semibold text-center block">Did you resist the urge?</label>
            <div className="grid grid-cols-2 gap-4">
              <Button 
                type="button"
                variant={resisted === true ? "default" : "outline"}
                className={cn("h-16 text-lg", resisted === true && "bg-green-600 hover:bg-green-700")}
                onClick={() => setResisted(true)}
              >
                <Check className="w-5 h-5 mr-2" /> Yes, I resisted
              </Button>
              <Button 
                type="button"
                variant={resisted === false ? "destructive" : "outline"}
                className={cn("h-16 text-lg", resisted === false && "bg-red-600 hover:bg-red-700")}
                onClick={() => setResisted(false)}
              >
                <X className="w-5 h-5 mr-2" /> No, I gave in
              </Button>
            </div>
          </div>

        </CardContent>
        <CardFooter className="bg-muted/30 pt-6">
          <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Log Entry'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
