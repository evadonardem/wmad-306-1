import { useForm } from '@inertiajs/react';
import { AlertTriangle, Trash2 } from 'lucide-react';
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
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
        <>
            <Card>
                <CardContent>
                    <Stack spacing={2.5}>
                        <Box>
                            <Typography variant="h6" sx={{ fontWeight: 900 }}>
                                Delete account
                            </Typography>
                            <Typography color="text.secondary" variant="body2">
                                This action is permanent. All your data will be deleted.
                            </Typography>
                        </Box>

                        <Alert
                            severity="warning"
                            icon={<AlertTriangle size={18} />}
                        >
                            Download anything you want to keep before deleting.
                        </Alert>

                        <Button
                            onClick={confirmUserDeletion}
                            color="error"
                            variant="contained"
                            startIcon={<Trash2 size={18} />}
                            sx={{ alignSelf: 'flex-start' }}
                        >
                            Delete account
                        </Button>
                    </Stack>
                </CardContent>
            </Card>

            <Dialog
                open={confirmingUserDeletion}
                onClose={closeModal}
                fullWidth
                maxWidth="sm"
            >
                <Box component="form" onSubmit={deleteUser}>
                    <DialogTitle sx={{ fontWeight: 900 }}>
                        Confirm account deletion
                    </DialogTitle>
                    <DialogContent>
                        <Stack spacing={2} sx={{ mt: 1 }}>
                            <Typography color="text.secondary">
                                Enter your password to permanently delete your account.
                            </Typography>

                            <TextField
                                label="Password"
                                type="password"
                                name="password"
                                inputRef={passwordInput}
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                error={Boolean(errors.password)}
                                helperText={errors.password}
                                autoFocus
                                fullWidth
                            />
                        </Stack>
                    </DialogContent>
                    <DialogActions sx={{ px: 3, pb: 2 }}>
                        <Button onClick={closeModal} variant="outlined">
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            color="error"
                            variant="contained"
                            disabled={processing}
                            startIcon={<Trash2 size={18} />}
                        >
                            Delete
                        </Button>
                    </DialogActions>
                </Box>
            </Dialog>
        </>
    );
}
