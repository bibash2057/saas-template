import {
  useSidebar,
  SidebarMenuSub,
  SidebarMenuItem,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "#components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "#components/ui/collapsible";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";
import CollapsedFlyout from "./CollapsedFlyout";
import { isPathActive, type NavItem } from "@/const/nav";

const SidebarEntry = ({
  item,
  pathname,
}: {
  item: NavItem;
  pathname: string;
}) => {
  const { t } = useTranslation(["nav", "common"]);
  const label = t(item.labelKey);
  const { state, isMobile } = useSidebar();
  const active = isPathActive(pathname, item.href);
  const [open, setOpen] = useState(active);

  useEffect(() => {
    if (active) setOpen(true);
  }, [active]);

  if (!item.children?.length) {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton
          isActive={active}
          tooltip={label}
          render={
            <Link to={item.href}>
              <item.icon />
              <span>{label}</span>
            </Link>
          }
        />
      </SidebarMenuItem>
    );
  }

  if (state === "collapsed" && !isMobile) {
    return <CollapsedFlyout item={item} pathname={pathname} />;
  }

  return (
    <Collapsible
      open={open}
      onOpenChange={setOpen}
      className="group/collapsible"
      render={<SidebarMenuItem />}
    >
      <SidebarMenuButton
        isActive={active}
        tooltip={label}
        render={
          <Link to={item.href} onClick={() => setOpen(true)}>
            <item.icon />
            <span>{label}</span>
          </Link>
        }
      />

      <CollapsibleTrigger render={<SidebarMenuAction />}>
        <ChevronRight className="transition-transform group-data-open/collapsible:rotate-90" />
        <span className="sr-only">
          {t("common:a11y.toggleSection", { name: label })}
        </span>
      </CollapsibleTrigger>

      <CollapsibleContent>
        <SidebarMenuSub>
          {item.children.map((child) => (
            <SidebarMenuSubItem key={child.href}>
              <SidebarMenuSubButton
                isActive={isPathActive(pathname, child.href)}
                render={<Link to={child.href}>{t(child.labelKey)}</Link>}
              />
            </SidebarMenuSubItem>
          ))}
        </SidebarMenuSub>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default SidebarEntry;
