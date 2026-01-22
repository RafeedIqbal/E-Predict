"use client";

import React, { createContext, useState, ReactNode } from "react";

// Define the CSV data structure
export interface CsvData {
  original?: string;
  target?: string;
  xgb?: string;
  lstm?: string;
}

interface CsvContextType {
  csvData: CsvData | null;
  setCsvData: React.Dispatch<React.SetStateAction<CsvData | null>>;
}

export const CsvContext = createContext<CsvContextType>({
  csvData: null,
  setCsvData: () => { },
});

export const CsvProvider = ({ children }: { children: ReactNode }) => {
  const [csvData, setCsvData] = useState<CsvData | null>(null);

  return (
    <CsvContext.Provider value={{ csvData, setCsvData }}>
      {children}
    </CsvContext.Provider>
  );
};
