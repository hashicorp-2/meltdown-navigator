"use client";

import { useState, useTransition } from "react";
import { createProfile } from "../../lib/api";
import type { CreateProfileRequestDTO, ProfileResponseDTO } from "../../../../common/types";
import { FocusButton } from "../ui/FocusButton";
import { motion, AnimatePresence } from "framer-motion";
import type { SupportContact, CommunicationTone } from "../../../../common/types";

interface OnboardingFormProps {
  userId: string;
  onComplete: (profile: ProfileResponseDTO) => void;
  onCancel?: () => void;
}

type Step = 1 | 2 | 3 | 4 | 5;

interface FormData {
  preferredName: string;
  supportCircle: SupportContact[];
  communicationGuidelines: {
    tone: CommunicationTone;
    doPhrases: string[];
    avoidPhrases: string[];
  };
  crisisSignals: {
    triggers: string[];
    escalationIndicators: string[];
    selfRegulationTechniques: string[];
  };
}

const INITIAL_FORM_DATA: FormData = {
  preferredName: "",
  supportCircle: [],
  communicationGuidelines: {
    tone: "soft",
    doPhrases: [],
    avoidPhrases: [],
  },
  crisisSignals: {
    triggers: [],
    escalationIndicators: [],
    selfRegulationTechniques: [],
  },
};

const STEP_TITLES = [
  "Welcome",
  "Support Circle",
  "Communication Style",
  "Crisis Signals",
  "Review",
];

