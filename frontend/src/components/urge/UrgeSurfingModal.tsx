import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';
import { useWebSocket } from '@/hooks/useWebSocket';

interface UrgeSurfingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogUrge: () => void;
}

export default function UrgeSurfingModal({ isOpen, onClose, onLogUrge }: UrgeSurfingModalProps) {
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [timeElapsed, setTimeElapsed] = useState(0);
  
  // Dummy room ID for community broadcast
  const { sendMessage, onlineCount } = useWebSocket('general', () => {});

  useEffect(() => {
    if (!isOpen) return;

    const phaseSequence = () => {
      setPhase('inhale');
      setTimeout(() => {
        setPhase('hold');
        setTimeout(() => {
          setPhase('exhale');
        }, 4000);
      }, 4000);
    };

    phaseSequence();
    const cycle = setInterval(phaseSequence, 12000);
    
    const timer = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);

    return () => {
      clearInterval(cycle);
      clearInterval(timer);
      setTimeElapsed(0);
    };
  }, [isOpen]);

  const handleBroadcastHelp = () => {
    sendMessage(JSON.stringify({ type: 'urge_checkin', text: 'I am experiencing a strong urge right now and trying to surf it.' }));
    toast.success('Check-in sent to community. They are with you.');
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      onLogUrge();
    }, 300); // Wait for unmount animation
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/95 overflow-hidden"
        >
          {/* Animated Background Gradient */}
          <motion.div 
            animate={{ 
              background: [
                'radial-gradient(circle at center, rgba(14, 165, 233, 0.15) 0%, transparent 70%)',
                'radial-gradient(circle at center, rgba(16, 185, 129, 0.15) 0%, transparent 70%)',
                'radial-gradient(circle at center, rgba(139, 92, 246, 0.15) 0%, transparent 70%)'
              ]
            }}
            transition={{ duration: 10, repeat: Infinity, repeatType: 'mirror' }}
            className="absolute inset-0 z-0"
          />

          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute top-6 right-6 z-50 text-white hover:bg-white/10 rounded-full"
            onClick={handleClose}
          >
            <X className="w-6 h-6" />
          </Button>

          <div className="z-10 flex flex-col items-center space-y-12 w-full max-w-md px-6">
            <h2 className="text-2xl font-medium text-slate-200">Urge Surfing</h2>
            
            <div className="relative w-64 h-64 flex items-center justify-center">
              {/* Breathing Circle */}
              <motion.div
                animate={{
                  scale: phase === 'inhale' ? 1 : phase === 'hold' ? 1 : 0.4,
                  opacity: phase === 'hold' ? 0.8 : 0.4,
                }}
                transition={{
                  duration: 4,
                  ease: "easeInOut"
                }}
                className="absolute w-full h-full bg-teal-500 rounded-full blur-xl"
              />
              <motion.div
                animate={{
                  scale: phase === 'inhale' ? 1 : phase === 'hold' ? 1 : 0.4,
                }}
                transition={{
                  duration: 4,
                  ease: "easeInOut"
                }}
                className="absolute w-4/5 h-4/5 bg-teal-400 rounded-full shadow-[0_0_40px_rgba(45,212,191,0.5)] flex items-center justify-center"
              >
                <span className="text-2xl font-semibold text-teal-950 capitalize">
                  {phase === 'inhale' ? 'Breathe In' : phase === 'hold' ? 'Hold' : 'Breathe Out'}
                </span>
              </motion.div>
            </div>

            <div className="text-4xl font-mono text-slate-300 tracking-wider font-light">
              {formatTime(timeElapsed)}
            </div>

            <div className="w-full pt-8 space-y-4">
              <Button 
                variant="outline" 
                size="lg" 
                className="w-full py-6 bg-slate-900/50 border-slate-700 text-slate-200 hover:bg-slate-800 hover:text-white group"
                onClick={handleBroadcastHelp}
              >
                <ShieldAlert className="w-5 h-5 mr-2 text-orange-400 group-hover:text-orange-300" />
                I'm struggling right now
              </Button>
              <p className="text-center text-xs text-slate-500">
                {onlineCount} community members are online
              </p>
            </div>
            
            <p className="text-sm text-slate-400 text-center max-w-xs mt-8">
              "Urges are like ocean waves. They build, peak, and eventually break. You can surf them."
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
