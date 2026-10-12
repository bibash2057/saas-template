import { useEffect } from "react";
import type { FieldValues, UseFormReturn } from "react-hook-form";
import { useLanguage } from "./useLanguage";

export function useRevalidateOnLanguageChange<T extends FieldValues>(
  form: UseFormReturn<T>,
) {
  const { language } = useLanguage();
  const { isSubmitted } = form.formState;
  const { trigger } = form;

  useEffect(() => {
    if (isSubmitted) void trigger();
  }, [language]);
}
