import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { Alert, Box, Button, Card, CardContent, Stack, TextField, Typography } from '@mui/material';
import { ArrowLeft, Send } from 'lucide-react';

function ContactForm() {
    const { flash, auth } = usePage().props;

    const { data, setData, post, processing, errors, reset } = useForm({
        name: auth?.user?.name ?? '',
        email: auth?.user?.email ?? '',
        subject: '',
        message: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('contact.send'), {
            preserveScroll: true,
            onSuccess: () => reset('subject', 'message'),
        });
    };

    return (
        <Card>
            <CardContent>
                <Stack spacing={2}>
                    <Typography variant="h6">Contact Us</Typography>
                    <Typography variant="body2" color="text.secondary">
                        Send us a message. This form is wired to your mail configuration so it should appear in Mailtrap/Mailpit.
                    </Typography>

                    {flash?.success ? <Alert severity="success">{flash.success}</Alert> : null}
                    {flash?.error ? <Alert severity="error">{flash.error}</Alert> : null}

                    <Box component="form" onSubmit={submit}>
                        <Stack spacing={2}>
                            <TextField
                                label="Name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                error={Boolean(errors.name)}
                                helperText={errors.name}
                                required
                                fullWidth
                            />

                            <TextField
                                label="Email"
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                error={Boolean(errors.email)}
                                helperText={errors.email}
                                required
                                fullWidth
                            />

                            <TextField
                                label="Subject"
                                value={data.subject}
                                onChange={(e) => setData('subject', e.target.value)}
                                error={Boolean(errors.subject)}
                                helperText={errors.subject}
                                required
                                fullWidth
                            />

                            <TextField
                                label="Message"
                                value={data.message}
                                onChange={(e) => setData('message', e.target.value)}
                                error={Boolean(errors.message)}
                                helperText={errors.message}
                                required
                                fullWidth
                                multiline
                                minRows={5}
                            />

                            <Stack direction="row" justifyContent="flex-end">
                                <Button
                                    type="submit"
                                    variant="contained"
                                    startIcon={<Send size={16} />}
                                    disabled={processing}
                                >
                                    Send Message
                                </Button>
                            </Stack>
                        </Stack>
                    </Box>
                </Stack>
            </CardContent>
        </Card>
    );
}

export default function Contact() {
    const auth = usePage().props.auth;
    const isAuthed = Boolean(auth?.user);

    const goBack = () => {
        if (typeof window !== 'undefined' && window.history.length > 1) {
            window.history.back();

            return;
        }

        if (isAuthed) {
            router.visit(route('dashboard'));

            return;
        }

        router.visit('/');
    };

    if (isAuthed) {
        return (
            <AuthenticatedLayout
                header={(
                    <Button
                        type="button"
                        variant="text"
                        size="small"
                        startIcon={<ArrowLeft size={14} />}
                        onClick={goBack}
                        sx={{ minWidth: 0, px: 0.5 }}
                    >
                        Back
                    </Button>
                )}
            >
                <Head title="Contact Us" />
                <ContactForm />
            </AuthenticatedLayout>
        );
    }

    return (
        <GuestLayout>
            <Head title="Contact Us" />
            <ContactForm />
        </GuestLayout>
    );
}
