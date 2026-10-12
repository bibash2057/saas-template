/**
 * Nepali Calendar (Bikram Sambat) — a self-contained package split into a
 * headless logic layer and a set of headless React state hooks.
 *
 *   import { adToBs, useNepaliCalendar } from '@/packages/nepali-calendar';
 *
 * - `core`  — pure TS converter, grid generator, formatters, datasets. Zero
 *   dependencies; safe on the server or client.
 * - `hooks` — headless React state hooks (no UI).
 *
 * The web-native UI (calendar panel + date-picker field) lives in
 * `@/components/ui` so it can compose the app's design-system primitives; only
 * the calendar logic below is shared/portable.
 */

// Logic layer (headless core) — pure TypeScript.
export * from './core';

// Headless React hooks — state only, no UI.
export * from './hooks';
