"use client";
import { createContext, useContext, useState, ReactNode } from "react";

interface LanguageContextType {
  language: "en" | "de";
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
    const [language, setLanguage] = useState<"en" | "de">(() => {
        const storedLang = typeof window !== "undefined" ? localStorage.getItem("language") : null;
        
        // hardcoden von "de" und "en". Wenn man noch eine Sprache hinzufügen möchte, dann muss man das hier manuell machen
        return storedLang === "de" || storedLang === "en" ? storedLang : "en";
      });

  const toggleLanguage = () => {
    const newLang = language === "en" ? "de" : "en";
    setLanguage(newLang);
    localStorage.setItem("language", newLang);
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
