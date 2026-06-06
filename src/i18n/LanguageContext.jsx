import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { translations } from './translations'

const STORAGE_KEY = 'rahhal_language'
const DEFAULT_LANGUAGE = 'ar'

const getInitialLanguage = () => {
  if (typeof window === 'undefined') return DEFAULT_LANGUAGE
  const stored = window.localStorage.getItem(STORAGE_KEY)
  return stored && translations[stored] ? stored : DEFAULT_LANGUAGE
}

const resolveLanguage = (value) => (translations[value] ? value : DEFAULT_LANGUAGE)

const getNestedValue = (obj, path) =>
  path.split('.').reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), obj)

const formatTemplate = (value, params = {}) => {
  if (!params || typeof value !== 'string') return value
  return value.replace(/\{\{(\w+)\}\}/g, (match, key) =>
    Object.prototype.hasOwnProperty.call(params, key) ? params[key] : match,
  )
}

const LanguageContext = createContext({
  language: DEFAULT_LANGUAGE,
  dir: 'rtl',
  setLanguage: () => {},
  t: (key) => key,
})

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(getInitialLanguage)

  const setLanguage = (nextLanguage) => {
    setLanguageState(resolveLanguage(nextLanguage))
  }

  const dir = language === 'ar' ? 'rtl' : 'ltr'

  useEffect(() => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(STORAGE_KEY, language)
  }, [language])

  useEffect(() => {
    if (typeof document === 'undefined') return
    document.documentElement.lang = language
    document.documentElement.dir = dir
  }, [language, dir])

  const t = useMemo(() => {
    return (key, { fallback, params } = {}) => {
      const selected = translations[language]
      const raw = getNestedValue(selected, key)
      if (typeof raw === 'string') return formatTemplate(raw, params)
      const fallbackValue = getNestedValue(translations[DEFAULT_LANGUAGE], key)
      if (typeof fallbackValue === 'string') return formatTemplate(fallbackValue, params)
      return fallback ?? key
    }
  }, [language])

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      dir,
      t,
    }),
    [language, dir, t],
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export const useLanguage = () => useContext(LanguageContext)
