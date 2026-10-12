import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription,
} from "#components/ui/card";
import { cn } from "cn";
import { useTranslation } from "react-i18next";
import { Check, Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "#components/common/theme-provider";

const THEMES = [
  { value: "light", icon: Sun },
  { value: "dark", icon: Moon },
  { value: "system", icon: Monitor },
] as const;

const LAYERS = {
  light: [false],
  dark: [true],
  system: [false, true],
} as const;

const Appearance = () => {
  const { t } = useTranslation(["settings", "common"]);
  const { theme, setTheme } = useTheme();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("settings:general.appearance.title")}</CardTitle>
        <CardDescription>
          {t("settings:general.appearance.description")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          {THEMES.map(({ value, icon: Icon }) => {
            const selected = theme === value;

            return (
              <button
                key={value}
                type="button"
                aria-pressed={selected}
                onClick={() => setTheme(value)}
                className="group text-left outline-none"
              >
                <div
                  className={cn(
                    "relative h-24 overflow-hidden rounded-lg border-2 transition-colors",
                    selected
                      ? "border-primary"
                      : "border-border group-hover:border-foreground/30",
                    "group-focus-visible:ring-2 group-focus-visible:ring-ring",
                  )}
                >
                  {LAYERS[value].map((dark) => (
                    <div
                      key={String(dark)}
                      className={cn(
                        "absolute inset-0 flex gap-1.5 p-2",
                        dark ? "bg-zinc-900" : "bg-zinc-100",
                      )}
                      style={
                        value === "system" && dark
                          ? { clipPath: "polygon(100% 0, 100% 100%, 0 100%)" }
                          : undefined
                      }
                    >
                      <div
                        className={cn(
                          "w-1/4 space-y-1 rounded p-1.5",
                          dark ? "bg-zinc-800" : "bg-white",
                        )}
                      >
                        <div className="h-1 rounded bg-primary" />
                        <div
                          className={cn(
                            "h-1 rounded",
                            dark ? "bg-zinc-600" : "bg-zinc-300",
                          )}
                        />
                        <div
                          className={cn(
                            "h-1 rounded",
                            dark ? "bg-zinc-600" : "bg-zinc-300",
                          )}
                        />
                      </div>

                      <div
                        className={cn(
                          "flex-1 space-y-1.5 rounded p-2",
                          dark ? "bg-zinc-800" : "bg-white",
                        )}
                      >
                        <div
                          className={cn(
                            "h-1.5 w-1/2 rounded",
                            dark ? "bg-zinc-500" : "bg-zinc-400",
                          )}
                        />
                        <div
                          className={cn(
                            "h-1 rounded",
                            dark ? "bg-zinc-700" : "bg-zinc-200",
                          )}
                        />
                        <div
                          className={cn(
                            "h-1 w-3/4 rounded",
                            dark ? "bg-zinc-700" : "bg-zinc-200",
                          )}
                        />
                      </div>
                    </div>
                  ))}

                  {selected && (
                    <span className="absolute bottom-2 left-2 flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <Check className="size-3" />
                    </span>
                  )}
                </div>

                <div className="mt-2 flex items-center gap-1.5 text-sm font-medium">
                  <Icon className="size-4 text-muted-foreground" />
                  {t(`common:theme.${value}`)}
                </div>
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default Appearance;
