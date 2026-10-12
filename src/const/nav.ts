import {
  Banknote,
  BarChart3,
  Boxes,
  CalendarDays,
  FileText,
  FolderOpen,
  Landmark,
  LayoutDashboard,
  Receipt,
  Settings,
  ShoppingCart,
  Truck,
  Users,
  Wallet,
  Warehouse,
  type LucideIcon,
} from "lucide-react";
import type { ParseKeys } from "i18next";

export type NavKey = Extract<ParseKeys<"nav">, `items.${string}`>;
export type NavGroupKey = Extract<ParseKeys<"nav">, `groups.${string}`>;
export type CrumbKey = Extract<ParseKeys<"nav">, `breadcrumbs.${string}`>;

export type NavChild = { labelKey: NavKey; href: string };

export type NavItem = {
  labelKey: NavKey;
  href: string;
  icon: LucideIcon;
  children?: NavChild[];
};

export type NavGroup = { labelKey: NavGroupKey | null; items: NavItem[] };

export const NAV_GROUPS: NavGroup[] = [
  {
    labelKey: null,
    items: [
      {
        labelKey: "items.dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    labelKey: "groups.accounting",
    items: [
      {
        labelKey: "items.sales",
        href: "/accounting/sales",
        icon: Receipt,
        children: [
          { labelKey: "items.invoices", href: "/accounting/sales/invoices" },
          {
            labelKey: "items.paymentsReceived",
            href: "/accounting/sales/payments",
          },
          {
            labelKey: "items.creditNotes",
            href: "/accounting/sales/credit-notes",
          },
        ],
      },
      {
        labelKey: "items.purchases",
        href: "/accounting/purchases",
        icon: Wallet,
        children: [
          { labelKey: "items.bills", href: "/accounting/purchases/bills" },
          {
            labelKey: "items.paymentsMade",
            href: "/accounting/purchases/payments",
          },
          {
            labelKey: "items.expenses",
            href: "/accounting/purchases/expenses",
          },
        ],
      },
      { labelKey: "items.ledger", href: "/accounting/ledger", icon: Landmark },
      {
        labelKey: "items.reports",
        href: "/accounting/reports",
        icon: BarChart3,
      },
    ],
  },
  {
    labelKey: "groups.hrPayroll",
    items: [
      {
        labelKey: "items.employees",
        href: "/hr/employees",
        icon: Users,
        children: [
          { labelKey: "items.allEmployees", href: "/hr/employees/list" },
          { labelKey: "items.departments", href: "/hr/employees/departments" },
          {
            labelKey: "items.designations",
            href: "/hr/employees/designations",
          },
        ],
      },
      {
        labelKey: "items.attendance",
        href: "/hr/attendance",
        icon: CalendarDays,
      },
      {
        labelKey: "items.payroll",
        href: "/hr/payroll",
        icon: Banknote,
        children: [
          { labelKey: "items.runPayroll", href: "/hr/payroll/run" },
          { labelKey: "items.payslips", href: "/hr/payroll/payslips" },
          {
            labelKey: "items.salaryStructures",
            href: "/hr/payroll/structures",
          },
        ],
      },
    ],
  },
  {
    labelKey: "groups.inventory",
    items: [
      { labelKey: "items.products", href: "/inventory/products", icon: Boxes },
      {
        labelKey: "items.warehouses",
        href: "/inventory/warehouses",
        icon: Warehouse,
      },
      {
        labelKey: "items.procurement",
        href: "/inventory/procurement",
        icon: Truck,
        children: [
          {
            labelKey: "items.suppliers",
            href: "/inventory/procurement/suppliers",
          },
          {
            labelKey: "items.purchaseOrders",
            href: "/inventory/procurement/orders",
          },
          {
            labelKey: "items.goodsReceipts",
            href: "/inventory/procurement/receipts",
          },
        ],
      },
    ],
  },
  {
    labelKey: "groups.billingPos",
    items: [
      {
        labelKey: "items.pointOfSale",
        href: "/pos/terminal",
        icon: ShoppingCart,
      },
      {
        labelKey: "items.billing",
        href: "/pos/billing",
        icon: FileText,
        children: [
          { labelKey: "items.salesInvoices", href: "/pos/billing/invoices" },
          { labelKey: "items.returns", href: "/pos/billing/returns" },
          { labelKey: "items.customers", href: "/pos/billing/customers" },
        ],
      },
    ],
  },
  {
    labelKey: "groups.dms",
    items: [
      { labelKey: "items.documents", href: "/dms/documents", icon: FolderOpen },
    ],
  },
  {
    labelKey: null,
    items: [{ labelKey: "items.settings", href: "/settings", icon: Settings }],
  },
];

export function isPathActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export type Crumb = { labelKey: NavKey | CrumbKey; href: string };

const SUBPAGE_LABELS: Record<string, CrumbKey> = {
  create: "breadcrumbs.create",
  edit: "breadcrumbs.edit",
};

const longestFirst = (a: { href: string }, b: { href: string }) =>
  b.href.length - a.href.length;

export const NAV_ITEMS: NavItem[] = NAV_GROUPS.flatMap((group) => group.items);

export function breadcrumbsForPath(pathname: string): Crumb[] {
  const item = NAV_ITEMS.filter((i) => isPathActive(pathname, i.href)).sort(
    longestFirst,
  )[0];
  if (!item) return [];

  const crumbs: Crumb[] = [{ labelKey: item.labelKey, href: item.href }];

  const child = item.children
    ?.filter((c) => isPathActive(pathname, c.href))
    .sort(longestFirst)[0];
  if (child) crumbs.push({ labelKey: child.labelKey, href: child.href });

  const deepest = crumbs[crumbs.length - 1];
  const leaf = pathname.split("/").filter(Boolean).at(-1) ?? "";
  if (pathname !== deepest.href && SUBPAGE_LABELS[leaf]) {
    crumbs.push({ labelKey: SUBPAGE_LABELS[leaf], href: pathname });
  }

  return crumbs;
}
