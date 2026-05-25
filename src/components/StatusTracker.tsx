import { Truck, Wrench, CheckCircle2, XCircle, type LucideIcon } from 'lucide-react';
import type { StringingOrderStatus } from '../types';

interface Step {
  key: StringingOrderStatus;
  label: string;
  icon: LucideIcon;
  /** Жёлтый акцент для шага «передача» */
  accent?: 'yellow' | 'default' | 'danger';
}

const steps: Step[] = [
  { key: 'handover', label: 'В передаче', icon: Truck, accent: 'yellow' },
  // "В работе" поярче (отдельный цвет задаём в circleClass ниже)
  { key: 'in_progress', label: 'В работе', icon: Wrench, accent: 'yellow' },
  { key: 'ready', label: 'Готово', icon: CheckCircle2, accent: 'default' },
  { key: 'cancelled', label: 'Отменён', icon: XCircle, accent: 'danger' },
];

const statusIndex: Record<StringingOrderStatus, number> = {
  handover: 0,
  in_progress: 1,
  ready: 2,
  cancelled: 3,
};

interface StatusTrackerProps {
  status: StringingOrderStatus;
}

export default function StatusTracker({ status }: StatusTrackerProps) {
  const currentStep = statusIndex[status] ?? 0;

  return (
    <div className="flex w-full items-start gap-0">
      {steps.map((step, idx) => {
        const isCurrent = idx === currentStep;
        const Icon = step.icon;
        const yellow = step.accent === 'yellow';
        const danger = step.accent === 'danger';

        // Подсвечиваем только текущий статус (остальные — без заливки).
        const circleClass = isCurrent
          ? step.key === 'handover' && yellow
            ? 'border-black bg-[#E6EDA5] text-black shadow-[3px_3px_0_0_#000]'
            : step.key === 'in_progress' && yellow
              ? 'border-black bg-[#FDE047] text-black shadow-[3px_3px_0_0_#000]'
              : danger
                ? 'border-black bg-red-100 text-red-700 shadow-[3px_3px_0_0_#000]'
                : 'bg-primary text-black shadow-[3px_3px_0_0_#000]'
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
                  isCurrent ? 'text-black' : 'text-neutral-400'
                }`}
              >
                {step.label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
