import React, { createContext, useContext, useState, useCallback } from 'react';
import { Snackbar, Alert } from '@mui/material';

const FeedbackContext = createContext({ show: () => {} });

export function useFeedback() {
  return useContext(FeedbackContext);
}

export default function FeedbackProvider({ children }) {
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const show = useCallback((message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  }, []);
  const handleClose = () => setSnackbar((s) => ({ ...s, open: false }));
  return (
    <FeedbackContext.Provider value={{ show }}>
      {children}
      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={handleClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={handleClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </FeedbackContext.Provider>
  );
}
