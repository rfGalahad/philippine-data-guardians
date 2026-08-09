import type { ValidationRule } from "@/hooks/useForm";

/**
 * Fails if the value is null, undefined, an empty string, or whitespace-only.
 */
export const required =
  (message = "This field is required"): ValidationRule<unknown> =>
  (value) => {
    const isEmpty =
      value === undefined ||
      value === null ||
      (typeof value === "string" && value.trim() === "") ||
      (Array.isArray(value) && value.length === 0);
    return isEmpty ? message : undefined;
  };

/**
 * Fails if the value does not match another field's value.
 * Useful for confirm-password fields.
 *
 * @example
 * confirmPassword: [matches("password", "Passwords must match")]
 */
export const matches =
  (targetField: string, message?: string): ValidationRule<unknown> =>
  (value, allValues) => {
    if (value !== allValues[targetField]) {
      return message ?? `Must match ${targetField}`;
    }
    return undefined;
  };

/**
 * Fails if the value is not in the provided list of accepted values.
 */
export const oneOf =
  <T>(accepted: T[], message?: string): ValidationRule<T> =>
  (value) => {
    if (!accepted.includes(value)) {
      return message ?? `Must be one of: ${accepted.join(", ")}`;
    }
    return undefined;
  };

/**
 * Wraps an arbitrary predicate function as a validator.
 *
 * @example
 * custom((v) => v !== "admin", "Username is reserved")
 */
export const custom =
  <T>(predicate: (value: T) => boolean, message: string): ValidationRule<T> =>
  (value) =>
    predicate(value) ? undefined : message;