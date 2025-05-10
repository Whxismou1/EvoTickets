"use client"

import { createContext, useContext, useState, useCallback } from "react"
import Alert, { ALERT_TYPES } from "../components/Alert"

// Crear el contexto
const AlertContext = createContext(null)

// Hook personalizado para usar el contexto
export const useAlert = () => {
  const context = useContext(AlertContext)
  if (!context) {
    throw new Error("useAlert debe ser usado dentro de un AlertProvider")
  }
  return context
}

// Proveedor del contexto
export function AlertProvider({ children }) {
  const [alertState, setAlertState] = useState({
    isVisible: false,
    type: ALERT_TYPES.INFO,
    message: "",
  })

  // Cerrar la alerta
  const closeAlert = useCallback(() => {
    setAlertState(prev => ({ ...prev, isVisible: false }))
  }, [])

  // Mostrar una alerta
  const showAlert = useCallback(({ type = ALERT_TYPES.INFO, message, duration = 3000 }) => {
    setAlertState({
      isVisible: true,
      type,
      message,
    })
  }, [])

  // Funciones de conveniencia para diferentes tipos de alertas
  const success = useCallback(
    (message, options = {}) => {
      return showAlert({
        type: ALERT_TYPES.SUCCESS,
        message,
        ...options,
      })
    },
    [showAlert],
  )

  const error = useCallback(
    (message, options = {}) => {
      return showAlert({
        type: ALERT_TYPES.ERROR,
        message,
        ...options,
      })
    },
    [showAlert],
  )

  const warning = useCallback(
    (message, options = {}) => {
      return showAlert({
        type: ALERT_TYPES.WARNING,
        message,
        ...options,
      })
    },
    [showAlert],
  )

  const info = useCallback(
    (message, options = {}) => {
      return showAlert({
        type: ALERT_TYPES.INFO,
        message,
        ...options,
      })
    },
    [showAlert],
  )

  // Valor del contexto
  const value = {
    showAlert,
    closeAlert,
    success,
    error,
    warning,
    info,
  }

  return (
    <AlertContext.Provider value={value}>
      {children}
      <Alert
        type={alertState.type}
        message={alertState.message}
        isVisible={alertState.isVisible}
        onClose={closeAlert}
      />
    </AlertContext.Provider>
  )
}
