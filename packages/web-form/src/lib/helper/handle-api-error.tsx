import {ApiError} from "@maas/core-api";
import {FieldValues, Path, UseFormReturn} from "react-hook-form";

type ParameterError = string | { code: string; message?: string };

const formatErrorMessage = (errors: ParameterError[]): string => {
  return errors
    .map((err) => {
      if (typeof err === 'string') {
        return err;
      }
      return err.message || err.code;
    })
    .join(', ');
};

export const handleApiError = <T extends FieldValues>(
  error: ApiError,
  form: UseFormReturn<T>
): void => {
  if (error.parametersErrors) {
    Object.entries(error.parametersErrors).forEach(([field, errors]) => {
      form.setError(field as Path<T>, {
        type: 'server',
        message: formatErrorMessage(errors as ParameterError[]),
      });
    });
  }
}
