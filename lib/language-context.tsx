"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { type Language, translations, type TranslationKey } from "./translations"

type LanguageContextType = {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: TranslationKey) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Inicializa com inglês, mas tenta carregar do localStorage se disponível
  const [language, setLanguageState] = useState<Language>("en")

  useEffect(() => {
    // Carrega a preferência de idioma do localStorage
    const savedLanguage = localStorage.getItem("language") as Language
    if (savedLanguage && (savedLanguage === "en" || savedLanguage === "pt")) {
      setLanguageState(savedLanguage)
    } else {
      // Tenta detectar o idioma do navegador
      const browserLang = navigator.language.split("-")[0]
      if (browserLang === "pt") {
        setLanguageState("pt")
      }
    }
  }, [])

  // Salva a preferência de idioma no localStorage
  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem("language", lang)
  }

  // Função para obter traduções
  const t = (key: TranslationKey): string => {
    return translations[language][key] || translations.en[key] || key
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}

