import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldAlert, Sparkles, Volume2, VolumeX, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UrgeLogForm } from './UrgeLogForm';
import confetti from 'canvas-confetti';
import { toast } from 'react-hot-toast';

interface UrgeSurfingModalProps {
  isOpen?: boolean;
  onClose: () => void;
}

const MINDFUL_MANTRAS = [
  "Cravings are like ocean waves — they peak and break. You are surfing the wave.",
  "Notice where you feel the sensation in your body without judging it.",
  "The urge will pass whether you act on it or not. Give yourself this moment.",
  "You have surfed hard urges before. Every second you hold on builds mental muscle.",
  "Inhale peace, exhale tension. You are in complete control of your choice.",
];

export const UrgeSurfingModal: React.FC<UrgeSurfingModalProps> = ({ isOpen = true, onClose }) => {
  // Phase for 4-7-8 breathing
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [secondsInPhase, setSecondsInPhase] = useState(4);
  const [elapsed, setElapsed] = useState(0);
  const [showLogForm, setShowLogForm] = useState(false);
  const [mantraIndex, setMantraIndex] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(false);

  useEffect(() => {
    if (!isOpen || showLogForm) return;

    // Elapsed timer
    const timerInterval = setInterval(() => {
      setElapsed((p) => p + 1);
    }, 1000);

    // Mantra rotator every 16 seconds
    const mantraInterval = setInterval(() => {
      setMantraIndex((prev) => (prev + 1) % MINDFUL_MANTRAS.length);
    }, 16000);

    return () => {
      clearInterval(timerInterval);
      clearInterval(mantraInterval);
    };
  }, [isOpen, showLogForm]);

  // Breathing cycle: 4s inhale, 4s hold, 4s exhale
  useEffect(() => {
    if (!isOpen || showLogForm) return;

    let currentPhase: 'inhale' | 'hold' | 'exhale' = 'inhale';
    setPhase('inhale');
    setSecondsInPhase(4);

    const interval = setInterval(() => {
      setSecondsInPhase((prev) => {
        if (prev > 1) return prev - 1;

        if (currentPhase === 'inhale') {
          currentPhase = 'hold';
          setPhase('hold');
          return 4;
        } else if (currentPhase === 'hold') {
          currentPhase = 'exhale';
          setPhase('exhale');
          return 6;
        } else {
          currentPhase = 'inhale';
          setPhase('inhale');
          return 4;
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, showLogForm]);

  const handleSurfedSuccess = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
    toast.success('Incredible victory! You rode out the wave.');
    setTimeout(() => {
      setShowLogForm(true);
    }, 1200);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 overflow-hidden"
      >
        {/* Soothing animated gradient background */}
        <motion.div
          animate={{
            backgroundColor: [
              '#090d16',
              '#0f172a',
              '#06202a',
              '#090d16',
            ],
          }}
          transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-0 z-0"
        />

        {/* Top Controls */}
        <div className="absolute top-6 right-6 z-20 flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="text-white/70 hover:text-white hover:bg-white/10 rounded-full"
            title={soundEnabled ? "Mute audio" : "Enable calming chimes"}
          >
            {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-white/70 hover:text-white hover:bg-white/10 rounded-full"
            aria-label="Exit Urge Surfing"
          >
            <X className="w-6 h-6" />
          </Button>
        </div>

        <div className="relative z-10 w-full max-w-lg mx-auto flex flex-col items-center text-center">
          {!showLogForm ? (
            <>
              {/* Badge & Timer */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-emerald-300 text-xs font-semibold tracking-widest uppercase mb-8 border border-white/10">
                <ShieldAlert className="w-4 h-4 text-emerald-400" />
                Urge Surfing Station • {formatTime(elapsed)}
              </div>

              {/* Breathing Circle Visualization */}
              <div className="relative w-64 h-64 my-6 flex items-center justify-center">
                {/* Outer Glow Ring */}
                <motion.div
                  animate={{
                    scale: phase === 'inhale' ? 1.35 : phase === 'hold' ? 1.35 : 0.9,
                    opacity: phase === 'inhale' ? 0.6 : phase === 'hold' ? 0.8 : 0.3,
                  }}
                  transition={{ duration: phase === 'inhale' ? 4 : phase === 'hold' ? 0.5 : 6, ease: 'easeInOut' }}
                  className="absolute inset-0 rounded-full bg-gradient-to-tr from-emerald-500/30 via-teal-500/20 to-sky-500/30 blur-2xl pointer-events-none"
                />

                {/* Primary Breathing Orb */}
                <motion.div
                  animate={{
                    scale: phase === 'inhale' ? 1.25 : phase === 'hold' ? 1.25 : 0.85,
                    borderColor: phase === 'inhale' ? '#10b981' : phase === 'hold' ? '#38bdf8' : '#64748b',
                  }}
                  transition={{ duration: phase === 'inhale' ? 4 : phase === 'hold' ? 0.5 : 6, ease: 'easeInOut' }}
                  className="w-48 h-48 rounded-full border-4 flex flex-col items-center justify-center bg-card/40 backdrop-blur-md shadow-2xl relative z-10"
                >
                  <span className="text-3xl font-extrabold uppercase tracking-widest text-white mb-1">
                    {phase}
                  </span>
                  <span className="text-sm font-medium text-white/70">
                    {secondsInPhase}s
                  </span>
                </motion.div>
              </div>

              {/* Mindful Guidance Mantra */}
              <motion.p
                key={mantraIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-sm md:text-base text-white/80 max-w-sm px-4 min-h-[50px] mb-8 font-medium leading-relaxed"
              >
                "{MINDFUL_MANTRAS[mantraIndex]}"
              </motion.p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 w-full px-6">
                <Button
                  onClick={handleSurfedSuccess}
                  className="flex-1 py-6 bg-emerald-600 hover:bg-emerald-500 text-white font-bold gap-2 text-base shadow-lg shadow-emerald-950/50"
                >
                  <CheckCircle className="w-5 h-5" />
                  I Surfed the Urge!
                </Button>

                <Button
                  variant="outline"
                  onClick={() => setShowLogForm(true)}
                  className="py-6 border-white/20 text-white hover:bg-white/10 font-medium text-sm"
                >
                  Log Details
                </Button>
              </div>
            </>
          ) : (
            /* Post-Surfing Log Form */
            <div className="w-full bg-card text-foreground rounded-2xl p-6 shadow-2xl border border-border text-left">
              <div className="flex items-center justify-between pb-4 border-b border-border mb-4">
                <div>
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" /> Log This Craving Episode
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    You surfed for {Math.max(1, Math.round(elapsed / 60))} minute(s). Save your record.
                  </p>
                </div>
                <Button variant="ghost" size="sm" onClick={onClose}>
                  Done
                </Button>
              </div>

              <UrgeLogForm
                defaultDuration={Math.max(1, Math.round(elapsed / 60))}
                onSuccess={() => {
                  toast.success('Urge logged to your streak record!');
                  onClose();
                }}
              />
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
