import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import { employeeService, type EmployeeSession } from '../services/employeeService'

interface EmployeeContextValue {
  session: EmployeeSession | null
  startSession: (session: EmployeeSession) => void
  clearSession: () => void
  endSession: () => Promise<void>
}
const EmployeeContext = createContext<EmployeeContextValue | null>(null)

export function EmployeeProvider({ children }: { children: ReactNode }) {
  // Sessão apenas em memória: nunca guardar PIN/token em URL ou localStorage.
  const [session, setSession] = useState<EmployeeSession | null>(null)
  const clearSession = useCallback(() => setSession(null), [])
  useEffect(() => {
    if (!session) return
    const timer = window.setTimeout(clearSession, Math.min(Math.max(0, Date.parse(session.expiresAt) - Date.now()), 2147483647))
    return () => window.clearTimeout(timer)
  }, [session, clearSession])
  const endSession = async () => {
    try { if (session) await employeeService.logout(session.token) }
    finally { clearSession() }
  }
  return <EmployeeContext.Provider value={{ session, startSession: setSession, clearSession, endSession }}>{children}</EmployeeContext.Provider>
}

export function useEmployee() {
  const context = useContext(EmployeeContext)
  if (!context) throw new Error('EmployeeProvider ausente.')
  return context
}
