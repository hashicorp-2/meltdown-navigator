'use client';

import { useState, useEffect } from 'react';
import { SectionCard } from '@/components/ui/SectionCard';
import { Badge } from '@/components/ui/Badge';
import { motion } from 'framer-motion';
import { StressPatternAnalysis } from '@/components/StressPatternAnalysis';

export interface StressEvent {
  id: string;
  timestamp: Date;
  stressLevel: number;
  message: string;
  translatedMessage?: string;
  environment?: string;
}

export function CaregiverDashboard() {
  const [events, setEvents] = useState<StressEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch real-time stress events from backend
    // For now, show placeholder data
    setIsLoading(false);
  }, []);

  const stressEmoji = (level: number) => {
    if (level === 5) return '🚨';
    if (level === 4) return '😰';
    if (level === 3) return '😫';
    if (level === 2) return '😟';
    return '😌';
  };

  const stressColor = (level: number) => {
    if (level === 5) return 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/20';
    if (level === 4) return 'text-orange-600 bg-orange-50 dark:text-orange-400 dark:bg-orange-900/20';
    if (level === 3) return 'text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-900/20';
    if (level === 2) return 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/20';
    return 'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-900/20';
  };

  return (
    <div className="flex flex-col gap-8 pb-24">
      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <SectionCard accent="sage" className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--color-muted)]">Today's Check-ins</p>
              <p className="text-3xl font-bold text-[var(--color-ink)] dark:text-white mt-2">
                {events.length}
              </p>
            </div>
            <div className="text-4xl">📊</div>
          </div>
        </SectionCard>

        <SectionCard accent="sage" className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--color-muted)]">Average Stress</p>
              <p className="text-3xl font-bold text-[var(--color-ink)] dark:text-white mt-2">
                {events.length > 0
                  ? (events.reduce((sum, e) => sum + e.stressLevel, 0) / events.length).toFixed(1)
                  : '0.0'}
                <span className="text-lg text-[var(--color-muted)]">/5</span>
              </p>
            </div>
            <div className="text-4xl">📈</div>
          </div>
        </SectionCard>

        <SectionCard accent="rose" className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--color-muted)]">High Stress Events</p>
              <p className="text-3xl font-bold text-[var(--color-ink)] dark:text-white mt-2">
                {events.filter((e) => e.stressLevel >= 4).length}
              </p>
            </div>
            <div className="text-4xl">⚠️</div>
          </div>
        </SectionCard>
      </div>

      {/* Recent Events */}
      <SectionCard accent="none" className="gap-6 p-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold tracking-[-0.01em]">Recent Stress Events</h2>
            <p className="text-sm leading-6 text-[var(--color-muted)] mt-1">
              Real-time updates on stress levels and communication needs
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-[var(--color-muted)]">
            Loading events...
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-lg font-medium text-[var(--color-ink)] dark:text-white mb-2">
              No events yet
            </p>
            <p className="text-sm text-[var(--color-muted)]">
              Stress check-ins and alerts will appear here
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {events.map((event) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-lg border bg-white/90 p-4 dark:bg-[rgba(15,23,42,0.75)]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{stressEmoji(event.stressLevel)}</span>
                      <Badge className={stressColor(event.stressLevel)}>
                        Level {event.stressLevel}/5
                      </Badge>
                      <span className="text-xs text-[var(--color-muted)]">
                        {event.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-sm text-[var(--color-ink)] dark:text-white mb-2">
                      {event.message}
                    </p>
                    {event.translatedMessage && (
                      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-800">
                        <p className="text-xs font-semibold text-[var(--color-muted)] mb-1">
                          TRANSLATED MESSAGE
                        </p>
                        <p className="text-sm text-[var(--color-ink)] dark:text-white">
                          {event.translatedMessage}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </SectionCard>

      {/* Pattern Insights */}
      <SectionCard accent="sage" className="gap-6 p-8">
        <div>
          <h2 className="text-xl font-semibold tracking-[-0.01em] mb-2">Pattern Insights</h2>
          <p className="text-sm leading-6 text-[var(--color-muted)]">
            AI-powered analysis of stress patterns, triggers, and trends
          </p>
        </div>

        <StressPatternAnalysis events={events} />
      </SectionCard>
    </div>
  );
}

