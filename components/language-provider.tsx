"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { type Language, createTranslationContext } from "@/lib/i18n"

type LanguageContextType = {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({
  children,
  initialLanguage = "fr",
}: { children: React.ReactNode; initialLanguage?: Language }) {
  const [language, setLanguage] = useState<Language>(initialLanguage)
  const translationContext = createTranslationContext(language)

  // Mettre à jour le contexte de traduction lorsque la langue change
  useEffect(() => {
    // Mettre à jour l'attribut lang de la balise html
    document.documentElement.lang = language
  }, [language])

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t: translationContext.t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
