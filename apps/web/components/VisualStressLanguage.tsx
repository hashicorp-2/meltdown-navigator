'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export type StressLevel = 1 | 2 | 3 | 4 | 5;

interface StressEmoji {
  level: StressLevel;
  emoji: string;
  label: string;
  color: string;
  description: string;
}

const STRESS_SPECTRUM: StressEmoji[] = [
  {
    level: 1,
    emoji: '😌',
    label: 'Calm',
    color: 'from-emerald-400 to-emerald-600',
    description: 'Feeling grounded and regulated'
  },
  {
    level: 2,
    emoji: '😟',
    label: 'Anxious',
    color: 'from-blue-400 to-blue-600',
    description: 'Starting to feel uneasy'
  },
  {
    level: 3,
    emoji: '😫',
    label: 'Stressed',
    color: 'from-amber-400 to-amber-600',
    description: 'Feeling overwhelmed'
  },
  {
    level: 4,
    emoji: '😰',
    label: 'Overwhelmed',
    color: 'from-orange-400 to-orange-600',
    description: 'Really struggling right now'
  },
  {
    level: 5,
    emoji: '🚨',
    label: 'Crisis',
    color: 'from-red-400 to-red-600',
    description: 'Need immediate support'
  }
];

interface VisualStressLanguageProps {
  value: StressLevel;
  onChange: (level: StressLevel) => void;
  showDescription?: boolean;
}

export function VisualStressLanguage({
  value,
  onChange,
  showDescription = true
}: VisualStressLanguageProps) {
  const [selectedLevel, setSelectedLevel] = useState<StressLevel>(value);
  const [hoveredLevel, setHoveredLevel] = useState<StressLevel | null>(null);

  useEffect(() => {
    setSelectedLevel(value);
  }, [value]);

  const handleSelect = (level: StressLevel) => {
    setSelectedLevel(level);
    onChange(level);
    
    // Haptic feedback simulation (vibration API)
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
  };

  const currentStress = STRESS_SPECTRUM.find((s) => s.level === selectedLevel);
  const displayLevel = hoveredLevel || selectedLevel;
  const displayStress = STRESS_SPECTRUM.find((s) => s.level === displayLevel) || currentStress;

  return (
    <div className="flex flex-col gap-6">
      {/* Main Emoji Selector */}
      <div className="flex items-center justify-between gap-4">
        {STRESS_SPECTRUM.map((stress) => {
          const isSelected = selectedLevel === stress.level;
          const isHovered = hoveredLevel === stress.level;

          return (
            <motion.button
              key={stress.level}
              type="button"
              onClick={() => handleSelect(stress.level)}
              onMouseEnter={() => setHoveredLevel(stress.level)}
              onMouseLeave={() => setHoveredLevel(null)}
              className="flex flex-col items-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded-xl"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
              <motion.div
                className={`
                  relative w-16 h-16 md:w-20 md:h-20 rounded-2xl
                  flex items-center justify-center
                  text-3xl md:text-4xl
                  transition-all duration-300
                  ${isSelected 
                    ? `bg-gradient-to-br ${stress.color} shadow-lg shadow-${stress.color.split('-')[1]}-500/50` 
                    : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }
                `}
                animate={{
                  scale: isSelected ? 1.1 : isHovered ? 1.05 : 1,
                  rotate: isSelected ? [0, -5, 5, -5, 0] : 0
                }}
                transition={{ duration: 0.3 }}
              >
                <span>{stress.emoji}</span>
                {isSelected && (
                  <motion.div
                    className="absolute inset-0 rounded-2xl border-2 border-white dark:border-gray-900"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  />
                )}
              </motion.div>
              <span
                className={`
                  text-xs font-semibold transition-colors
                  ${isSelected 
                    ? `text-${stress.color.split('-')[1]}-600 dark:text-${stress.color.split('-')[1]}-400` 
                    : 'text-gray-600 dark:text-gray-400'
                  }
                `}
              >
                {stress.label}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Current Selection Display */}
      <AnimatePresence mode="wait">
        {displayStress && (
          <motion.div
            key={displayLevel}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className={`
              rounded-2xl p-6
              bg-gradient-to-br ${displayStress.color}
              text-white
              shadow-xl
            `}
          >
            <div className="flex items-center gap-4">
              <motion.div
                className="text-5xl"
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{ 
                  duration: 0.6,
                  repeat: Infinity,
                  repeatDelay: 2
                }}
              >
                {displayStress.emoji}
              </motion.div>
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-1">{displayStress.label}</h3>
                {showDescription && (
                  <p className="text-sm opacity-90">{displayStress.description}</p>
                )}
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold">Level {displayLevel}</div>
                <div className="text-xs opacity-75">of 5</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Visual Progress Bar */}
      <div className="relative">
        <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            className={`h-full bg-gradient-to-r ${currentStress?.color}`}
            initial={{ width: 0 }}
            animate={{ width: `${(selectedLevel / 5) * 100}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
          <span>Calm</span>
          <span>Crisis</span>
        </div>
      </div>
    </div>
  );
}

