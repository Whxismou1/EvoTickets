import { useState, useCallback } from 'react';

const useAlert = () => {
  const [alert, setAlert] = useState({ isVisible: false, message: '', type: 'error' });

  const showAlert = useCallback(({ type = 'error', message, duration = 3000 }) => {
    setAlert({ isVisible: true, type, message });
  }, []);

  const hideAlert = useCallback(() => {
    setAlert(prev => ({ ...prev, isVisible: false }));
  }, []);

  return {
    alert,
    showAlert,
    hideAlert,
  };
};

export default useAlert; 