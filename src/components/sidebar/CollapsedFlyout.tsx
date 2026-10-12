import { cn } from "cn";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
} from "#components/ui/dropdown-menu";
import { isPathActive, type NavItem } from "@/const/nav";
import { SidebarMenuButton, SidebarMenuItem } from "#components/ui/sidebar";

const CollapsedFlyout = ({
  item,
  pathname,
}: {
  item: NavItem;
  pathname: string;
}) => {
  const { t } = useTranslation("nav");
  const active = isPathActive(pathname, item.href);

  return (
    <SidebarMenuItem>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger
          openOnHover
          delay={50}
          closeDelay={150}
          render={<SidebarMenuButton isActive={active} />}
        >
          <item.icon />
          <span className="sr-only">{t(item.labelKey)}</span>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          side="right"
          align="start"
          sideOffset={10}
          className="min-w-52 rounded-sm p-1.5 shadow-lg"
        >
          <DropdownMenuGroup>
            <DropdownMenuLabel className="flex items-center gap-2 px-2.5 py-1.5 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
              <item.icon className="size-3.5" />
              {t(item.labelKey)}
            </DropdownMenuLabel>

            <DropdownMenuSeparator className="my-1" />

            {item.children!.map((child) => {
              const childActive = isPathActive(pathname, child.href);

              return (
                <DropdownMenuItem
                  key={child.href}
                  render={<Link to={child.href} />}
                  className={cn(
                    "group/item flex cursor-pointer items-center gap-2.5 rounded-sm px-2.5 py-2 text-sm transition-colors",
                    childActive
                      ? "bg-accent font-medium text-accent-foreground"
                      : "text-foreground/80",
                  )}
                >
                  <span
                    className={cn(
                      "size-1.5 shrink-0 rounded-sm transition-colors",
                      childActive
                        ? "bg-primary"
                        : "bg-muted-foreground/30 group-data-highlighted/item:bg-primary",
                    )}
                  />
                  {t(child.labelKey)}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  );
};

export default CollapsedFlyout;
