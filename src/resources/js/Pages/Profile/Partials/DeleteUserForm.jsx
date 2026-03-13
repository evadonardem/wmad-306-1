import { useForm } from '@inertiajs/react';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import { useRef, useState } from 'react';

export default function DeleteUserForm() {
    const [open, setOpen] = useState(false);
    const passwordInput = useRef();

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        password: '',
    });

    const deleteUser = (e) => {
        e.preventDefault();

        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => setOpen(false),
            onError: () => passwordInput.current?.focus(),
            onFinish: () => reset(),
        });
    };

    const handleClose = () => {
        setOpen(false);
        clearErrors();
        reset();
    };

    return (
        <Box>
            <Typography variant="h6" gutterBottom>Delete Account</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Once your account is deleted, all of its resources and data will be permanently deleted.
                Before deleting your account, please download any data or information that you wish to retain.
            </Typography>

            <Button variant="contained" color="error" onClick={() => setOpen(true)}>
                Delete Account
            </Button>

            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <Box component="form" onSubmit={deleteUser}>
                    <DialogTitle>Are you sure you want to delete your account?</DialogTitle>
                    <DialogContent>
                        <DialogContentText sx={{ mb: 2 }}>
                            Once your account is deleted, all of its resources and data will be permanently deleted.
                            Please enter your password to confirm you would like to permanently delete your account.
                        </DialogContentText>
                        <TextField
                            label="Password"
                            type="password"
                            inputRef={passwordInput}
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            error={!!errors.password}
                            helperText={errors.password}
                            fullWidth
                            autoFocus
                        />
                    </DialogContent>
                    <DialogActions sx={{ px: 3, pb: 2 }}>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button type="submit" variant="contained" color="error" disabled={processing}>
                            Delete Account
                        </Button>
                    </DialogActions>
                </Box>
            </Dialog>
        </Box>
    );
}
