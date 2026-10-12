import { useTranslation } from "react-i18next";
import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription,
} from "#components/ui/card";
import {
  Select,
  SelectItem,
  SelectValue,
  SelectContent,
  SelectTrigger,
} from "#components/ui/select";
import { Label } from "#components/ui/label";
import { Separator } from "#components/ui/separator";
import {
  useGeneralSettings,
  type CurrencyPosition,
  type NumberFormat,
} from "../store/useGeneralSettings";
import { currencySymbol } from "@/lib/formatMoney";
import { useIntlFormat } from "@/lib/intl";

// Codes/symbols are universal, so these labels are not translated.
const CURRENCIES = [
  { value: "NPR", label: "Rs. (NPR)" },
  { value: "INR", label: "₹ (INR)" },
  { value: "USD", label: "$ (USD)" },
  { value: "EUR", label: "€ (EUR)" },
  { value: "GBP", label: "£ (GBP)" },
];

const CurrencySettings = () => {
  const { t } = useTranslation("settings");
  const { language, number } = useIntlFormat();

  const currency = useGeneralSettings((s) => s.currency);
  const currencyPosition = useGeneralSettings((s) => s.currencyPosition);
  const numberFormat = useGeneralSettings((s) => s.numberFormat);
  const update = useGeneralSettings((s) => s.update);

  // Symbol of the currently selected currency (NPR shows "रू" in Nepali).
  const symbol = currencySymbol(currency, language);
  const amount = number(100);

  const positions = [
    {
      value: "start",
      label: t("general.currency.positions.start", { symbol, amount }),
    },
    {
      value: "end",
      label: t("general.currency.positions.end", { symbol, amount }),
    },
  ];

  const numberFormats = [
    { value: "lakh", label: t("general.currency.numberFormats.lakh") },
    { value: "million", label: t("general.currency.numberFormats.million") },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("general.currency.title")}</CardTitle>
        <CardDescription>{t("general.currency.description")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <Label>{t("general.currency.currency")}</Label>
          <Select
            items={CURRENCIES}
            value={currency}
            onValueChange={(v) => v && update("currency", v)}
          >
            <SelectTrigger className="w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CURRENCIES.map((c) => (
                <SelectItem key={c.value} value={c.value}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Separator />

        <div className="flex items-center justify-between gap-4">
          <Label>{t("general.currency.position")}</Label>
          <Select
            items={positions}
            value={currencyPosition}
            onValueChange={(v) =>
              v && update("currencyPosition", v as CurrencyPosition)
            }
          >
            <SelectTrigger className="w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {positions.map((p) => (
                <SelectItem key={p.value} value={p.value}>
                  {p.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Separator />

        <div className="flex items-center justify-between gap-4">
          <Label>{t("general.currency.numberFormat")}</Label>
          <Select
            items={numberFormats}
            value={numberFormat}
            onValueChange={(v) =>
              v && update("numberFormat", v as NumberFormat)
            }
          >
            <SelectTrigger className="w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {numberFormats.map((n) => (
                <SelectItem key={n.value} value={n.value}>
                  {n.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};

export default CurrencySettings;
