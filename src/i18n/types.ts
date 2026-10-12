import type common from "./locales/en/common.json";
import type nav from "./locales/en/nav.json";
import type auth from "./locales/en/auth.json";
import type settings from "./locales/en/settings.json";
import type table from "./locales/en/table.json";
import type validation from "./locales/en/validation.json";
import type invoices from "./locales/en/invoices.json";

export interface Resources {
  common: typeof common;
  nav: typeof nav;
  auth: typeof auth;
  settings: typeof settings;
  table: typeof table;
  validation: typeof validation;
  invoices: typeof invoices;
}