export function OnboardingForm({ userId, onComplete, onCancel }: OnboardingFormProps) {
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const updateFormData = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep((prev) => (prev + 1) as Step);
      setError(null);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as Step);
      setError(null);
    }
  };

  const handleSubmit = () => {
    startTransition(async () => {
      try {
        setError(null);

        const payload: CreateProfileRequestDTO = {
          userId,
          preferredName: formData.preferredName,
          supportCircle: formData.supportCircle,
          communicationGuidelines: formData.communicationGuidelines,
          crisisSignals: formData.crisisSignals,
        };

        const profile = await createProfile(payload);
        onComplete(profile);
      } catch (err) {
        console.error(err);
        setError(
          err instanceof Error
            ? err.message
            : "Failed to create profile. Please try again."
        );
      }
    });
  };

  const canProceed = (): boolean => {
    switch (currentStep) {
      case 1:
        return formData.preferredName.trim().length > 0;
      case 2:
        return true; // Support circle is optional
      case 3:
        return true; // Communication guidelines have defaults
      case 4:
        return true; // Crisis signals are optional
      case 5:
        return !isPending;
      default:
        return false;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <BasicInfoStep formData={formData} updateFormData={updateFormData} />;
      case 2:
        return <SupportCircleStep formData={formData} updateFormData={updateFormData} />;
      case 3:
        return <CommunicationStep formData={formData} updateFormData={updateFormData} />;
      case 4:
        return <CrisisSignalsStep formData={formData} updateFormData={updateFormData} />;
      case 5:
        return <ReviewStep formData={formData} />;
      default:
        return null;
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-6 pb-24">
      <div className="rounded-4xl bg-white/80 p-8 shadow-2xl shadow-indigo-100 backdrop-blur-xl">
        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {STEP_TITLES.map((title, index) => {
              const step = (index + 1) as Step;
              const isActive = step === currentStep;
              const isCompleted = step < currentStep;

              return (
                <div key={step} className="flex flex-1 items-center">
                  <div className="flex flex-col items-center gap-2">
                    <div
                      className={`flex size-10 items-center justify-center rounded-full text-sm font-semibold transition ${
                        isActive
                          ? "bg-indigo-500 text-white"
                          : isCompleted
                          ? "bg-indigo-200 text-indigo-700"
                          : "bg-slate-200 text-slate-500"
                      }`}
                    >
                      {isCompleted ? "✓" : step}
                    </div>
                    <span
                      className={`text-xs font-medium ${
                        isActive ? "text-indigo-600" : "text-slate-500"
                      }`}
                    >
                      {title}
                    </span>
                  </div>
                  {index < STEP_TITLES.length - 1 && (
                    <div
                      className={`mx-2 h-1 flex-1 rounded ${
                        isCompleted ? "bg-indigo-500" : "bg-slate-200"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Step content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>

        {/* Error message */}
        {error && (
          <div className="mt-6 rounded-lg bg-rose-50 p-4 text-sm text-rose-600">
            {error}
          </div>
        )}

        {/* Navigation buttons */}
        <div className="mt-8 flex items-center justify-between gap-4">
          <div>
            {currentStep > 1 && (
              <FocusButton
                variant="secondary"
                onClick={handlePrevious}
                disabled={isPending}
              >
                Previous
              </FocusButton>
            )}
            {onCancel && currentStep === 1 && (
              <FocusButton variant="secondary" onClick={onCancel} disabled={isPending}>
                Cancel
              </FocusButton>
            )}
          </div>
          <div className="flex gap-4">
            {currentStep < 5 ? (
              <FocusButton
                onClick={handleNext}
                disabled={!canProceed() || isPending}
                glow
              >
                Next
              </FocusButton>
            ) : (
              <FocusButton
                onClick={handleSubmit}
                disabled={!canProceed() || isPending}
                glow
              >
                {isPending ? "Creating..." : "Create Profile"}
              </FocusButton>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Step 1: Basic Info
function BasicInfoStep({
  formData,
  updateFormData,
}: {
  formData: FormData;
  updateFormData: <K extends keyof FormData>(key: K, value: FormData[K]) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">Welcome to Meltdown Navigator</h2>
        <p className="mt-2 text-slate-600">
          Let's create your personalized AI profile. This will help us provide tailored support
          during difficult moments.
        </p>
      </div>

      <label className="flex flex-col gap-2">
        <span className="text-sm font-medium text-slate-700">What should we call you?</span>
        <input
          type="text"
          value={formData.preferredName}
          onChange={(e) => updateFormData("preferredName", e.target.value)}
          placeholder="Your name"
          className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-700 shadow-inner focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          autoFocus
        />
      </label>
    </div>
  );
}

// Step 2: Support Circle
function SupportCircleStep({
  formData,
  updateFormData,
}: {
  formData: FormData;
  updateFormData: <K extends keyof FormData>(key: K, value: FormData[K]) => void;
}) {
  const [newContact, setNewContact] = useState<SupportContact>({
    name: "",
    relationship: "",
    contactMethod: "sms",
  });

  const addContact = () => {
    if (newContact.name.trim() && newContact.relationship.trim()) {
      if (formData.supportCircle.length < 5) {
        updateFormData("supportCircle", [...formData.supportCircle, { ...newContact }]);
        setNewContact({ name: "", relationship: "", contactMethod: "sms" });
      }
    }
  };

  const removeContact = (index: number) => {
    updateFormData(
      "supportCircle",
      formData.supportCircle.filter((_, i) => i !== index)
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">Support Circle</h2>
        <p className="mt-2 text-slate-600">
          Add people in your support network (up to 5). This helps us tailor communication
          recommendations.
        </p>
      </div>

      {formData.supportCircle.length > 0 && (
        <div className="space-y-3">
          {formData.supportCircle.map((contact, index) => (
            <div
              key={index}
              className="flex items-center justify-between rounded-2xl bg-indigo-50 p-4"
            >
              <div>
                <p className="font-medium text-slate-900">{contact.name}</p>
                <p className="text-sm text-slate-600">
                  {contact.relationship} • {contact.contactMethod}
                </p>
              </div>
              <button
                type="button"
                onClick={() => removeContact(index)}
                className="rounded-full bg-rose-100 px-3 py-1 text-sm font-medium text-rose-600 transition hover:bg-rose-200"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      {formData.supportCircle.length < 5 && (
        <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-slate-700">Name</span>
              <input
                type="text"
                value={newContact.name}
                onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                placeholder="Alex"
                className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              />
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-slate-700">Relationship</span>
              <input
                type="text"
                value={newContact.relationship}
                onChange={(e) =>
                  setNewContact({ ...newContact, relationship: e.target.value })
                }
                placeholder="Partner, Friend, Therapist..."
                className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              />
            </label>
          </div>
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-slate-700">Preferred Contact Method</span>
            <select
              value={newContact.contactMethod}
              onChange={(e) =>
                setNewContact({
                  ...newContact,
                  contactMethod: e.target.value as "sms" | "email" | "call",
                })
              }
              className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            >
              <option value="sms">Text Message</option>
              <option value="email">Email</option>
              <option value="call">Phone Call</option>
            </select>
          </label>
          <FocusButton
            type="button"
            variant="secondary"
            onClick={addContact}
            disabled={!newContact.name.trim() || !newContact.relationship.trim()}
          >
            Add Contact
          </FocusButton>
        </div>
      )}

      {formData.supportCircle.length === 0 && (
        <p className="text-sm text-slate-500">You can skip this step and add contacts later.</p>
      )}
    </div>
  );
}

// Step 3: Communication Guidelines
function CommunicationStep({
  formData,
  updateFormData,
}: {
  formData: FormData;
  updateFormData: <K extends keyof FormData>(key: K, value: FormData[K]) => void;
}) {
  const [doPhrase, setDoPhrase] = useState("");
  const [avoidPhrase, setAvoidPhrase] = useState("");

  const addDoPhrase = () => {
    if (doPhrase.trim()) {
      updateFormData("communicationGuidelines", {
        ...formData.communicationGuidelines,
        doPhrases: [...formData.communicationGuidelines.doPhrases, doPhrase.trim()],
      });
      setDoPhrase("");
    }
  };

  const removeDoPhrase = (index: number) => {
    updateFormData("communicationGuidelines", {
      ...formData.communicationGuidelines,
      doPhrases: formData.communicationGuidelines.doPhrases.filter((_, i) => i !== index),
    });
  };

  const addAvoidPhrase = () => {
    if (avoidPhrase.trim()) {
      updateFormData("communicationGuidelines", {
        ...formData.communicationGuidelines,
        avoidPhrases: [...formData.communicationGuidelines.avoidPhrases, avoidPhrase.trim()],
      });
      setAvoidPhrase("");
    }
  };

  const removeAvoidPhrase = (index: number) => {
    updateFormData("communicationGuidelines", {
      ...formData.communicationGuidelines,
      avoidPhrases: formData.communicationGuidelines.avoidPhrases.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">Communication Style</h2>
        <p className="mt-2 text-slate-600">
          Help us understand how you prefer to communicate during difficult moments.
        </p>
      </div>

      <label className="flex flex-col gap-2">
        <span className="text-sm font-medium text-slate-700">Communication Tone</span>
        <select
          value={formData.communicationGuidelines.tone}
          onChange={(e) =>
            updateFormData("communicationGuidelines", {
              ...formData.communicationGuidelines,
              tone: e.target.value as CommunicationTone,
            })
          }
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200"
        >
          <option value="soft">Soft - Gentle, empathetic</option>
          <option value="direct">Direct - Clear, straightforward</option>
          <option value="informative">Informative - Factual, detailed</option>
        </select>
      </label>

      <div className="space-y-4">
        <div>
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-slate-700">Preferred Phrases</span>
            <div className="flex gap-2">
              <input
                type="text"
                value={doPhrase}
                onChange={(e) => setDoPhrase(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addDoPhrase()}
                placeholder="e.g., 'I feel...', 'Could you help...'"
                className="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              />
              <FocusButton type="button" variant="secondary" onClick={addDoPhrase}>
                Add
              </FocusButton>
            </div>
          </label>
          {formData.communicationGuidelines.doPhrases.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {formData.communicationGuidelines.doPhrases.map((phrase, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-2 rounded-full bg-indigo-100 px-3 py-1 text-sm text-indigo-700"
                >
                  {phrase}
                  <button
                    type="button"
                    onClick={() => removeDoPhrase(index)}
                    className="text-indigo-500 hover:text-indigo-700"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-slate-700">Avoid Phrases</span>
            <div className="flex gap-2">
              <input
                type="text"
                value={avoidPhrase}
                onChange={(e) => setAvoidPhrase(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addAvoidPhrase()}
                placeholder="e.g., 'You always...', 'Why don't you...'"
                className="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              />
              <FocusButton type="button" variant="secondary" onClick={addAvoidPhrase}>
                Add
              </FocusButton>
            </div>
          </label>
          {formData.communicationGuidelines.avoidPhrases.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {formData.communicationGuidelines.avoidPhrases.map((phrase, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-2 rounded-full bg-rose-100 px-3 py-1 text-sm text-rose-700"
                >
                  {phrase}
                  <button
                    type="button"
                    onClick={() => removeAvoidPhrase(index)}
                    className="text-rose-500 hover:text-rose-700"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Step 4: Crisis Signals
function CrisisSignalsStep({
  formData,
  updateFormData,
}: {
  formData: FormData;
  updateFormData: <K extends keyof FormData>(key: K, value: FormData[K]) => void;
}) {
  const [trigger, setTrigger] = useState("");
  const [technique, setTechnique] = useState("");

  const addTrigger = () => {
    if (trigger.trim()) {
      updateFormData("crisisSignals", {
        ...formData.crisisSignals,
        triggers: [...formData.crisisSignals.triggers, trigger.trim()],
      });
      setTrigger("");
    }
  };

  const removeTrigger = (index: number) => {
    updateFormData("crisisSignals", {
      ...formData.crisisSignals,
      triggers: formData.crisisSignals.triggers.filter((_, i) => i !== index),
    });
  };

  const addTechnique = () => {
    if (technique.trim()) {
      updateFormData("crisisSignals", {
        ...formData.crisisSignals,
        selfRegulationTechniques: [
          ...formData.crisisSignals.selfRegulationTechniques,
          technique.trim(),
        ],
      });
      setTechnique("");
    }
  };

  const removeTechnique = (index: number) => {
    updateFormData("crisisSignals", {
      ...formData.crisisSignals,
      selfRegulationTechniques: formData.crisisSignals.selfRegulationTechniques.filter(
        (_, i) => i !== index
      ),
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">Crisis Signals</h2>
        <p className="mt-2 text-slate-600">
          Help us understand your triggers and preferred self-regulation techniques.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-slate-700">Triggers</span>
            <div className="flex gap-2">
              <input
                type="text"
                value={trigger}
                onChange={(e) => setTrigger(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addTrigger()}
                placeholder="e.g., Loud noises, Being rushed, Conflict"
                className="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              />
              <FocusButton type="button" variant="secondary" onClick={addTrigger}>
                Add
              </FocusButton>
            </div>
          </label>
          {formData.crisisSignals.triggers.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {formData.crisisSignals.triggers.map((item, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-sm text-amber-700"
                >
                  {item}
                  <button
                    type="button"
                    onClick={() => removeTrigger(index)}
                    className="text-amber-500 hover:text-amber-700"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-slate-700">
              Self-Regulation Techniques
            </span>
            <div className="flex gap-2">
              <input
                type="text"
                value={technique}
                onChange={(e) => setTechnique(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addTechnique()}
                placeholder="e.g., Box breathing, Weighted blanket, Music"
                className="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              />
              <FocusButton type="button" variant="secondary" onClick={addTechnique}>
                Add
              </FocusButton>
            </div>
          </label>
          {formData.crisisSignals.selfRegulationTechniques.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {formData.crisisSignals.selfRegulationTechniques.map((item, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-sm text-green-700"
                >
                  {item}
                  <button
                    type="button"
                    onClick={() => removeTechnique(index)}
                    className="text-green-500 hover:text-green-700"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Step 5: Review
function ReviewStep({ formData }: { formData: FormData }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">Review Your Profile</h2>
        <p className="mt-2 text-slate-600">Review your information before creating your profile.</p>
      </div>

      <div className="space-y-4">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <h3 className="font-semibold text-slate-900">Preferred Name</h3>
          <p className="mt-1 text-slate-600">{formData.preferredName}</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <h3 className="font-semibold text-slate-900">Support Circle</h3>
          {formData.supportCircle.length > 0 ? (
            <ul className="mt-2 space-y-2">
              {formData.supportCircle.map((contact, index) => (
                <li key={index} className="text-slate-600">
                  {contact.name} ({contact.relationship}) - {contact.contactMethod}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-1 text-slate-500">No contacts added</p>
          )}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <h3 className="font-semibold text-slate-900">Communication Style</h3>
          <p className="mt-1 text-slate-600">Tone: {formData.communicationGuidelines.tone}</p>
          {formData.communicationGuidelines.doPhrases.length > 0 && (
            <div className="mt-2">
              <p className="text-sm font-medium text-slate-700">Preferred Phrases:</p>
              <ul className="mt-1 list-inside list-disc text-sm text-slate-600">
                {formData.communicationGuidelines.doPhrases.map((phrase, index) => (
                  <li key={index}>{phrase}</li>
                ))}
              </ul>
            </div>
          )}
          {formData.communicationGuidelines.avoidPhrases.length > 0 && (
            <div className="mt-2">
              <p className="text-sm font-medium text-slate-700">Avoid Phrases:</p>
              <ul className="mt-1 list-inside list-disc text-sm text-slate-600">
                {formData.communicationGuidelines.avoidPhrases.map((phrase, index) => (
                  <li key={index}>{phrase}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <h3 className="font-semibold text-slate-900">Crisis Signals</h3>
          {formData.crisisSignals.triggers.length > 0 && (
            <div className="mt-2">
              <p className="text-sm font-medium text-slate-700">Triggers:</p>
              <ul className="mt-1 list-inside list-disc text-sm text-slate-600">
                {formData.crisisSignals.triggers.map((trigger, index) => (
                  <li key={index}>{trigger}</li>
                ))}
              </ul>
            </div>
          )}
          {formData.crisisSignals.selfRegulationTechniques.length > 0 && (
            <div className="mt-2">
              <p className="text-sm font-medium text-slate-700">Self-Regulation Techniques:</p>
              <ul className="mt-1 list-inside list-disc text-sm text-slate-600">
                {formData.crisisSignals.selfRegulationTechniques.map((technique, index) => (
                  <li key={index}>{technique}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


