import { useMemo } from "react";
import { LANGUAGE_META, type AppLanguage } from "@/i18n/config";
import { useLanguage } from "@/hooks/useLanguage";

export const intlTag = (language: AppLanguage, base?: string) =>
  `${base ?? LANGUAGE_META[language].intlLocale}-u-nu-${LANGUAGE_META[language].numberingSystem}`;

const cache = new Map<string, Intl.NumberFormat>();
const numberFormat = (tag: string, options?: Intl.NumberFormatOptions) => {
  const key = `${tag}|${JSON.stringify(options ?? {})}`;
  let fmt = cache.get(key);
  if (!fmt) cache.set(key, (fmt = new Intl.NumberFormat(tag, options)));
  return fmt;
};

export const formatNumber = (
  value: number,
  language: AppLanguage,
  options?: Intl.NumberFormatOptions,
) => numberFormat(intlTag(language), options).format(value);

export const formatCurrencyIntl = (
  value: number,
  currency: string,
  language: AppLanguage,
) =>
  numberFormat(intlTag(language), { style: "currency", currency }).format(
    value,
  );

export function useIntlFormat() {
  const { language } = useLanguage();
  return useMemo(
    () => ({
      language,
      number: (v: number, o?: Intl.NumberFormatOptions) =>
        formatNumber(v, language, o),
      currency: (v: number, code: string) =>
        formatCurrencyIntl(v, code, language),
    }),
    [language],
  );
}
