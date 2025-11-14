'use client';

import { motion } from 'framer-motion';

interface PlanStep {
  stepNumber: number;
  title: string;
  message: string;
  tip?: string;
  icon?: string;
}

interface VisualPlanStepsProps {
  steps: PlanStep[];
  currentStep?: number;
}

export function VisualPlanSteps({ steps, currentStep }: VisualPlanStepsProps) {
  return (
    <div className="flex flex-col gap-4">
      {steps.map((step, index) => {
        const isActive = currentStep === undefined || currentStep === step.stepNumber;
        const isPast = currentStep !== undefined && currentStep > step.stepNumber;

        return (
            <motion.div
              key={step.stepNumber}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: isActive || isPast ? 1 : 0.5, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`
                flex items-start gap-3 p-3 rounded-lg
                ${isActive
                  ? 'bg-indigo-50 dark:bg-indigo-900/20'
                  : isPast
                  ? 'bg-gray-50 dark:bg-gray-800/50'
                  : 'bg-white/50 dark:bg-gray-800/30'
                }
              `}
            >
              {/* Icon - Square like in reference */}
              <div
                className={`
                  w-10 h-10 rounded flex items-center justify-center
                  flex-shrink-0
                  ${isActive
                    ? 'bg-indigo-600 text-white'
                    : isPast
                    ? 'bg-gray-400 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                  }
                `}
              >
                {step.icon ? (
                  <span className="text-base">{step.icon}</span>
                ) : (
                  <span className="text-sm font-bold">{step.stepNumber}</span>
                )}
              </div>

              {/* Content */}
              <div className="flex-1">
                <h3
                  className={`
                  text-sm font-semibold mb-1
                  ${isActive
                    ? 'text-indigo-900 dark:text-indigo-100'
                    : 'text-gray-600 dark:text-gray-400'
                  }
                `}
                >
                  Step {step.stepNumber} {step.title}
                </h3>
                <p
                  className={`
                  text-xs leading-relaxed
                  ${isActive
                    ? 'text-gray-800 dark:text-gray-200'
                    : 'text-gray-600 dark:text-gray-400'
                  }
                `}
                >
                  {step.message}
                </p>
              </div>

            {/* Checkmark for completed steps */}
            {isPast && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center flex-shrink-0"
              >
                ✓
              </motion.div>
            )}
          </motion.div>
        );
      })}

      {/* Pagination dots */}
      <div className="flex items-center justify-center gap-2 pt-2">
        {steps.map((_, index) => (
          <div
            key={index}
            className={`
              w-2 h-2 rounded-full transition-all duration-200
              ${currentStep === undefined || currentStep === index + 1
                ? 'bg-indigo-500 w-8'
                : currentStep !== undefined && currentStep > index + 1
                ? 'bg-green-500'
                : 'bg-gray-300 dark:bg-gray-600'
              }
            `}
          />
        ))}
      </div>
    </div>
  );
}

