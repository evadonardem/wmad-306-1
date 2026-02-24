import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

export default function ForgotPassword({ open, handleClose }) {
  const [email, setEmail] = React.useState('');
  const [submitted, setSubmitted] = React.useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    // TODO: Integrate with backend
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Forgot Password</DialogTitle>
      <DialogContent>
        {submitted ? (
          <div>Check your email for reset instructions.</div>
        ) : (
          <form onSubmit={handleSubmit}>
            <TextField
              autoFocus
              margin="dense"
              id="forgot-password-email"
              label="Email Address"
              type="email"
              fullWidth
              variant="standard"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button type="submit">Send</Button>
            </DialogActions>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
