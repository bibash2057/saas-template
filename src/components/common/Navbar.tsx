import { Fragment } from "react";
import { Link, useLocation } from "react-router";
import { useTranslation } from "react-i18next";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "#components/ui/breadcrumb";
import { Separator } from "#components/ui/separator";
import { SidebarTrigger } from "#components/ui/sidebar";
import { breadcrumbsForPath } from "@/const/nav";
import { ModeToggle } from "./mode-toggle";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ModuleSearch } from "./ModuleSearch";

const Navbar = () => {
  const { t } = useTranslation("nav");
  const { pathname } = useLocation();
  const crumbs = breadcrumbsForPath(pathname);

  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b bg-background px-4">
      <SidebarTrigger className="-ml-1 text-muted-foreground" />
      <Separator orientation="vertical" className="h-5!" />
      <Breadcrumb>
        <BreadcrumbList>
          {crumbs.map((crumb, i) => {
            const isLast = i === crumbs.length - 1;
            return (
              <Fragment key={crumb.href}>
                {i > 0 && <BreadcrumbSeparator />}
                <BreadcrumbItem>
                  {isLast ? (
                    <BreadcrumbPage>{t(crumb.labelKey)}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink
                      render={<Link to={crumb.href}>{t(crumb.labelKey)}</Link>}
                    />
                  )}
                </BreadcrumbItem>
              </Fragment>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex flex-1 justify-center max-w-xs md:max-w-4xl mx-auto">
        <ModuleSearch />
      </div>
      <div className="ml-auto flex items-center gap-2">
        <LanguageSwitcher />
        <ModeToggle />
      </div>
    </header>
  );
};

export default Navbar;
