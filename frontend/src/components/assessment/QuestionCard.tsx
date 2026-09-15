import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { AssessmentQuestion } from '@/types';

interface QuestionCardProps {
  question: AssessmentQuestion;
  value: number;
  onChange: (value: number) => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({ question, value, onChange }) => {
  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'triggers': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'severity': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'emotional': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'relapse_risk': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  return (
    <Card className="w-full shadow-lg border-muted">
      <CardHeader className="space-y-4">
        <div className="flex justify-between items-center">
          <Badge className={getCategoryColor(question.category)} variant="secondary">
            {question.category.replace('_', ' ').toUpperCase()}
          </Badge>
        </div>
        <CardTitle className="text-2xl md:text-3xl font-semibold leading-tight">
          {question.text}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-8 pb-12">
        <div className="space-y-12">
          <motion.div 
            className="text-center font-bold text-5xl text-primary"
            key={value}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            {value}
          </motion.div>
          
          <div className="relative pt-1">
            <input
              type="range"
              min={1}
              max={10}
              step={1}
              value={value}
              onChange={(e) => onChange(Number(e.target.value))}
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
              aria-label="Rating scale from 1 to 10"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-4 font-medium px-1">
              <span>1 - Minimum</span>
              <span>10 - Maximum</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
