import {
  useGeneralSettings,
  type GeneralSettings,
} from "@/page/settings/general/store/useGeneralSettings";
import i18n from "@/i18n";
import { LANGUAGE_META, toAppLanguage, type AppLanguage } from "@/i18n/config";
import { useLanguage } from "@/hooks/useLanguage";

export const SYMBOLS: Record<string, string> = {
  NPR: "Rs.",
  INR: "₹",
  USD: "$",
  EUR: "€",
  GBP: "£",
};

const LOCALIZED_SYMBOLS: Partial<Record<AppLanguage, Record<string, string>>> =
  {
    ne: { NPR: "रू" },
  };

export const currencySymbol = (code: string, language: AppLanguage) =>
  LOCALIZED_SYMBOLS[language]?.[code] ?? SYMBOLS[code] ?? code;

type MoneySettings = Pick<
  GeneralSettings,
  "currency" | "currencyPosition" | "numberFormat"
> & { language?: AppLanguage };

export const formatMoney = (amount: number, s: MoneySettings) => {
  const language = s.language ?? toAppLanguage(i18n.resolvedLanguage);
  const symbol = currencySymbol(s.currency, language);

  const grouping = s.numberFormat === "lakh" ? "en-IN" : "en-US";
  const locale = `${grouping}-u-nu-${LANGUAGE_META[language].numberingSystem}`;
  const value = amount.toLocaleString(locale, { maximumFractionDigits: 2 });
  return s.currencyPosition === "start"
    ? `${symbol} ${value}`
    : `${value} ${symbol}`;
};

export const useFormatMoney = () => {
  const currency = useGeneralSettings((s) => s.currency);
  const currencyPosition = useGeneralSettings((s) => s.currencyPosition);
  const numberFormat = useGeneralSettings((s) => s.numberFormat);
  const { language } = useLanguage();
  return (amount: number) =>
    formatMoney(amount, { currency, currencyPosition, numberFormat, language });
};

export const formatMoneyNow = (amount: number) => {
  const { currency, currencyPosition, numberFormat } =
    useGeneralSettings.getState();
  return formatMoney(amount, { currency, currencyPosition, numberFormat });
};
