"use client"

import { useEffect } from "react"
import { X, AlertCircle, CheckCircle, Info, AlertTriangle, HelpCircle } from "lucide-react"
import PropTypes from "prop-types"
import { motion, AnimatePresence } from "framer-motion"

export const ALERT_TYPES = {
  SUCCESS: "success",
  ERROR: "error",
  WARNING: "warning",
  INFO: "info",
  CONFIRM: "confirm",
}

const Alert = ({
  type = "error",
  message,
  duration = 3000,
  onClose,
  isVisible,
  onConfirm,
  onCancel,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
}) => {
  useEffect(() => {
    if (duration > 0 && isVisible && type !== ALERT_TYPES.CONFIRM) {
      const timer = setTimeout(() => {
        onClose?.()
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [duration, onClose, isVisible, type])

  const alertStyles = {
    error: {
      bg: "bg-red-50",
      border: "border-red-200",
      text: "text-red-800",
      icon: <AlertCircle className="h-5 w-5 text-red-500" />,
    },
    success: {
      bg: "bg-green-50",
      border: "border-green-200",
      text: "text-green-800",
      icon: <CheckCircle className="h-5 w-5 text-green-500" />,
    },
    info: {
      bg: "bg-[#F3F0FA]",
      border: "border-[#A28CD4]",
      text: "text-[#5C3D8D]",
      icon: <Info className="h-5 w-5 text-[#5C3D8D]" />,
    },
    warning: {
      bg: "bg-yellow-50",
      border: "border-yellow-200",
      text: "text-yellow-800",
      icon: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
    },
    confirm: {
      bg: "bg-gray-50",
      border: "border-gray-200",
      text: "text-gray-800",
      icon: <HelpCircle className="h-5 w-5 text-gray-500" />,
    },
  }

  const style = alertStyles[type]

  const handleConfirm = () => {
    onConfirm?.()
    onClose?.()
  }

  const handleCancel = () => {
    onCancel?.()
    onClose?.()
  }

  return (
    <>
      {/* Overlay para confirmaciones */}
      {isVisible && type === ALERT_TYPES.CONFIRM && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
        />
      )}

      {/* Contenedor centrado para confirmaciones */}
      {type === ALERT_TYPES.CONFIRM ? (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <AnimatePresence>
            {isVisible && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`p-4 rounded-lg border ${style.bg} ${style.border} ${style.text} shadow-lg w-full max-w-md`}
              >
                <div className="flex items-start gap-3">
                  {style.icon}
                  <div className="flex-1">
                    <span className="block">{message}</span>

                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={handleConfirm}
                        className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                      >
                        {confirmText}
                      </button>
                      <button
                        onClick={handleCancel}
                        className="px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded hover:bg-gray-400 transition-colors"
                      >
                        {cancelText}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ) : (
        // Alertas normales (esquina superior derecha)
        <AnimatePresence>
          {isVisible && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`fixed top-4 right-4 z-50 p-4 rounded-lg border ${style.bg} ${style.border} ${style.text} shadow-lg max-w-md`}
            >
              <div className="flex items-start gap-3">
                {style.icon}
                <div className="flex-1">
                  <span className="block">{message}</span>
                </div>

                {onClose && (
                  <button onClick={onClose} className="ml-2 p-1 hover:bg-opacity-10 hover:bg-black rounded-full">
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </>
  )
}

Alert.propTypes = {
  type: PropTypes.oneOf(["error", "success", "info", "warning", "confirm"]),
  message: PropTypes.string.isRequired,
  duration: PropTypes.number,
  onClose: PropTypes.func,
  isVisible: PropTypes.bool.isRequired,
  onConfirm: PropTypes.func,
  onCancel: PropTypes.func,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
}

export default Alert
