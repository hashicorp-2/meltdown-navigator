export interface TriggerBadge {
  id: string;
  label: string;
  emoji: string;
}

export interface TriggerBadgeGridProps {
  /** List of triggers to present as visual chips. */
  items?: TriggerBadge[];
  /** Optional click handler when a trigger is selected. */
  onSelect?: (trigger: TriggerBadge) => void;
}

const defaultTriggers: TriggerBadge[] = [
  { id: 'overwhelm', label: 'Overwhelmed', emoji: '🌊' },
  { id: 'sensory', label: 'Sensory overload', emoji: '🔊' },
  { id: 'transition', label: 'Transitioning tasks', emoji: '🔄' },
  { id: 'fatigue', label: 'Low energy', emoji: '😴' },
  { id: 'conflict', label: 'Conflict brewing', emoji: '⚡️' },
  { id: 'isolation', label: 'Feeling alone', emoji: '🫧' },
  { id: 'shutdown', label: 'Shutdown', emoji: '🌀' },
  { id: 'panic', label: 'Panic spike', emoji: '💥' },
];

/**
 * Displays a tactile grid of emoji-based trigger badges to help neurodivergent
 * users quickly communicate what patterns are present.
 */
export function TriggerBadgeGrid({ items = defaultTriggers, onSelect }: TriggerBadgeGridProps) {
  return (
    <ul className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {items.map((trigger) => (
        <li key={trigger.id}>
          <button
            type="button"
            onClick={onSelect ? () => onSelect(trigger) : undefined}
            className="group flex w-full flex-col items-center gap-2 rounded-3xl border border-transparent bg-white/70 px-4 py-5 text-center shadow-md shadow-indigo-100 transition hover:border-indigo-200 hover:bg-white"
          >
            <span className="text-3xl transition group-hover:scale-110">{trigger.emoji}</span>
            <span className="text-sm font-medium text-slate-600">{trigger.label}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}







