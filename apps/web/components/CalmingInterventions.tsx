'use client';

import { motion, AnimatePresence } from 'framer-motion';
import type { StressLevel } from '@/components/VisualStressLanguage';

interface CalmingTechnique {
  id: string;
  name: string;
  description: string;
  steps: string[];
  duration: string;
  icon: string;
  color: string;
  stressLevels: StressLevel[];
}

const CALMING_TECHNIQUES: CalmingTechnique[] = [
  {
    id: 'box-breathing',
    name: 'Box Breathing',
    description: '4-4-4-4 breathing pattern to regulate your nervous system',
    steps: [
      'Inhale through your nose for 4 counts',
      'Hold your breath for 4 counts',
      'Exhale through your mouth for 4 counts',
      'Hold for 4 counts',
      'Repeat 4-6 times'
    ],
    duration: '2-3 minutes',
    icon: '🫁',
    color: 'from-blue-400 to-blue-600',
    stressLevels: [3, 4, 5]
  },
  {
    id: '54321-grounding',
    name: '5-4-3-2-1 Grounding',
    description: 'Use your senses to anchor yourself in the present moment',
    steps: [
      'Name 5 things you can SEE',
      'Name 4 things you can TOUCH',
      'Name 3 things you can HEAR',
      'Name 2 things you can SMELL',
      'Name 1 thing you can TASTE'
    ],
    duration: '2-3 minutes',
    icon: '🌿',
    color: 'from-emerald-400 to-emerald-600',
    stressLevels: [2, 3, 4]
  },
  {
    id: 'tipp-temperature',
    name: 'Temperature Change (TIPP)',
    description: 'Use temperature to quickly shift your body state',
    steps: [
      'Splash cold water on your face',
      'Or hold an ice cube in your hands',
      'Or place a cold compress on your neck',
      'Focus on the sensation for 30 seconds',
      'Take 3 deep breaths'
    ],
    duration: '1-2 minutes',
    icon: '❄️',
    color: 'from-cyan-400 to-cyan-600',
    stressLevels: [4, 5]
  },
  {
    id: 'progressive-muscle',
    name: 'Progressive Muscle Relaxation',
    description: 'Systematically tense and release muscle groups',
    steps: [
      'Start with your toes - tense for 5 seconds, then release',
      'Move to your calves - tense and release',
      'Continue up your body: thighs, stomach, hands, arms, shoulders',
      'Finish with your face - scrunch and release',
      'Take 3 deep breaths'
    ],
    duration: '5-10 minutes',
    icon: '🧘',
    color: 'from-purple-400 to-purple-600',
    stressLevels: [2, 3, 4]
  },
  {
    id: 'mindful-movement',
    name: 'Gentle Movement',
    description: 'Use movement to release tension and regulate',
    steps: [
      'Stand or sit comfortably',
      'Slowly roll your shoulders back 5 times',
      'Gently turn your head side to side',
      'Stretch your arms overhead and hold for 10 seconds',
      'Take 3 deep breaths'
    ],
    duration: '2-3 minutes',
    icon: '🤸',
    color: 'from-pink-400 to-pink-600',
    stressLevels: [1, 2, 3]
  }
];

interface CalmingInterventionsProps {
  stressLevel: StressLevel;
  onSelect?: (technique: CalmingTechnique) => void;
}

export function CalmingInterventions({
  stressLevel,
  onSelect
}: CalmingInterventionsProps) {
  const relevantTechniques = CALMING_TECHNIQUES.filter((t) =>
    t.stressLevels.includes(stressLevel)
  );

  if (relevantTechniques.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h3 className="text-sm font-semibold text-[var(--color-ink)] dark:text-white mb-1">
          Suggested Calming Techniques
        </h3>
        <p className="text-xs text-[var(--color-muted)]">
          Evidence-based interventions for your current stress level
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <AnimatePresence mode="wait">
          {relevantTechniques.map((technique, index) => (
            <motion.div
              key={technique.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ delay: index * 0.1 }}
              className={`
                rounded-xl p-4 cursor-pointer
                bg-gradient-to-br ${technique.color}
                text-white
                shadow-lg hover:shadow-xl
                transition-all duration-200
              `}
              onClick={() => onSelect?.(technique)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{technique.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-sm">{technique.name}</h4>
                    <span className="text-xs opacity-75">{technique.duration}</span>
                  </div>
                  <p className="text-xs opacity-90 mb-2">{technique.description}</p>
                  <ul className="text-xs opacity-80 space-y-1">
                    {technique.steps.slice(0, 3).map((step, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="opacity-60">•</span>
                        <span>{step}</span>
                      </li>
                    ))}
                    {technique.steps.length > 3 && (
                      <li className="text-xs opacity-60 italic">
                        + {technique.steps.length - 3} more steps
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

