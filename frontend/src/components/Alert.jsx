"use client"

import { useEffect } from 'react';
import { X, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';

export const ALERT_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
};

const Alert = ({ 
  type = 'error', 
  message, 
  duration = 3000, 
  onClose,
  isVisible
}) => {
  useEffect(() => {
    if (duration > 0 && isVisible) {
      const timer = setTimeout(() => {
        onClose?.();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose, isVisible]);

  const alertStyles = {
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-800',
      icon: <AlertCircle className="h-5 w-5 text-red-500" />,
    },
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-800',
      icon: <CheckCircle className="h-5 w-5 text-green-500" />,
    },
    info: {
      bg: 'bg-[#F3F0FA]',
      border: 'border-[#A28CD4]',
      text: 'text-[#5C3D8D]',
      icon: <Info className="h-5 w-5 text-[#5C3D8D]" />,
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-800',
      icon: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
    },
  };

  const style = alertStyles[type];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`fixed top-4 right-4 z-50 p-4 rounded-lg border ${style.bg} ${style.border} ${style.text} shadow-lg`}
        >
          <div className="flex items-center gap-2">
            {style.icon}
            <span>{message}</span>
            {onClose && (
              <button
                onClick={onClose}
                className="ml-2 p-1 hover:bg-opacity-10 hover:bg-black rounded-full"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

Alert.propTypes = {
  type: PropTypes.oneOf(['error', 'success', 'info', 'warning']),
  message: PropTypes.string.isRequired,
  duration: PropTypes.number,
  onClose: PropTypes.func,
  isVisible: PropTypes.bool.isRequired,
};

export default Alert;
