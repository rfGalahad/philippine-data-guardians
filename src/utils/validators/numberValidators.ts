import type { ValidationRule } from "@/hooks/useForm";

/**
 * Fails if the number is less than the minimum (inclusive).
 */
export const min =
  (minimum: number, message?: string): ValidationRule<number> =>
  (value) =>
    value < minimum ? message ?? `Must be at least ${minimum}` : undefined;

/**
 * Fails if the number exceeds the maximum (inclusive).
 */
export const max =
  (maximum: number, message?: string): ValidationRule<number> =>
  (value) =>
    value > maximum ? message ?? `Must be no more than ${maximum}` : undefined;

/**
 * Fails if the number is not within [min, max] (inclusive).
 */
export const between =
  (minimum: number, maximum: number, message?: string): ValidationRule<number> =>
  (value) =>
    value < minimum || value > maximum
      ? message ?? `Must be between ${minimum} and ${maximum}`
      : undefined;

/**
 * Fails if the number is not a safe integer (no decimals).
 */
export const integer =
  (message = "Must be a whole number"): ValidationRule<number> =>
  (value) =>
    Number.isInteger(value) ? undefined : message;

/**
 * Fails if the number is not greater than zero.
 */
export const positive =
  (message = "Must be a positive number"): ValidationRule<number> =>
  (value) =>
    value > 0 ? undefined : message;

/**
 * Fails if the number is not less than zero.
 */
export const negative =
  (message = "Must be a negative number"): ValidationRule<number> =>
  (value) =>
    value < 0 ? undefined : message;

/**
 * Fails if the number is not evenly divisible by the given step.
 *
 * @example
 * multipleOf(5, "Must be a multiple of 5")
 */
export const multipleOf =
  (step: number, message?: string): ValidationRule<number> =>
  (value) =>
    value % step === 0
      ? undefined
      : message ?? `Must be a multiple of ${step}`;

/**
 * Fails if the number has more decimal places than allowed.
 *
 * @example
 * precision(2, "Max 2 decimal places") // good for currency
 */
export const precision =
  (decimalPlaces: number, message?: string): ValidationRule<number> =>
  (value) => {
    const factor = Math.pow(10, decimalPlaces);
    return Math.round(value * factor) / factor === value
      ? undefined
      : message ?? `Must have no more than ${decimalPlaces} decimal places`;
  };