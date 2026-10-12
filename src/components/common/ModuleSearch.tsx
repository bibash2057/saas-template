import {
  Command,
  CommandItem,
  CommandList,
  CommandInput,
  CommandGroup,
  CommandEmpty,
  CommandDialog,
  CommandShortcut,
  CommandSeparator,
} from "@/components/ui/command";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { NAV_GROUPS, type NavKey } from "@/const/nav";
import { Search, type LucideIcon } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React, { useCallback, useEffect, useMemo, useState } from "react";

type EntryType = "module" | "page";

interface SearchEntry {
  type: EntryType;
  labelKey: NavKey;
  href: string;
  icon: LucideIcon;
  parentKey?: NavKey;
}

type Filter = "all" | "modules" | "pages";

const RECENT_KEY = "module-search-recent";
const MAX_RECENT = 3;

const buildEntries = (): SearchEntry[] =>
  NAV_GROUPS.flatMap((group) =>
    group.items.flatMap((item): SearchEntry[] => [
      {
        type: "module",
        labelKey: item.labelKey,
        href: item.href,
        icon: item.icon,
      },
      ...(item.children ?? []).map(
        (child): SearchEntry => ({
          type: "page",
          labelKey: child.labelKey,
          href: child.href,
          icon: item.icon,
          parentKey: item.labelKey,
        }),
      ),
    ]),
  );

const ENTRIES = buildEntries();

const readRecent = (): string[] => {
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
};

const isMac = () =>
  typeof navigator !== "undefined" &&
  /Mac|iPhone|iPad|iPod/i.test(navigator.platform || navigator.userAgent);

export const ModuleSearch: React.FC = () => {
  const { t } = useTranslation("nav");
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [recent, setRecent] = useState<string[]>(readRecent);

  const modKey = useMemo(() => (isMac() ? "⌘" : "Ctrl"), []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) {
      setSearch("");
      setFilter("all");
    }
  };

  const handleSelect = useCallback(
    (href: string) => {
      const next = [href, ...recent.filter((h) => h !== href)].slice(
        0,
        MAX_RECENT,
      );
      setRecent(next);
      try {
        localStorage.setItem(RECENT_KEY, JSON.stringify(next));
      } catch {}
      handleOpenChange(false);
      navigate(href);
    },
    [recent, navigate],
  );

  const modules = ENTRIES.filter((e) => e.type === "module");
  const pages = ENTRIES.filter((e) => e.type === "page");
  const recentEntries = recent
    .map((href) => ENTRIES.find((e) => e.href === href))
    .filter((e): e is SearchEntry => Boolean(e));

  const showRecent = !search && filter === "all" && recentEntries.length > 0;
  const showModules = filter === "all" || filter === "modules";
  const showPages = filter === "all" || filter === "pages";

  const renderItem = (entry: SearchEntry, valuePrefix = "") => {
    const label = t(entry.labelKey);
    const parent = entry.parentKey ? t(entry.parentKey) : null;
    const Icon = entry.icon;

    return (
      <CommandItem
        key={`${valuePrefix}${entry.href}`}
        value={`${valuePrefix}${entry.href}`}
        keywords={[label, parent ?? "", entry.href]}
        onSelect={() => handleSelect(entry.href)}
        className="gap-3 px-2 py-2"
      >
        <span className="flex size-8 shrink-0 items-center justify-center border bg-background">
          <Icon className="size-4 text-muted-foreground" />
        </span>
        <span className="flex min-w-0 flex-col">
          <span className="truncate text-sm font-medium">{label}</span>
          {parent && (
            <span className="truncate text-xs text-muted-foreground">
              in {parent}
            </span>
          )}
        </span>
        <CommandShortcut className="font-normal tracking-normal">
          {entry.href}
        </CommandShortcut>
      </CommandItem>
    );
  };

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setOpen(true)}
        className="h-9 w-64 justify-between px-2.5 text-sm font-normal text-muted-foreground"
      >
        <span className="flex items-center gap-2">
          <Search className="size-4" />
          {t("searchPlaceholder", "Search modules/pages...")}
        </span>
        <KbdGroup>
          <Kbd>{modKey}</Kbd>
          <Kbd>K</Kbd>
        </KbdGroup>
      </Button>
      <CommandDialog
        open={open}
        onOpenChange={handleOpenChange}
        className="top-1/2! -translate-y-1/2! sm:max-w-2xl"
      >
        <Command>
          <CommandInput
            value={search}
            onValueChange={setSearch}
            placeholder={t("searchPlaceholder", "Search modules/pages...")}
          />

          <div className="border-b px-3 py-2">
            <Tabs value={filter} onValueChange={(v) => setFilter(v as Filter)}>
              <TabsList className="h-8">
                <TabsTrigger value="all" className="text-xs">
                  {t("all", "All")}
                </TabsTrigger>
                <TabsTrigger value="modules" className="text-xs">
                  {t("modules", "Modules")}
                </TabsTrigger>
                <TabsTrigger value="pages" className="text-xs">
                  {t("pages", "Pages")}
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <CommandList className="max-h-[28rem] min-h-[28rem]">
            <CommandEmpty>{t("noResults", "No pages found")}</CommandEmpty>

            {showRecent && (
              <>
                <CommandGroup heading={t("recent", "Recent")}>
                  {recentEntries.map((e) => renderItem(e, "recent:"))}
                </CommandGroup>
                <CommandSeparator />
              </>
            )}

            {showModules && (
              <CommandGroup heading={t("modules", "Modules")}>
                {modules.map((e) => renderItem(e))}
              </CommandGroup>
            )}

            {showModules && showPages && <CommandSeparator />}

            {showPages && (
              <CommandGroup heading={t("pages", "Pages")}>
                {pages.map((e) => renderItem(e))}
              </CommandGroup>
            )}
          </CommandList>

          <div className="flex items-center gap-4 border-t px-3 py-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <KbdGroup>
                <Kbd>↑</Kbd>
                <Kbd>↓</Kbd>
              </KbdGroup>
              {t("navigate", "Navigate")}
            </span>
            <span className="flex items-center gap-1.5">
              <Kbd>↵</Kbd>
              {t("open", "Open")}
            </span>
            <span className="ml-auto flex items-center gap-1.5">
              <Kbd>esc</Kbd>
              {t("close", "Close")}
            </span>
          </div>
        </Command>
      </CommandDialog>
    </>
  );
};

export default ModuleSearch;
