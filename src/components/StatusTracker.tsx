import { Truck, Wrench, CheckCircle2, type LucideIcon } from 'lucide-react';
import type { StringingOrderStatus } from '../types';

interface Step {
  key: StringingOrderStatus;
  label: string;
  icon: LucideIcon;
  /** Жёлтый акцент для шага «передача» */
  accent?: 'yellow' | 'default';
}

const steps: Step[] = [
  { key: 'handover', label: 'В передаче', icon: Truck, accent: 'yellow' },
  { key: 'in_progress', label: 'В работе', icon: Wrench, accent: 'default' },
  { key: 'ready', label: 'Готово', icon: CheckCircle2, accent: 'default' },
];

const statusIndex: Record<StringingOrderStatus, number> = {
  handover: 0,
  in_progress: 1,
  ready: 2,
};

interface StatusTrackerProps {
  status: StringingOrderStatus;
}

export default function StatusTracker({ status }: StatusTrackerProps) {
  const currentStep = statusIndex[status] ?? 0;

  return (
    <div className="flex w-full items-start gap-0">
      {steps.map((step, idx) => {
        const isCompleted = idx <= currentStep;
        const isCurrent = idx === currentStep;
        const Icon = step.icon;
        const yellow = step.accent === 'yellow';

        const circleClass = isCurrent
          ? yellow
            ? 'border-black bg-[#E6EDA5] text-black shadow-[3px_3px_0_0_#000]'
            : 'bg-primary text-black shadow-[3px_3px_0_0_#000]'
          : isCompleted
            ? yellow
              ? 'border-black bg-[#E6EDA5]/80 text-black'
              : 'bg-primary/20 text-black'
            : 'bg-white text-neutral-400';

        return (
          <div key={step.key} className="flex flex-1 items-start last:flex-none">
            <div className="flex flex-col items-center">
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-full border-2 border-black transition-colors ${circleClass}`}
              >
                <Icon size={18} />
              </div>
              <span
                className={`mt-2 text-center text-[11px] font-black uppercase tracking-wide ${
                  isCompleted ? 'text-black' : 'text-neutral-400'
                }`}
              >
                {step.label}
              </span>
            </div>

            {idx < steps.length - 1 && (
              <div
                className={`mt-5 h-1 flex-1 border-y border-black ${
                  idx < currentStep ? (idx === 0 ? 'bg-[#E6EDA5]' : 'bg-primary') : 'bg-neutral-200'
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
