import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { isAppLanguage } from "@/i18n/config";
import { useLanguage } from "@/hooks/useLanguage";

const SUPPORTED_LANGUAGES = [
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "ne", label: "नेपाली", flag: "🇳🇵" },
] as const;

export function LanguageSwitcher() {
  const { t } = useTranslation();
  const { language, setLanguage } = useLanguage();

  const currentLang =
    SUPPORTED_LANGUAGES.find((item) => item.code === language) ||
    SUPPORTED_LANGUAGES[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" size="icon-lg" className="gap-1 text-xl">
            <span aria-hidden="true" className="text-3xl">
              {currentLang.flag}
            </span>
            <span className="sr-only">{t("language.switch")}</span>
          </Button>
        }
      />
      <DropdownMenuContent align="end">
        <DropdownMenuRadioGroup
          value={language}
          onValueChange={(value) => {
            if (isAppLanguage(value)) void setLanguage(value);
          }}
        >
          {SUPPORTED_LANGUAGES.map(({ code, label, flag }) => (
            <DropdownMenuRadioItem
              key={code}
              value={code}
              lang={code}
              className="cursor-pointer gap-2"
            >
              <span aria-hidden="true">{flag}</span>
              <span>{label}</span>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
