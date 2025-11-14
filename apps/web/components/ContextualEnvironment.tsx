'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export type Environment = 'home' | 'school' | 'work' | 'social' | 'public' | 'unknown';

interface EnvironmentConfig {
  id: Environment;
  label: string;
  emoji: string;
  icon: string;
  description: string;
  color: string;
}

const ENVIRONMENTS: EnvironmentConfig[] = [
  {
    id: 'home',
    label: 'Home',
    emoji: '🏠',
    icon: '🏠',
    description: 'Safe, familiar space',
    color: 'from-blue-400 to-blue-600'
  },
  {
    id: 'school',
    label: 'School',
    emoji: '🏫',
    icon: '🏫',
    description: 'Academic environment',
    color: 'from-purple-400 to-purple-600'
  },
  {
    id: 'work',
    label: 'Work',
    emoji: '💼',
    icon: '💼',
    description: 'Professional setting',
    color: 'from-indigo-400 to-indigo-600'
  },
  {
    id: 'social',
    label: 'Social',
    emoji: '👥',
    icon: '👥',
    description: 'With friends or family',
    color: 'from-pink-400 to-pink-600'
  },
  {
    id: 'public',
    label: 'Public',
    emoji: '🌆',
    icon: '🌆',
    description: 'Public space',
    color: 'from-gray-400 to-gray-600'
  },
  {
    id: 'unknown',
    label: 'Other',
    emoji: '📍',
    icon: '📍',
    description: 'Different location',
    color: 'from-slate-400 to-slate-600'
  }
];

interface ContextualEnvironmentProps {
  value?: Environment;
  onChange?: (env: Environment) => void;
  showLabel?: boolean;
}

export function ContextualEnvironment({
  value,
  onChange,
  showLabel = true
}: ContextualEnvironmentProps) {
  const [selectedEnv, setSelectedEnv] = useState<Environment>(value || 'unknown');
  const [autoDetected, setAutoDetected] = useState<boolean>(false);

  useEffect(() => {
    if (value) {
      setSelectedEnv(value);
    } else {
      // Auto-detect environment based on time and day (simple heuristic)
      const hour = new Date().getHours();
      const day = new Date().getDay();
      
      if (hour >= 8 && hour <= 15 && day >= 1 && day <= 5) {
        setSelectedEnv('school');
        setAutoDetected(true);
      } else if (hour >= 9 && hour <= 17 && day >= 1 && day <= 5) {
        setSelectedEnv('work');
        setAutoDetected(true);
      } else {
        setSelectedEnv('home');
        setAutoDetected(true);
      }
    }
  }, [value]);

  const handleSelect = (env: Environment) => {
    setSelectedEnv(env);
    setAutoDetected(false);
    onChange?.(env);
  };

  const currentEnv = ENVIRONMENTS.find((e) => e.id === selectedEnv) || ENVIRONMENTS[5];

  return (
    <div className="flex flex-col gap-3">
      {showLabel && (
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-[var(--color-ink)] dark:text-white">
            Where are you right now?
          </span>
          {autoDetected && (
            <span className="text-xs text-[var(--color-muted)]">Auto-detected</span>
          )}
        </div>
      )}

      <div className="grid grid-cols-3 gap-3">
        {ENVIRONMENTS.map((env) => {
          const isSelected = selectedEnv === env.id;

          return (
            <motion.button
              key={env.id}
              type="button"
              onClick={() => handleSelect(env.id)}
              className={`
                flex flex-col items-center gap-2 p-3 rounded-xl
                transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
                ${isSelected
                  ? `bg-gradient-to-br ${env.color} text-white shadow-lg`
                  : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                }
              `}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
              <span className="text-2xl">{env.icon}</span>
              <span className={`text-xs font-medium ${isSelected ? 'text-white' : ''}`}>
                {env.label}
              </span>
            </motion.button>
          );
        })}
      </div>

      {selectedEnv && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`
            rounded-lg p-3 text-sm
            bg-gradient-to-r ${currentEnv.color}
            text-white
          `}
        >
          <div className="flex items-center gap-2">
            <span className="text-lg">{currentEnv.icon}</span>
            <span className="font-medium">{currentEnv.description}</span>
          </div>
        </motion.div>
      )}
    </div>
  );
}

