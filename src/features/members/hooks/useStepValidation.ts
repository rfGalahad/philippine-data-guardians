import { z } from 'zod';

import type { RegistrationValues } from "../schema";
import type { AppForm } from "./useRegistrationForm";


export function useStepValidation<T extends z.ZodObject<z.ZodRawShape>>(
  form: AppForm,
  schema: T,
) {
  return async () => {
    const fields = Object.keys(schema.shape) as (keyof RegistrationValues)[];
    const results = await Promise.all(
      fields.map((name) => form.validateField(name, 'submit'))
    );
    return !results.some((r) => r?.length);
  };
}