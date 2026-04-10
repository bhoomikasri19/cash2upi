import { createContext, useContext } from 'react'

const LangContext = createContext(null)
export function useLang() { return useContext(LangContext) }

const t = (key) => key  // passthrough — English only now

export function LangProvider({ children }) {
  return <LangContext.Provider value={{ t, lang: 'en' }}>{children}</LangContext.Provider>
}
