import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { api } from '@/lib/api';
import type { UrgeLog } from '@/types';

const COMMON_TRIGGERS = ['Stress', 'Boredom', 'Social Pressure', 'Emotional Pain', 'Celebration', 'Habit/Routine', 'Loneliness', 'Anxiety'];
const COMMON_EMOTIONS = ['Anxious', 'Stressed', 'Sad', 'Angry', 'Bored', 'Lonely', 'Overwhelmed', 'Hopeful'];

interface UrgeLogFormProps {
  onSuccess?: (log?: UrgeLog) => void;
  defaultDuration?: number;
}

export const UrgeLogForm: React.FC<UrgeLogFormProps> = ({ onSuccess, defaultDuration = 5 }) => {
  const [intensity, setIntensity] = useState(5);
  const [triggers, setTriggers] = useState<string[]>([]);
  const [emotions, setEmotions] = useState<string[]>([]);
  const [copingStrategy, setCopingStrategy] = useState('');
  const [duration, setDuration] = useState(defaultDuration);
  const [notes, setNotes] = useState('');
  const [resisted, setResisted] = useState(true);
  const [loading, setLoading] = useState(false);

  const toggleItem = (list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>, item: string) => {
    if (list.includes(item)) {
      setList(list.filter(i => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.urges.logUrge({
        intensity,
        triggers,
        emotions,
        copingStrategyUsed: copingStrategy,
        durationMinutes: duration,
        notes,
        resisted,
        timestamp: new Date().toISOString()
      });
      toast.success('Urge logged successfully');
      if (onSuccess) onSuccess(res);
    } catch (err) {
      toast.error('Failed to log urge');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-3">
        <label className="text-sm font-medium">Intensity ({intensity}/10)</label>
        <input
          type="range"
          min="1"
          max="10"
          value={intensity}
          onChange={(e) => setIntensity(Number(e.target.value))}
          className="w-full h-2 rounded-lg appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, #22c55e, #eab308, #ef4444)`
          }}
        />
      </div>

      <div className="space-y-3">
        <label className="text-sm font-medium">Triggers</label>
        <div className="flex flex-wrap gap-2">
          {COMMON_TRIGGERS.map(t => (
            <button
              key={t}
              type="button"
              onClick={() => toggleItem(triggers, setTriggers, t)}
              className={`px-3 py-1 text-xs rounded-full border transition-colors ${triggers.includes(t) ? 'bg-primary text-primary-foreground border-primary' : 'bg-background hover:bg-muted'}`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-sm font-medium">Emotions</label>
        <div className="flex flex-wrap gap-2">
          {COMMON_EMOTIONS.map(e => (
            <button
              key={e}
              type="button"
              onClick={() => toggleItem(emotions, setEmotions, e)}
              className={`px-3 py-1 text-xs rounded-full border transition-colors ${emotions.includes(e) ? 'bg-primary text-primary-foreground border-primary' : 'bg-background hover:bg-muted'}`}
            >
              {e}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Duration (mins)</label>
          <Input type="number" min="1" value={duration} onChange={(e) => setDuration(Number(e.target.value))} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Strategy Used</label>
          <Input placeholder="e.g. Deep breathing" value={copingStrategy} onChange={(e) => setCopingStrategy(e.target.value)} />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Notes (optional)</label>
        <textarea
          className="w-full flex min-h-[80px] rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="What was happening right before the urge?"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      <div className="p-4 bg-muted/30 rounded-xl border flex items-center justify-between">
        <div>
          <h4 className="font-semibold text-lg">Did you resist the urge?</h4>
          <p className="text-sm text-muted-foreground">Be honest, this is for your own tracking.</p>
        </div>
        <button
          type="button"
          onClick={() => setResisted(!resisted)}
          className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${resisted ? 'bg-green-500' : 'bg-red-500'}`}
        >
          <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${resisted ? 'translate-x-7' : 'translate-x-1'}`} />
        </button>
      </div>

      <Button type="submit" className="w-full py-6 text-lg" disabled={loading}>
        {loading ? 'Saving...' : 'Save Log'}
      </Button>
    </form>
  );
};
