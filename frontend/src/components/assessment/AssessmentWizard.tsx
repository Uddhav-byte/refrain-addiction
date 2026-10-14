import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { api } from '@/lib/api';
import { AssessmentQuestion } from '@/types';
import { QuestionCard } from './QuestionCard';

interface AssessmentWizardProps {
  onComplete?: (assessment: any) => void;
}

export const AssessmentWizard: React.FC<AssessmentWizardProps> = ({ onComplete }) => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<AssessmentQuestion[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const data = await api.assessments.getQuestions();
        setQuestions(data);
        const initialAnswers: Record<string, number> = {};
        data.forEach(q => {
          const qId = q.id || q.question_id || '';
          if (qId) initialAnswers[qId] = 5;
        });
        setAnswers(initialAnswers);
      } catch (err) {
        toast.error('Failed to load assessment questions.');
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await api.assessments.submitAssessment({ answers });
      toast.success('Assessment completed!');
      if (onComplete) {
        onComplete(res);
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      toast.error('Failed to submit assessment.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  if (!questions.length) {
    return <div className="text-center p-8">No questions found.</div>;
  }

  const progress = ((currentStep + 1) / questions.length) * 100;
  const currentQuestion = questions[currentStep];

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-8 flex flex-col h-full min-h-[600px]">
      <div className="mb-8 space-y-4">
        <div className="flex justify-between text-sm text-muted-foreground font-medium">
          <span>Question {currentStep + 1} of {questions.length}</span>
          <span>{Math.round(progress)}% Completed</span>
        </div>
        <Progress value={progress} className="h-2 w-full" />
      </div>

      <div className="flex-1 relative overflow-hidden flex flex-col justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {currentQuestion && (
              <QuestionCard
                question={currentQuestion}
                value={answers[currentQuestion.id || currentQuestion.question_id || ''] || 5}
                onChange={(val) => {
                  const qId = currentQuestion.id || currentQuestion.question_id || '';
                  if (qId) setAnswers(prev => ({ ...prev, [qId]: val }));
                }}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-12 flex justify-between gap-4">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={currentStep === 0 || submitting}
          className="w-32"
        >
          Back
        </Button>
        {currentStep === questions.length - 1 ? (
          <Button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-32"
          >
            {submitting ? 'Saving...' : 'Submit'}
          </Button>
        ) : (
          <Button
            onClick={handleNext}
            className="w-32"
          >
            Next
          </Button>
        )}
      </div>
    </div>
  );
};
