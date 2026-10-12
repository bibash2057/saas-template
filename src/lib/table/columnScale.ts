import React from "react";


export type ColumnLayout = {
  scale: number;
  extraWidth: number;
  lastColumnId: string | null;
};

export const DEFAULT_COLUMN_LAYOUT: ColumnLayout = {
  scale: 1,
  extraWidth: 0,
  lastColumnId: null,
};

export const ColumnLayoutContext = React.createContext<ColumnLayout>(
  DEFAULT_COLUMN_LAYOUT,
);

export const useColumnLayout = () => React.useContext(ColumnLayoutContext);
