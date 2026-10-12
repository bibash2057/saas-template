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
import { isAppLanguage } from "@/i18n/config";
import { LANGUAGE_OPTIONS, useLanguage } from "@/hooks/useLanguage";

const ITEMS = LANGUAGE_OPTIONS.map((l) => ({
  value: l.code,
  label: l.nativeLabel, 
}));

const LanguageSettings = () => {
  const { t } = useTranslation("settings");
  const { language, setLanguage } = useLanguage();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("general.language.title")}</CardTitle>
        <CardDescription>{t("general.language.description")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between gap-4">
          <Label>{t("general.language.label")}</Label>
          <Select
            items={ITEMS}
            value={language}
            onValueChange={(v) => isAppLanguage(v) && void setLanguage(v)}
          >
            <SelectTrigger className="w-52">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ITEMS.map((l) => (
                <SelectItem key={l.value} value={l.value} lang={l.value}>
                  {l.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <p className="text-sm text-muted-foreground">
          {t("general.language.calendarNote")}
        </p>
      </CardContent>
    </Card>
  );
};

export default LanguageSettings;
