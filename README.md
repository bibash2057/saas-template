# Frontend Developer Guide

Short rules for the team. Read it once, keep it open while you code.

## 1. Folder Structure

```text
src/
├── component/   # shared UI (not shadcn base files)
├── hook/        # shared hooks (useFetch, usePost, useLanguage)
├── lib/         # helpers, setups (tenant, table utils)
├── types/       # global types
├── store/       # global Zustand stores
├── http/        # axios clients (api.ts)
├── const/       # constants
├── i18n/        # i18n config + locales
└── page/
    └── [page]/
        ├── column/      # table columns
        ├── component/   # page-only components
        ├── store/       # page-only store
        └── types/       # page-only types
```

Rule: used in **one page** → keep it inside that page. Used in **2+ pages** → move it to the global folder.

## 2. Naming

| What               | Style               | Example                    |
| ------------------ | ------------------- | -------------------------- |
| Component file     | `PascalCase`        | `ProductForm.tsx`          |
| Hook file          | `use` + `camelCase` | `useFetch.ts`              |
| Utility file       | `camelCase`         | `formatters.ts`            |
| Page folder        | lowercase           | `product/`                 |
| Variable, function | `camelCase`         | `formatCurrency`           |
| Type, interface    | `PascalCase`        | `ProductVariant`           |
| Constant           | `UPPER_SNAKE_CASE`  | `DEFAULT_MESSAGE`          |
| Boolean            | `is / has / should` | `isPending`, `hasNextPage` |
| Asset file         | `kebab-case`        | `empty-state.png`          |

## 3. UI Rules

- **Use shadcn/ui first.** If shadcn has the component (Button, Select, Checkbox, Tooltip, Pagination, Skeleton, ContextMenu...), use it. Do **not** build your own.
- Only build a custom component when shadcn has nothing for it.
- Style with **Tailwind** in `className`. Use design tokens (`bg-background`, `text-muted-foreground`, `border`). Never hardcode colors or hex values.
- Icons: **`lucide-react`** only. No raw SVG or PNG icons.

```tsx
import { Search } from "lucide-react";
import { Button } from "#components/ui/button";

<Button variant="ghost" size="icon">
  <Search className="size-4" />
</Button>;
```

## 4. Data Hooks (TanStack Query)

All API calls go through our hooks. **Never call axios directly in a component.**

| Hook        | Use for      | Method |
| ----------- | ------------ | ------ |
| `useFetch`  | read data    | GET    |
| `usePost`   | create       | POST   |
| `usePut`    | full update  | PUT    |
| `usePatch`  | small update | PATCH  |
| `useDelete` | remove       | DELETE |

**Arguments:** `(url, key, ...)`. The `key` is the cache name. Same key = same cache.

**Scope:** `"tenant"` is the default. Use `"main"` for shared/main API calls.

```tsx
// Read
const { data, isLoading } = useFetch<User[]>("/users", ["users"]);

// Read from main API
const { data: plans } = useFetch<Plan[]>(
  "/plans",
  ["plans"],
  {},
  { scope: "main" },
);

// Create
const create = usePost<BaseResponse, CreateUserPayload>("/users", ["users"]);
create.mutate({ name: "Ram" });

// Delete  ->  DELETE /users/5
const del = useDelete<BaseResponse, number>("/users", ["users"]);
del.mutate(5);
```

**Mutations do this for you (do not repeat it):**

- Show a success or error toast.
- Refresh every query that uses the same `key`.

Need extra work after success? Pass `onSuccess` in `options`. It runs after the toast and refresh.

```tsx
usePost<BaseResponse, CreateUserPayload>("/users", ["users"], {
  onSuccess: () => closeModal(),
});
```

**Tips**

- Put filters in the key: `["users", page, search]`, so each page has its own cache.
- Use `enabled: false` to wait for something before fetching.
- `useFetch` caches for 5 minutes by default.

## 5. State Management

| Scope               | Tool                      | Use for                           |
| ------------------- | ------------------------- | --------------------------------- |
| One component       | `useState` / `useReducer` | inputs, toggles, modal open       |
| Shared client state | **Zustand**               | auth, settings, calendar, wizards |
| Server data         | **TanStack Query**        | anything from the API             |
| Theme / language    | Context / i18n            | dark mode, language               |

Golden rule: **API data lives in TanStack Query. Never copy it into Zustand.**

To keep data after refresh, use the `persist` middleware (see `useAuth`).

## 6. DataTable

For any list page, use our `DataTable`. Do not build a new table.

**What you get for free:**

- Search box (press `/` to focus)
- Server-side pagination
- Drag to reorder columns, drag edge to resize
- Pin columns (start / end) and rows (top / bottom)
- Show / hide columns
- Right-click menus: copy cell, row, column, or row as JSON
- Loading skeleton and "No Data Found" state

**Props**

| Prop                   | Needed | What it does                         |
| ---------------------- | ------ | ------------------------------------ |
| `data`                 | yes    | rows for this page                   |
| `columns`              | yes    | column list (`DataTableColumn<T>[]`) |
| `rowCount`             | yes    | total rows on the server             |
| `pagination`           | yes    | `{ pageIndex, pageSize }`            |
| `onPaginationChange`   | yes    | state setter for pagination          |
| `globalFilter`         | yes    | search text                          |
| `onGlobalFilterChange` | yes    | search text setter                   |
| `isLoading`            | no     | shows skeleton rows                  |
| `getRowId`             | no     | unique id per row                    |
| `rightAlignedColumns`  | no     | column ids to right-align (money)    |
| `toolbarRight`         | no     | extra buttons next to search         |

