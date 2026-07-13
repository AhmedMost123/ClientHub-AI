import type { FieldValues, Path, UseFormSetError } from "react-hook-form";

type ZodFlattenedErrors = {
  formErrors: string[];
  fieldErrors: Record<string, string[] | undefined>;
};

export function applyFlattenedFieldErrors<T extends FieldValues>(
  errors: ZodFlattenedErrors,
  setError: UseFormSetError<T>,
) {
  for (const [field, messages] of Object.entries(errors.fieldErrors)) {
    if (messages?.[0]) {
      setError(field as Path<T>, { message: messages[0] });
    }
  }
}
