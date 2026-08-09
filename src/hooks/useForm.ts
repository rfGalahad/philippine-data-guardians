import { useState, useCallback, type ChangeEvent } from "react";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

type FieldValues = Record<string, unknown>;
export type ValidationRule<T> = (value: T, allValues: FieldValues) => string | undefined;
type ValidationRules<T extends FieldValues> = {
  [K in keyof T]?: ValidationRule<T[K]>[];
};
type FormErrors<T extends FieldValues> = Partial<Record<keyof T, string>>;
type FormTouched<T extends FieldValues> = Partial<Record<keyof T, boolean>>;

interface UseFormOptions<T extends FieldValues> {
  initialValues: T;
  validationRules?: ValidationRules<T>;
  onSubmit?: (values: T) => void | Promise<void>;
}
interface UseFormReturn<T extends FieldValues> {
  values: T;
  errors: FormErrors<T>;
  touched: FormTouched<T>;
  isSubmitting: boolean;
  isValid: boolean;
  handleChange: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
  handleBlur: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  setValue: <K extends keyof T>(field: K, value: T[K]) => void;
  setError: (field: keyof T, message: string) => void;
  reset: () => void;
}

// ─────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────

export const useForm = <T extends FieldValues>({
  initialValues,
  validationRules = {},
  onSubmit,
}: UseFormOptions<T>): UseFormReturn<T> => {
   
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<FormErrors<T>>({});
  const [touched, setTouched] = useState<FormTouched<T>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // VALIDATE SINGLE FIELD
  const validateField = useCallback(
    <K extends keyof T>(field: K, value: T[K]): string | undefined => {
      const rules = validationRules[field];
      if (!rules) return undefined;

      for (const rule of rules) {
        const error = rule(value, values);
        if (error) return error;
      }
      return undefined;
    },
    [validationRules, values]
  );

  // VALIDATE ALL FIELDS
  const validateAll = useCallback((): boolean => {
    const newErrors: FormErrors<T> = {};
    let valid = true;

    for (const field in validationRules) {
      const error = validateField(field as keyof T, values[field as keyof T]);
      if (error) {
        newErrors[field as keyof T] = error;
        valid = false;
      }
    }

    setErrors(newErrors);
    return valid;
  }, [validateField, validationRules, values]);

  const isValid = Object.keys(errors).length === 0;

  // CHANGE HANDLER
  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value, type } = e.target;
      const fieldValue =
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value;

      setValues((prev) => ({ ...prev, [name]: fieldValue }));

      if (touched[name as keyof T]) {
        const error = validateField(name as keyof T, fieldValue as T[keyof T]);
        setErrors((prev) => ({ ...prev, [name]: error }));
      }
    },
    [touched, validateField]
  );

  // BLUR HANDLER
  const handleBlur = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name } = e.target;
      setTouched((prev) => ({ ...prev, [name]: true }));

      const error = validateField(name as keyof T, values[name as keyof T]);
      setErrors((prev) => ({ ...prev, [name]: error }));
    },
    [validateField, values]
  );

  // SUBMIT HANDLER
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      // Mark all fields as touched so errors become visible
      const allTouched = Object.keys(initialValues).reduce(
        (acc, key) => ({ ...acc, [key]: true }),
        {} as FormTouched<T>
      );
      setTouched(allTouched);

      const valid = validateAll();
      if (!valid || !onSubmit) return;

      setIsSubmitting(true);
      try {
        await onSubmit(values);
      } finally {
        setIsSubmitting(false);
      }
    },
    [initialValues, onSubmit, validateAll, values]
  );

  // SET VALUE
  const setValue = useCallback(<K extends keyof T>(field: K, value: T[K]) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  }, []);

  // SET ERROR
  const setError = useCallback((field: keyof T, message: string) => {
    setErrors((prev) => ({ ...prev, [field]: message }));
  }, []);

  // RESET FORM
  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    handleChange,
    handleBlur,
    handleSubmit,
    setValue,
    setError,
    reset,
  };
};

// ─────────────────────────────────────────────
// Sample Usage
// ─────────────────────────────────────────────

// const form = useForm({
//   initialValues: { email: "", password: "" },
//   validationRules: {
//     email: [validators.required(), validators.email()],
//     password: [validators.required(), validators.minLength(8)],
//   },
//   onSubmit: async (values) => {
//     await api.login(values);
//   },
// });