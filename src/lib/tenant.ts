export type ApiScope = "main" | "tenant";

const BASE_DOMAIN: string = import.meta.env.VITE_BASE_DOMAIN ?? "localhost";
const API_PORT: string = import.meta.env.VITE_API_PORT ?? "";

export const getTenant = (): string | null => {
  const host = window.location.hostname; 
  if (host === BASE_DOMAIN) return null;

  if (host.endsWith(`.${BASE_DOMAIN}`)) {
    const sub = host.slice(0, -(BASE_DOMAIN.length + 1));
    return sub === "www" ? null : sub;
  }
  return null;
};

export const getApiUrl = (scope: ApiScope): string => {
  const { protocol } = window.location;
  const port = API_PORT ? `:${API_PORT}` : "";
  const tenant = getTenant();

  if (scope === "tenant" && tenant) {
    return `${protocol}//${tenant}.${BASE_DOMAIN}${port}`;
  }
  return `${protocol}//${BASE_DOMAIN}${port}`;
};

export const buildQueryKey = (
  scope: ApiScope,
  key: readonly (string | number)[],
): readonly (string | number)[] => [
  scope === "tenant" ? (getTenant() ?? "no-tenant") : "main",
  ...key,
];

export const redirectToTenant = (slug: string, path = "/") => {
  const { protocol, port } = window.location;
  const portPart = port ? `:${port}` : "";
  window.location.href = `${protocol}//${slug}.${BASE_DOMAIN}${portPart}${path}`;
};
