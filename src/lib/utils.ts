import {
  useGeneralSettings,
  type GeneralSettings,
} from "@/page/settings/general/store/useGeneralSettings";

const SYMBOLS: Record<string, string> = {
  NPR: "Rs.",
  INR: "₹",
  USD: "$",
  EUR: "€",
  GBP: "£",
};

type MoneySettings = Pick<GeneralSettings, "currency" | "currencyPosition">;

export const formatMoney = (amount: number, s: MoneySettings) => {
  const symbol = SYMBOLS[s.currency] ?? s.currency;
  const value = amount.toLocaleString("en-IN");
  return s.currencyPosition === "start"
    ? `${symbol} ${value}`
    : `${value} ${symbol}`;
};

export const useFormatMoney = () => {
  const currency = useGeneralSettings((s) => s.currency);
  const currencyPosition = useGeneralSettings((s) => s.currencyPosition);
  return (amount: number) =>
    formatMoney(amount, { currency, currencyPosition });
};

export const formatMoneyNow = (amount: number) => {
  const { currency, currencyPosition } = useGeneralSettings.getState();
  return formatMoney(amount, { currency, currencyPosition });
};

// how to use the above code:
// const fmt = useFormatMoney();
// return <span>{fmt(invoice.total)}</span>;
