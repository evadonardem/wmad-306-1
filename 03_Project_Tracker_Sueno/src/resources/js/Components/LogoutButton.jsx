import { useForm } from '@inertiajs/react';
import { Button } from '@mui/material';

export default function LogoutButton() {
  const { post } = useForm();

  const handleLogout = (e) => {
    e.preventDefault();
    post('/logout');
  };

  return (
    <Button
      color="primary"
      onClick={handleLogout}
      sx={{ fontWeight: 600, fontFamily: 'Nunito, sans-serif', mx: 1 }}
    >
      Log Out
    </Button>
  );
}
