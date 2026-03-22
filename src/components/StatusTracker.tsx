import { Package, Wrench, CheckCircle2, type LucideIcon } from 'lucide-react';
import type { OrderStatus } from '../types';

interface Step {
  key: OrderStatus;
  label: string;
  icon: LucideIcon;
}

const steps: Step[] = [
  { key: 'received', label: 'Получена', icon: Package },
  { key: 'in_progress', label: 'В работе', icon: Wrench },
  { key: 'ready', label: 'Готово', icon: CheckCircle2 },
];

const statusIndex: Record<OrderStatus, number> = {
  received: 0,
  in_progress: 1,
  ready: 2,
};

interface StatusTrackerProps {
  status: OrderStatus;
}

export default function StatusTracker({ status }: StatusTrackerProps) {
  const currentStep = statusIndex[status] ?? 0;

  return (
    <div className="flex items-center gap-0 w-full">
      {steps.map((step, idx) => {
        const isCompleted = idx <= currentStep;
        const isCurrent = idx === currentStep;
        const Icon = step.icon;

        return (
          <div key={step.key} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all
                  ${isCurrent ? 'bg-primary text-white shadow-md status-pulse' : ''}
                  ${isCompleted && !isCurrent ? 'bg-primary/20 text-primary-dark' : ''}
                  ${!isCompleted ? 'bg-gray-100 text-gray-400' : ''}
                `}
              >
                <Icon size={18} />
              </div>
              <span
                className={`text-xs mt-1.5 font-medium
                  ${isCompleted ? 'text-primary-dark' : 'text-gray-400'}
                `}
              >
                {step.label}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-2 rounded-full transition-all
                  ${idx < currentStep ? 'bg-primary' : 'bg-gray-200'}
                `}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
