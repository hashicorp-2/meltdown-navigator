'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SectionCard } from '@/components/ui/SectionCard';

export interface StressEvent {
  id: string;
  timestamp: Date;
  stressLevel: number;
  environment: string;
  message?: string;
}

interface PatternInsight {
  type: 'trigger' | 'time' | 'environment' | 'trend';
  title: string;
  description: string;
  confidence: number;
  recommendation: string;
  icon: string;
  color: string;
}

export function StressPatternAnalysis({ events }: { events: Array<{ id: string; timestamp: Date; stressLevel: number; environment?: string }> }) {
  const [insights, setInsights] = useState<PatternInsight[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    if (events.length < 3) {
      setInsights([]);
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate AI analysis (in production, this would call backend)
    setTimeout(() => {
      const newInsights: PatternInsight[] = [];

      // Time-based pattern
      const hourCounts = new Map<number, number>();
      events.forEach((e) => {
        const hour = e.timestamp.getHours();
        hourCounts.set(hour, (hourCounts.get(hour) || 0) + 1);
      });
      const peakHour = Array.from(hourCounts.entries()).sort((a, b) => b[1] - a[1])[0];
      if (peakHour && peakHour[1] >= 2) {
        newInsights.push({
          type: 'time',
          title: 'Peak Stress Time',
          description: `Most stress events occur around ${peakHour[0]}:00`,
          confidence: Math.min(peakHour[1] / events.length, 0.9),
          recommendation: 'Consider scheduling calming activities before this time',
          icon: '⏰',
          color: 'from-blue-400 to-blue-600'
        });
      }

      // Environment pattern
      const envCounts = new Map<string, number>();
      events.forEach((e) => {
        const env = e.environment || 'unknown';
        envCounts.set(env, (envCounts.get(env) || 0) + 1);
      });
      const peakEnv = Array.from(envCounts.entries()).sort((a, b) => b[1] - a[1])[0];
      if (peakEnv && peakEnv[1] >= 2) {
        newInsights.push({
          type: 'environment',
          title: 'High-Stress Environment',
          description: `Most stress occurs in ${peakEnv[0]} settings`,
          confidence: Math.min(peakEnv[1] / events.length, 0.85),
          recommendation: 'Develop specific coping strategies for this environment',
          icon: '📍',
          color: 'from-purple-400 to-purple-600'
        });
      }

      // Trend analysis
      const recentEvents = events.slice(-5);
      const avgRecent = recentEvents.reduce((sum, e) => sum + e.stressLevel, 0) / recentEvents.length;
      const avgOverall = events.reduce((sum, e) => sum + e.stressLevel, 0) / events.length;
      
      if (avgRecent > avgOverall + 0.5) {
        newInsights.push({
          type: 'trend',
          title: 'Escalating Trend',
          description: 'Stress levels have been increasing recently',
          confidence: 0.75,
          recommendation: 'Consider proactive interventions and check-ins',
          icon: '📈',
          color: 'from-orange-400 to-orange-600'
        });
      } else if (avgRecent < avgOverall - 0.5) {
        newInsights.push({
          type: 'trend',
          title: 'Improving Trend',
          description: 'Stress levels have been decreasing recently',
          confidence: 0.7,
          recommendation: 'Continue current strategies - they\'re working!',
          icon: '📉',
          color: 'from-emerald-400 to-emerald-600'
        });
      }

      // High-stress frequency
      const highStressCount = events.filter((e) => e.stressLevel >= 4).length;
      if (highStressCount >= 3) {
        newInsights.push({
          type: 'trigger',
          title: 'Frequent High Stress',
          description: `${highStressCount} high-stress events detected`,
          confidence: 0.8,
          recommendation: 'Consider professional support or intensive intervention',
          icon: '⚠️',
          color: 'from-red-400 to-red-600'
        });
      }

      setInsights(newInsights);
      setIsAnalyzing(false);
    }, 1000);
  }, [events]);

  if (events.length < 3) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 dark:border-gray-700 p-8 text-center">
        <div className="text-4xl mb-3">📊</div>
        <p className="text-sm text-[var(--color-muted)]">
          Pattern analysis will appear after 3+ stress events
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {isAnalyzing ? (
        <div className="flex items-center justify-center py-8">
          <motion.div
            className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
          <span className="ml-3 text-sm text-[var(--color-muted)]">Analyzing patterns...</span>
        </div>
      ) : insights.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 dark:border-gray-700 p-6 text-center">
          <p className="text-sm text-[var(--color-muted)]">
            No clear patterns detected yet. Continue tracking to see insights.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {insights.map((insight, index) => (
            <motion.div
              key={insight.type + index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`
                rounded-xl p-4
                bg-gradient-to-br ${insight.color}
                text-white
                shadow-lg
              `}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{insight.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-sm">{insight.title}</h4>
                    <span className="text-xs opacity-75">
                      {Math.round(insight.confidence * 100)}% confidence
                    </span>
                  </div>
                  <p className="text-xs opacity-90 mb-2">{insight.description}</p>
                  <div className="mt-2 pt-2 border-t border-white/20">
                    <p className="text-xs font-medium">💡 {insight.recommendation}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

