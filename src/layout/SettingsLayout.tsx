import { useCollapseSidebar } from "#hooks/useCollapseSidebar";
import { cn } from "cn";
import { ArrowLeft, Building2, CreditCard, Settings, User } from "lucide-react";
import { Link, NavLink, Outlet } from "react-router";
import { useTranslation } from "react-i18next";

const settingsNav = [
  { labelKey: "nav.general", to: "/settings/general", icon: Settings },
  { labelKey: "nav.myAccount", to: "/settings/my-account", icon: User },
  {
    labelKey: "nav.businessProfile",
    to: "/settings/business-profile",
    icon: Building2,
  },
  {
    labelKey: "nav.subscription",
    to: "/settings/subscription",
    icon: CreditCard,
  },
] as const;

const SettingsLayout = () => {
  const { t } = useTranslation("settings");
  useCollapseSidebar();
  return (
    <div className="-mx-6 -mt-4 -mb-12 flex h-[calc(100dvh-4rem)] min-h-0 flex-col md:flex-row">
      <aside className="bg-background shrink-0 border-b md:w-72 md:border-r md:border-b-0">
        <div className="flex items-center gap-3 px-4 py-4 md:px-6 md:py-5">
          <Link
            to="/"
            className="text-muted-foreground hover:text-foreground"
            aria-label={t("layout.back")}
          >
            <ArrowLeft className="size-5" />
          </Link>
          <h2 className="text-lg font-semibold">{t("layout.title")}</h2>
        </div>

        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 md:flex-col md:overflow-visible md:pb-0">
          {settingsNav.map(({ labelKey, to, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-sm px-2.5 py-2 text-sm font-medium whitespace-nowrap transition-colors",
                  isActive
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                )
              }
            >
              <Icon className="size-4" />
              {t(labelKey)}
            </NavLink>
          ))}
        </nav>
      </aside>

      <section className="bg-muted/30 min-h-0 min-w-0 flex-1 overflow-y-auto p-6">
        <div className="max-w-3xl">
          <Outlet />
        </div>
      </section>
    </div>
  );
};

export default SettingsLayout;
