import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AssessmentWizard } from '@/components/assessment/AssessmentWizard';
import { ResultsView } from '@/components/assessment/ResultsView';
import { api } from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';
import type { Assessment } from '@/types';

export default function AssessmentPage() {
  const [latestAssessment, setLatestAssessment] = useState<Assessment | null>(null);
  const [showWizard, setShowWizard] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAssessment();
  }, []);

  const loadAssessment = async () => {
    try {
      const data = await api.assessments.getLatestAssessment();
      setLatestAssessment(data);
    } catch {
      setShowWizard(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="p-6"
    >
      {showWizard || !latestAssessment ? (
        <AssessmentWizard
          onComplete={(assessment) => {
            setLatestAssessment(assessment);
            setShowWizard(false);
          }}
        />
      ) : (
        <ResultsView
          assessment={latestAssessment}
          onRetake={() => setShowWizard(true)}
        />
      )}
    </motion.div>
  );
}
