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
  DATE_FORMATS,
  type CalendarType,
  type DateFormat,
} from "../store/useGeneralSettings";
import { formatDate, todayIso } from "@/lib/formatDate";
import type { CalendarLanguage } from "nepali-calendar";

// Endonyms: deliberately NOT translated, so users can always find their own language.
const LANGUAGES = [
  { value: "en", label: "English" },
  { value: "np", label: "नेपाली" },
];

const CalendarSettings = () => {
  const { t } = useTranslation("settings");
  const CALENDARS = [
    { value: "BS", label: t("general.calendar.calendars.BS") },
    { value: "AD", label: t("general.calendar.calendars.AD") },
  ];
  const calendar = useGeneralSettings((s) => s.calendar);
  const dateFormat = useGeneralSettings((s) => s.dateFormat);
  const calendarLanguage = useGeneralSettings((s) => s.calendarLanguage);
  const update = useGeneralSettings((s) => s.update);

  const today = todayIso();
  const preview = (f: DateFormat) =>
    formatDate(today, { calendar, dateFormat: f, calendarLanguage });
  const formatItems = DATE_FORMATS.map((f) => ({
    value: f,
    label: `${f}  (${preview(f)})`,
  }));

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>{t("general.calendar.title")}</CardTitle>
          <CardDescription>{t("general.calendar.description")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <Label>{t("general.calendar.calendar")}</Label>
            <Select
              items={CALENDARS}
              value={calendar}
              onValueChange={(v) => v && update("calendar", v as CalendarType)}
            >
              <SelectTrigger className="w-52">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CALENDARS.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Separator />

          <div className="flex items-center justify-between gap-4">
            <Label>{t("general.calendar.dateFormat")}</Label>
            <Select
              items={formatItems}
              value={dateFormat}
              onValueChange={(v) => v && update("dateFormat", v as DateFormat)}
            >
              <SelectTrigger className="w-64">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {formatItems.map((f) => (
                  <SelectItem key={f.value} value={f.value}>
                    {f.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {calendar === "BS" && (
            <>
              <Separator />
              <div className="flex items-center justify-between gap-4">
                <Label>{t("general.calendar.bsLanguage")}</Label>
                <Select
                  items={LANGUAGES}
                  value={calendarLanguage}
                  onValueChange={(v) =>
                    v && update("calendarLanguage", v as CalendarLanguage)
                  }
                >
                  <SelectTrigger className="w-52">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LANGUAGES.map((l) => (
                      <SelectItem key={l.value} value={l.value}>
                        {l.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          <Separator />
          <p className="text-sm text-muted-foreground">
            {t("general.calendar.preview")}{" "}
            <span className="font-medium text-foreground">
              {preview(dateFormat)}
            </span>
          </p>
        </CardContent>
      </Card>
    </>
  );
};

export default CalendarSettings;
