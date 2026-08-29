import { useState, useCallback } from 'react';

interface UseStepperReturn {
  activeStep: number;
  page: number;
  handleStepClick: (index: number) => void;
  handleBack: () => void;
  handleNext: () => void;
}

export const useStepper = (totalSteps: number, initialStep = 0): UseStepperReturn => {
  const [activeStep, setActiveStep] = useState<number>(initialStep);

  const handleStepClick = useCallback((index: number): void => {
    setActiveStep((prev) => (index < prev ? index : prev));
  }, []);

  const handleBack = useCallback((): void => {
    setActiveStep((prev) => Math.max(0, prev - 1));
  }, []);

  const handleNext = useCallback((): void => {
    setActiveStep((prev) => Math.min(totalSteps - 1, prev + 1));
  }, [totalSteps]);

  return {
    activeStep,
    page: activeStep + 1,
    handleStepClick,
    handleBack,
    handleNext,
  };
};

export default useStepper;