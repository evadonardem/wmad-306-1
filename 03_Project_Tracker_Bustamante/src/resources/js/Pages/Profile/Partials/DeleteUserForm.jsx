import { useForm } from '@inertiajs/react';
import {
    Alert,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import { Trash2 } from 'lucide-react';
import { useRef, useState } from 'react';

export default function DeleteUserForm() {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
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

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const deleteUser = (e) => {
        e.preventDefault();

        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);

        clearErrors();
        reset();
    };

    return (
        <Box component="section">
            <Stack spacing={1}>
                <Stack direction="row" spacing={1} alignItems="center">
                    <Trash2 size={18} />
                    <Typography variant="h6" fontWeight={900}>
                        Delete Account
                    </Typography>
                </Stack>
                <Typography variant="body2" color="text.secondary">
                    Once your account is deleted, all of its resources and data will be permanently deleted.
                </Typography>
                <Alert severity="error" sx={{ mt: 1 }}>
                    This action is permanent.
                </Alert>

                <Box>
                    <Button color="error" variant="contained" onClick={confirmUserDeletion}>
                        Delete Account
                    </Button>
                </Box>
            </Stack>

            <Dialog
                open={confirmingUserDeletion}
                onClose={closeModal}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>Confirm account deletion</DialogTitle>
                <Box component="form" onSubmit={deleteUser}>
                    <DialogContent>
                        <Stack spacing={2}>
                            <Typography variant="body2" color="text.secondary">
                                Please enter your password to confirm you would like to permanently delete your account.
                            </Typography>

                            <TextField
                                id="password"
                                type="password"
                                label="Password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                inputRef={passwordInput}
                                error={Boolean(errors.password)}
                                helperText={errors.password}
                                autoFocus
                                fullWidth
                            />
                        </Stack>
                    </DialogContent>

                    <DialogActions>
                        <Button onClick={closeModal} disabled={processing}>
                            Cancel
                        </Button>
                        <Button type="submit" color="error" variant="contained" disabled={processing}>
                            Delete
                        </Button>
                    </DialogActions>
                </Box>
            </Dialog>
        </Box>
    );
}
