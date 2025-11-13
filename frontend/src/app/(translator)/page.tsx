"use client";

import { useState } from "react";
import type { TranslatorResponseDTO } from "../../../../common/types";
import { translatorResponseSchema } from "../../../../common/types";
import { StressDial } from "../../components/ui/StressDial";
import { FocusButton } from "../../components/ui/FocusButton";
import { CommunicationSummaryCard } from "../../components/ui/CommunicationSummaryCard";
import { TriggerBadge, TriggerBadgeGrid } from "../../components/ui/TriggerBadgeGrid";
import { AnimatePresence, motion } from "framer-motion";
import { translateMessage, TranslatorApiError } from "../../lib/api";

const demoPlan: TranslatorResponseDTO = {
  communication_medium: "Send as Text Message",
  grounding_technique: "Try box breathing for 2 minutes before you reach out.",
  steps: [
    {
      step_number: 1,
      title: "Open softly",
      icon_suggestion: "text-bubble",
      rephrased_message: "Hey love, I’m feeling really overstimulated and could use a quick grounding check-in.",
      pro_tip: "Pause and take three slow breaths before you send this.",
    },
    {
      step_number: 2,
      title: "Name the need",
      icon_suggestion: "clipboard",
      rephrased_message: "Could you remind me that we’re safe and maybe help me step outside for some air?",
      pro_tip: "Use short sentences so it feels easier to read.",
    },
    {
      step_number: 3,
      title: "Invite support",
      icon_suggestion: "handshake",
      rephrased_message: "If you’re free, I’d love a calm hug or a glass of water to help me reset.",
      pro_tip: "If they can’t respond right away, set a self-soothing timer for 5 minutes.",
    },
  ],
  metadata: {
    model: "demo",
    latencyMs: 0,
  },
};

const dialVariants = {
  enter: { scale: 0.92, opacity: 0, rotate: -6 },
  center: {
    scale: 1,
    opacity: 1,
    rotate: 0,
    transition: { type: "spring", damping: 16, stiffness: 140 },
  },
  exit: { scale: 0.95, opacity: 0, rotate: 6, transition: { duration: 0.2 } },
};

const formVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { delay: 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

const planVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
};

