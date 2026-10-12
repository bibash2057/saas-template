import {
  Sidebar,
  SidebarRail,
  SidebarMenu,
  SidebarGroup,
  SidebarHeader,
  SidebarContent,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "#components/ui/sidebar";
import { NAV_GROUPS } from "@/const/nav";
import SidebarEntry from "./SidebarEntry";
import { Link, useLocation } from "react-router";
import { useTranslation } from "react-i18next";

const AppSidebar = () => {
  const { t } = useTranslation(["nav", "common"]);
  const { pathname } = useLocation();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="h-14 justify-center px-3">
        <Link
          to="/dashboard"
          className="flex items-center gap-2.5 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-primary text-[13px] font-semibold text-primary-foreground">
            E
          </span>
          <span className="truncate text-sm font-semibold tracking-tight group-data-[collapsible=icon]:hidden">
            {t("common:appName")}
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent className="gap-0 pt-1">
        {NAV_GROUPS.map((group, index) => (
          <SidebarGroup key={group.labelKey ?? index} className="py-1.5">
            {group.labelKey && (
              <SidebarGroupLabel>{t(group.labelKey)}</SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarEntry
                    key={item.labelKey}
                    item={item}
                    pathname={pathname}
                  />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
};

export default AppSidebar;
