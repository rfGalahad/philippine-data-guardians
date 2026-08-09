
//-----------------------------------------------------------
// TYPES
//-----------------------------------------------------------

interface StepperProps {
  steps: string[];
  activeStep: number;
  onStepClick: (index: number) => void;
}

//-----------------------------------------------------------
// STEPPER
//-----------------------------------------------------------

export const Stepper = ({ 
  steps, 
  activeStep, 
  onStepClick 
}: StepperProps ) => {
  return (
    <div className="w-full pb-6">
      {/* Current step label */}
      <div className="mb-2 flex items-baseline justify-between">
        <span className="text-sm font-semibold text-gray-900">
          {steps[activeStep]}
        </span>
        <span className="text-xs text-gray-400">
          {activeStep + 1} / {steps.length}
        </span>
      </div>

      {/* Dot track */}
      <ol className="flex items-center w-full">
        {steps.map((label, index) => {
          const isCompleted = index < activeStep;
          const isActive = index === activeStep;
          const isClickable = isCompleted;

          return (
            <li
              key={label}
              className={`flex items-center ${
                index !== steps.length - 1 ? "flex-1" : ""
              }`}
            >
              <button
                type="button"
                disabled={!isClickable}
                onClick={() => isClickable && onStepClick(index)}
                aria-label={label}
                aria-current={isActive ? "step" : undefined}
                className={`h-2 w-2 shrink-0 rounded-full transition-colors
                  ${
                    isCompleted
                      ? "bg-emerald-600 cursor-pointer"
                      : isActive
                      ? "bg-emerald-600 ring-4 ring-emerald-100"
                      : "bg-gray-200 cursor-default"
                  }`}
              />

              {index !== steps.length - 1 && (
                <div
                  className={`mx-1 h-0.5 flex-1 rounded ${
                    isCompleted ? "bg-emerald-600" : "bg-gray-200"
                  }`}
                />
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
};

export default Stepper;