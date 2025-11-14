'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SectionCard } from '@/components/ui/SectionCard';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

interface PredictiveAlertProps {
  stressLevel: number;
  recentTrend: 'increasing' | 'stable' | 'decreasing';
  timeOfDay: number;
  environment: string;
  onDismiss?: () => void;
  onSendAlert?: () => void;
}

export function PredictiveAlert({
  stressLevel,
  recentTrend,
  timeOfDay,
  environment,
  onDismiss,
  onSendAlert
}: PredictiveAlertProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Show predictive alert if:
    // - Stress level is 3+ AND trending up
    // - Stress level is 4+
    // - Multiple high-stress events in short time
    const shouldShow = 
      (stressLevel >= 4) ||
      (stressLevel >= 3 && recentTrend === 'increasing');

    setShow(shouldShow);
  }, [stressLevel, recentTrend]);

  if (!show) return null;

  const riskLevel = stressLevel >= 5 ? 'high' : stressLevel >= 4 ? 'moderate' : 'low';
  const urgency = stressLevel >= 5 ? 'immediate' : stressLevel >= 4 ? 'soon' : 'monitor';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="fixed top-4 right-4 left-4 md:left-auto md:w-96 z-50"
      >
        <SectionCard
          accent={riskLevel === 'high' ? 'rose' : 'amber'}
          className="p-4 shadow-2xl border-2"
        >
          <div className="flex items-start gap-3">
            <div className="text-3xl">
              {riskLevel === 'high' ? '🚨' : '⚠️'}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-sm text-[var(--color-ink)] dark:text-white">
                  Predictive Alert
                </h3>
                {onDismiss && (
                  <button
                    onClick={() => {
                      setShow(false);
                      onDismiss?.();
                    }}
                    className="text-[var(--color-muted)] hover:text-[var(--color-ink)] dark:hover:text-white"
                  >
                    ✕
                  </button>
                )}
              </div>
              <p className="text-xs text-[var(--color-muted)] mb-3">
                Stress escalation detected. Consider proactive intervention.
              </p>
              
              <div className="space-y-2 mb-3">
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-medium text-[var(--color-ink)] dark:text-white">
                    Current Level:
                  </span>
                  <Badge className={riskLevel === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200' : 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-200'}>
                    {stressLevel}/5
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-medium text-[var(--color-ink)] dark:text-white">
                    Trend:
                  </span>
                  <span className="text-[var(--color-muted)] capitalize">{recentTrend}</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-medium text-[var(--color-ink)] dark:text-white">
                    Environment:
                  </span>
                  <span className="text-[var(--color-muted)] capitalize">{environment}</span>
                </div>
              </div>

              <div className="flex gap-2">
                {onSendAlert && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      onSendAlert();
                      setShow(false);
                    }}
                  >
                    Send Alert to Caregiver
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShow(false)}
                >
                  Dismiss
                </Button>
              </div>
            </div>
          </div>
        </SectionCard>
      </motion.div>
    </AnimatePresence>
  );
}

