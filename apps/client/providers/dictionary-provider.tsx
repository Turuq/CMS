"use client";
import React, { createContext, useContext, ReactNode } from "react";

interface DictionaryContextProps {
  dictionary: Record<string, any>;
  locale: string;
}

const DictionaryContext = createContext<DictionaryContextProps | undefined>(
  undefined,
);

export const useDictionary = () => {
  const context = useContext(DictionaryContext);
  if (!context) {
    throw new Error("useDictionary must be used within a DictionaryProvider");
  }
  return context;
};

export const DictionaryProvider = ({
  dictionary,
  locale,
  children,
}: {
  dictionary: Record<string, any>;
  locale: string;
  children: ReactNode;
}) => {
  return (
    <DictionaryContext.Provider value={{ dictionary, locale }}>
      {children}
    </DictionaryContext.Provider>
  );
};
