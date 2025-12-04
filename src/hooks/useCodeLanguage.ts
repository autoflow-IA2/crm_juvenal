import { useState, useEffect } from 'react'
import { CodeLanguage } from '@/types/api-endpoints'

const CODE_LANGUAGE_STORAGE_KEY = 'juvenal_crm_code_language'
const DEFAULT_LANGUAGE: CodeLanguage = 'curl'

export function useCodeLanguage() {
  const [language, setLanguageState] = useState<CodeLanguage>(DEFAULT_LANGUAGE)

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(CODE_LANGUAGE_STORAGE_KEY) as CodeLanguage
    if (stored && ['curl', 'javascript', 'python'].includes(stored)) {
      setLanguageState(stored)
    }
  }, [])

  // Set language and save to localStorage
  const setLanguage = (lang: CodeLanguage) => {
    setLanguageState(lang)
    localStorage.setItem(CODE_LANGUAGE_STORAGE_KEY, lang)
  }

  return {
    language,
    setLanguage,
  }
}
