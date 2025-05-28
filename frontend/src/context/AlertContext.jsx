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
    onConfirm: null,
    onCancel: null,
    confirmText: "Confirmar",
    cancelText: "Cancelar",
  })

  // Cerrar la alerta
  const closeAlert = useCallback(() => {
    setAlertState((prev) => ({ ...prev, isVisible: false }))
  }, [])

  // Mostrar una alerta
  const showAlert = useCallback(({ type = ALERT_TYPES.INFO, message, duration = 3000 }) => {
    setAlertState({
      isVisible: true,
      type,
      message,
      onConfirm: null,
      onCancel: null,
      confirmText: "Confirmar",
      cancelText: "Cancelar",
    })
  }, [])

  // Mostrar alerta de confirmación
  const showConfirm = useCallback(
    ({ message, onConfirm, onCancel, confirmText = "Eliminar", cancelText = "Cancelar" }) => {
      return new Promise((resolve) => {
        setAlertState({
          isVisible: true,
          type: ALERT_TYPES.CONFIRM,
          message,
          onConfirm: () => {
            onConfirm?.()
            resolve(true)
          },
          onCancel: () => {
            onCancel?.()
            resolve(false)
          },
          confirmText,
          cancelText,
        })
      })
    },
    [],
  )

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

  // Función de confirmación para eliminar
  const confirmDelete = useCallback(
    (message = "¿Estás seguro de que quieres eliminar este elemento?") => {
      return showConfirm({
        message,
        confirmText: "Eliminar",
        cancelText: "Cancelar",
      })
    },
    [showConfirm],
  )

  // Valor del contexto
  const value = {
    showAlert,
    closeAlert,
    success,
    error,
    warning,
    info,
    showConfirm,
    confirmDelete,
  }

  return (
    <AlertContext.Provider value={value}>
      {children}
      <Alert
        type={alertState.type}
        message={alertState.message}
        isVisible={alertState.isVisible}
        onClose={closeAlert}
        onConfirm={alertState.onConfirm}
        onCancel={alertState.onCancel}
        confirmText={alertState.confirmText}
        cancelText={alertState.cancelText}
      />
    </AlertContext.Provider>
  )
}
