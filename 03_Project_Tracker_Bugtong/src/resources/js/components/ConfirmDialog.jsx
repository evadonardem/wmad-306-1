import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';

export default function ConfirmDialog({ open, title, content, onCancel, onConfirm, confirmText = 'Delete', cancelText = 'Cancel', loading = false }) {
  return (
    <Dialog open={open} onClose={onCancel} aria-labelledby="confirm-dialog-title">
      <DialogTitle id="confirm-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <Typography>{content}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} disabled={loading}>{cancelText}</Button>
        <Button onClick={onConfirm} color="error" variant="contained" disabled={loading} autoFocus>
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