**Page example** (adjust the import path and API response shape to your project)

```tsx
// src/page/user/column/userColumns.tsx
import type { DataTableColumn } from "@/component/DataTable";
import type { User } from "../types/user";

export const userColumns: DataTableColumn<User>[] = [
  { accessorKey: "name", header: "Name", size: 200 },
  { accessorKey: "email", header: "Email", size: 240 },
  { accessorKey: "balance", header: "Balance", size: 120 },
];
```

```tsx
// src/page/user/User.tsx
import React from "react";
import type { PaginationState } from "@tanstack/react-table";
import DataTable from "@/component/DataTable";
import useFetch from "@/hook/useFetch";
import { userColumns } from "./column/userColumns";

const User = () => {
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [search, setSearch] = React.useState("");

  const { data, isLoading } = useFetch<{ rows: User[]; total: number }>(
    "/users",
    ["users", pagination.pageIndex, pagination.pageSize, search],
    {
      params: {
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        search,
      },
    },
  );

  return (
    <DataTable
      data={data?.rows ?? []}
      columns={userColumns}
      rowCount={data?.total ?? 0}
      pagination={pagination}
      onPaginationChange={setPagination}
      globalFilter={search}
      onGlobalFilterChange={setSearch}
      isLoading={isLoading}
      getRowId={(row) => String(row.id)}
      rightAlignedColumns={["balance"]}
    />
  );
};
```

**Rules**

- Pagination and search are **server-side**. Send them to the API, put them in the query key.
- Always pass `getRowId` when rows have an id.
- Changing the search resets the page to 1. The table does this for you.
- Column files go in `page/[page]/column/`.

## 7. Translation (i18n)

We support **English (`en`)** and **Nepali (`ne`)**. No text is hardcoded in the UI. Every label goes through `t()`.

**Files**

- Setup: `src/i18n/config.ts`, `src/i18n/index.ts`
- Texts: `src/i18n/locales/{en|ne}/{namespace}.json`
- Namespaces: `common`, `nav`, `auth`, `settings`, `table`, `validation`, `invoices`

**Use it**

```tsx
import { useTranslation } from "react-i18next";

const { t } = useTranslation("invoices");

<h1>{t("title")}</h1>
<span>{t("pagination.summary", { from: 1, to: 10, count: 50 })}</span>
```

**Add a new text**

1. Add the key in **both** `en` and `ne` JSON files.
2. Use `t("your.key")`.
3. In dev, a missing key shows a console warning. Fix it.

**Add a new namespace**

1. Add the name to `NAMESPACES` in `config.ts`.
2. Create `locales/en/name.json` and `locales/ne/name.json`.
3. Add it to the `Resources` type so TypeScript knows the keys.

**Forms:** call `useRevalidateOnLanguageChange(form)` so validation messages change language after a failed submit.

```tsx
const form = useForm<FormValues>({ resolver: zodResolver(schema) });
useRevalidateOnLanguageChange(form);
```

## 8. Nepali Calendar

We use the `nepali-calendar` package (BS dates).

- Every language has a `calendarLanguage` (`en` → `en`, `ne` → `np`) in `LANGUAGE_META`.
- When you call `setLanguage()`, it **auto-updates** the calendar language in `useGeneralSettings` and `useCalendarStore`. **Do not set it by hand.**
- Nepali numbers (देवनागरी) come from `numberingSystem: "deva"` and `intlLocale: "ne-NP"`. Use `Intl` with these values for dates and numbers.

```tsx
const { language, meta } = useLanguage();

new Intl.NumberFormat(meta.intlLocale, {
  numberingSystem: meta.numberingSystem,
}).format(12500);
```

- Any date picker must follow `calendarLanguage` from the calendar store.

## 9. Git

**Branch** (from `dev`, never push to `dev`): `type/short-description`

- Good: `feat/offline-sync`, `fix/scanner-crash`
- Bad: `my-branch`, `Fix_Bug`

**Commit:** `type(scope): summary` (imperative, lowercase, no period)

- Types: `feat`, `fix`, `perf`, `refactor`, `reliability`, `security`, `test`, `chore`
- Good: `fix(scanner): handle permission denial`
- Bad: `Update code`, `fixed bug.`
- One commit = one change.

**Pull Request**

- Small, one purpose.
- Write: **What / Why**, **How**, **Testing**, **Screenshots** (for UI).
- Needs 1+ approval. Use `nit:` for optional comments.
- Rebase on `dev` → **Squash and merge** → delete branch.

## 10. Before You Open a PR

- [ ] Used shadcn components (no custom copy)
- [ ] Used `useFetch` / `usePost` etc. (no direct axios)
- [ ] API data is not copied into Zustand
- [ ] List pages use `DataTable`
- [ ] No hardcoded text, added `en` and `ne` keys
- [ ] No hardcoded colors, used Tailwind tokens
- [ ] File and branch names follow the rules

## Links

- [React Router](https://reactrouter.com/start/data/routing)
- [Zustand](https://zustand.docs.pmnd.rs/learn/getting-started/introduction) · [Persist](https://zustand.docs.pmnd.rs/integrations/persisting-store-data)
- [TanStack Query](https://tanstack.com/query/latest) · [TanStack Table](https://tanstack.com/table/latest)
- [shadcn/ui](https://ui.shadcn.com)
- [Zod](https://zod.dev/) · [react-hook-form](https://react-hook-form.com/)
- [react-i18next](https://react.i18next.com/)
- [Tailwind CSS](https://tailwindcss.com/docs) · [lucide-react](https://lucide.dev/guide/packages/lucide-react)
# saas-template