export default function TranslatorPage() {
  const [stressLevel, setStressLevel] = useState(4);
  const [rawMessage, setRawMessage] = useState("");
  const [selectedTriggers, setSelectedTriggers] = useState<TriggerBadge[]>([]);
  const [plan, setPlan] = useState<TranslatorResponseDTO | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showDemoPlan, setShowDemoPlan] = useState(false);

  const handleTriggerSelect = (trigger: TriggerBadge) => {
    setSelectedTriggers((prev) => {
      const exists = prev.some((item) => item.id === trigger.id);
      if (exists) {
        return prev.filter((item) => item.id !== trigger.id);
      }
      return [...prev, trigger];
    });
  };

  const handleTranslate = async () => {
    setErrorMessage(null);

    if (!rawMessage.trim()) {
      setErrorMessage("Share a quick note about what's happening so we can translate it.");
      return;
    }

    setIsGenerating(true);

    const triggerLine =
      selectedTriggers.length > 0
        ? `\n\nContext triggers: ${selectedTriggers.map((item) => item.label).join(", ")}.`
        : "";

    const enrichedMessage = `${rawMessage.trim()}${triggerLine}`;

    // Get profile ID from localStorage if available
    const profileId = typeof window !== "undefined" ? localStorage.getItem("meltdown_profileId") : null;

    try {
      const livePlan = await translateMessage({
        rawMessage: enrichedMessage,
        stressLevel,
        profileId: profileId || undefined,
      });
      const validatedPlan = translatorResponseSchema.parse(livePlan);
      setPlan(validatedPlan);
      setShowDemoPlan(false);
    } catch (error) {
      if (error instanceof TranslatorApiError) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("We hit a snag talking to the translator. Try again in a moment.");
      }

      if (!process.env.NEXT_PUBLIC_BACKEND_URL) {
        setShowDemoPlan(true);
        setPlan(demoPlan);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F3EEFF] via-white to-white text-slate-900">
      <div className="mx-auto max-w-6xl px-6 pb-24">
        <header className="pt-16 text-center sm:text-left">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-indigo-400">Crisis Translator</p>
              <motion.h1
                className="mt-3 text-4xl font-semibold text-slate-900 sm:text-5xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.29, 1] }}
              >
                Grounded support, step by step.
              </motion.h1>
              <motion.p
                className="mt-4 max-w-2xl text-lg text-slate-600"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.6, ease: [0.16, 1, 0.29, 1] }}
              >
                Input how you're feeling and we'll craft a calm, structured plan your caregiver can follow. Tap the triggers that resonate so the AI knows which patterns to support.
              </motion.p>
            </div>
            <motion.a
              href="/onboarding"
              className="rounded-full border border-indigo-200 bg-white/80 px-4 py-2 text-sm font-medium text-indigo-600 transition hover:border-indigo-300 hover:bg-white"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Profile
            </motion.a>
          </div>
        </header>

        <main className="mt-12 grid gap-10 lg:grid-cols-[360px,1fr]">
          <motion.section
            className="rounded-4xl bg-white/80 p-8 shadow-2xl shadow-indigo-100 backdrop-blur-xl"
            variants={formVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="flex flex-col items-center gap-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={stressLevel}
                  variants={dialVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                >
                  <StressDial value={stressLevel} />
                </motion.div>
              </AnimatePresence>

              <label className="flex w-full flex-col gap-3">
                <span className="text-sm font-medium text-slate-600">How intense does it feel?</span>
                <motion.input
                  className="w-full accent-indigo-500"
                  type="range"
                  min={1}
                  max={5}
                  value={stressLevel}
                  onChange={(event) => setStressLevel(Number(event.target.value))}
                  whileFocus={{ scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 120, damping: 12 }}
                />
                <span className="text-sm text-slate-500">
                  Stress level {stressLevel} of 5
                </span>
              </label>

              <label className="flex w-full flex-col gap-3">
                <span className="text-sm font-medium text-slate-600">Raw message</span>
                <motion.textarea
                  className="min-h-[160px] rounded-3xl border border-slate-200 bg-slate-50 p-4 text-base text-slate-700 shadow-inner focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  placeholder="Tell us what’s happening…"
                  value={rawMessage}
                  onChange={(event) => setRawMessage(event.target.value)}
                  whileFocus={{ scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 120, damping: 12 }}
                />
              </label>

              <div className="w-full">
                <span className="text-sm font-medium text-slate-600">What’s triggering the spike?</span>
                <motion.div
                  className="mt-4"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15, duration: 0.5, ease: [0.16, 1, 0.29, 1] }}
                >
                  <TriggerBadgeGrid onSelect={handleTriggerSelect} />
                </motion.div>
                {selectedTriggers.length > 0 ? (
                  <motion.div
                    className="mt-3 flex flex-wrap items-center gap-2"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <span className="text-xs uppercase tracking-[0.2em] text-indigo-400">Selected:</span>
                    {selectedTriggers.map((trigger) => (
                      <span
                        key={trigger.id}
                        className="inline-flex items-center gap-1 rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-700"
                      >
                        <span>{trigger.emoji}</span>
                        <span>{trigger.label}</span>
                      </span>
                    ))}
                  </motion.div>
                ) : null}
              </div>

              <FocusButton
                type="button"
                onClick={handleTranslate}
                glow
                disabled={isGenerating}
                aria-busy={isGenerating}
                className="w-full justify-center disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isGenerating ? "Translating…" : "Translate to visual plan"}
              </FocusButton>

              <AnimatePresence>
                {errorMessage ? (
                  <motion.p
                    key={errorMessage}
                    className="text-center text-sm text-rose-500"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.25 }}
                  >
                    {errorMessage}
                  </motion.p>
                ) : null}
              </AnimatePresence>
            </div>
          </motion.section>

          <section className="flex flex-col gap-6">
            <AnimatePresence mode="wait">
              {plan ? (
                <motion.div
                  key={plan.metadata?.model ?? (showDemoPlan ? "demo" : "plan")}
                  variants={planVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <CommunicationSummaryCard plan={plan} />
                  {showDemoPlan ? (
                    <p className="mt-3 text-xs text-slate-400">
                      Showing demo plan because the live translator is offline. Set `NEXT_PUBLIC_BACKEND_URL` to connect to the backend.
                    </p>
                  ) : null}
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  className="grid place-items-center rounded-4xl border border-dashed border-indigo-200 bg-white/60 p-10 text-center text-slate-500"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4 }}
                >
                  <p>Once you translate, your visual communication plan will bloom here.</p>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div
              className="rounded-4xl bg-indigo-50 p-6 text-sm text-indigo-700 shadow-inner shadow-indigo-200"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5, ease: [0.16, 1, 0.29, 1] }}
            >
              <h2 className="text-lg font-semibold text-indigo-900">Grounding techniques we love</h2>
              <p className="mt-2 text-indigo-700">
                Try a 4-7-8 breathing pattern, hold an ice cube, or trace the outline of your hand slowly while counting. We’ll bake these into your plan once the AI is online.
              </p>
            </motion.div>
          </section>
        </main>
      </div>
    </div>
  );
}
