import type { LucideIcon } from 'lucide-react';
import { 
  FileSignature, 
  User, 
  MapPin, 
  Camera, 
  GraduationCap, 
  CheckCircle 
} from 'lucide-react';

//-----------------------------------------------------------
// CONSTANTS
//-----------------------------------------------------------

const ICON_ON = '#053261';
const ICON_OFF = 'rgba(255,255,255,0.4)';

const ICONS: LucideIcon[] = [
  FileSignature, 
  User, 
  MapPin, 
  Camera, 
  GraduationCap, 
  CheckCircle
];

//-----------------------------------------------------------
// TYPES
//-----------------------------------------------------------

interface RegistrationStepperProps {
  steps?: string[];
  activeStep?: number;
  onStepClick?: (index: number) => void;
}

//-----------------------------------------------------------
// REGISTRATION STEPPER
//-----------------------------------------------------------

export const RegistrationStepper = ({
  steps = ['Consent Form', 'Personal', 'Location', 'Photo', 'Education', 'Complete'],
  activeStep = 0,
  onStepClick,
}: RegistrationStepperProps) => {
  return (
    <div className="mb-8 w-full">
      {/* ── Desktop stepper ─────────────────────────── */}
      <div className="hidden sm:flex sm:items-start">
        {steps.map((label, i) => {
          const Icon = ICONS[i];
          const isActive = i === activeStep;
          const isDone = i < activeStep;
          const isLast = i === steps.length - 1;

          return (
            <div
              key={label}
              className={`relative flex flex-1 flex-col items-center ${isDone ? 'cursor-pointer' : 'cursor-default'}`}
              onClick={() => isDone && onStepClick?.(i)}
              title={isDone ? `Go back to ${label}` : undefined}
            >
              {/* connector */}
              {!isLast && (
                <div
                  className={`absolute top-4 left-[calc(50%+22px)] right-[calc(-50%+22px)] h-0.5 rounded-full transition-colors duration-350 ${
                    isDone ? 'bg-[#F7CF13]' : 'bg-white/[0.14]'
                  }`}
                />
              )}

              {/* icon circle */}
              <div
                className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-[1.5px] transition-all duration-300 ${
                  isActive
                    ? 'scale-[1.12] border-transparent bg-[#F7CF13] shadow-[0_0_0_4px_rgba(247,207,19,0.25),0_4px_14px_rgba(247,207,19,0.25)]'
                    : isDone
                      ? 'border-transparent bg-[#F7CF13] shadow-[0_0_0_3px_rgba(247,207,19,0.25)]'
                      : 'border-white/20 bg-white/[0.14]'
                }`}
              >
                {Icon && (
                  <Icon
                    size={18}
                    color={isActive || isDone ? ICON_ON : ICON_OFF}
                    className="transition-colors duration-300"
                  />
                )}
              </div>

              {/* label */}
              <span
                className={`mt-4 text-center text-[0.67rem] uppercase tracking-[0.07em] leading-[1.3] transition-colors duration-300 ${
                  isActive
                    ? 'font-bold text-[#F7CF13]'
                    : isDone
                      ? 'font-medium text-[rgba(247,207,19,0.65)]'
                      : 'font-medium text-white/38'
                }`}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>

      {/* MOBILE STEPPER */}
      <div className="sm:hidden">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[0.85rem] font-bold text-[#F7CF13]">
            {steps[activeStep]}
          </span>
          <span className="text-[0.72rem] font-semibold text-white/38">
            {activeStep + 1} / {steps.length}
          </span>
        </div>

        <div className="mb-3.5 flex gap-3px">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-0.75 flex-1 rounded-full transition-colors duration-300 ${
                i < activeStep
                  ? 'bg-[#F7CF13]'
                  : i === activeStep
                    ? 'bg-[rgba(247,207,19,0.45)]'
                    : 'bg-white/15'
              }`}
            />
          ))}
        </div>

        <div className="flex justify-between">
          {steps.map((label, i) => {
            const Icon = ICONS[i];
            const isDone = i < activeStep;
            const isActive = i === activeStep;

            return (
              <div
                key={i}
                onClick={() => isDone && onStepClick?.(i)}
                className={`group/mini relative flex h-8 w-8 items-center justify-center rounded-full border-[1.5px] border-transparent transition-all duration-200 ${
                  isDone
                    ? 'cursor-pointer bg-[#F7CF13]'
                    : isActive
                      ? 'scale-[1.15] cursor-default border-[rgba(247,207,19,0.25)] bg-[#F7CF13] shadow-[0_0_10px_rgba(247,207,19,0.25)]'
                      : 'cursor-default bg-white/10'
                }`}
              >
                {Icon && (
                  <Icon
                    size={14}
                    color={isDone || isActive ? ICON_ON : 'rgba(255,255,255,0.35)'}
                  />
                )}
                <span className="pointer-events-none absolute bottom-[calc(100%+6px)] left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-[rgba(5,50,97,0.92)] px-2 py-0.75 text-[0.65rem] font-semibold text-white opacity-0 transition-opacity duration-150 group-hover/mini:opacity-100">
                  {label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RegistrationStepper;