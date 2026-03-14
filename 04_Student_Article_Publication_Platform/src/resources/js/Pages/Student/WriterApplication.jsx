import { Head, Link, useForm } from '@inertiajs/react';
import {
    alpha,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Container,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import StudentLayout from '@/Layouts/StudentLayout';
import { getThemeColors, useThemeContext } from '@/Components/ThemeContext';

function statusTone(status) {
    if (status === 'accepted') return 'success';
    if (status === 'rejected') return 'error';
    return 'warning';
}

export default function WriterApplication({ latestApplication = null }) {
    const { theme: currentTheme } = useThemeContext();
    const colors = getThemeColors(currentTheme);

    const { data, setData, post, processing, errors, reset } = useForm({
        motivation: '',
        experience: '',
        topics: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('student.writer-application.store'), {
            preserveScroll: true,
            onSuccess: () => reset('motivation', 'experience', 'topics'),
        });
    };

    const hasPending = latestApplication?.status === 'pending';

    return (
        <StudentLayout>
            <Head title="Become a Writer" />
            <Container maxWidth="md" sx={{ py: 3 }}>
                <Box sx={{ mb: 2 }}>
                    <Typography variant="h4" fontWeight={900} sx={{ color: colors.newsprint }}>
                        Become a Writer
                    </Typography>
                    <Typography variant="body2" sx={{ color: colors.byline }}>
                        Send your application to the admin team. Approval is required before writer access is granted.
                    </Typography>
                </Box>

                {latestApplication && (
                    <Card elevation={0} sx={{ border: '1px solid', borderColor: alpha(colors.border, 0.7), mb: 2 }}>
                        <CardContent>
                            <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                                <Typography variant="subtitle2" sx={{ color: colors.newsprint, fontWeight: 700 }}>
                                    Latest Application Status
                                </Typography>
                                <Chip size="small" color={statusTone(latestApplication.status)} label={latestApplication.status?.toUpperCase() || 'PENDING'} />
                            </Stack>
                            <Typography variant="caption" sx={{ color: colors.byline }}>
                                Submitted: {latestApplication.created_at ? new Date(latestApplication.created_at).toLocaleString() : '-'}
                            </Typography>
                            {latestApplication.admin_notes && (
                                <Typography variant="body2" sx={{ color: colors.byline, mt: 1 }}>
                                    Admin note: {latestApplication.admin_notes}
                                </Typography>
                            )}
                        </CardContent>
                    </Card>
                )}

                <Card elevation={0} sx={{ border: '1px solid', borderColor: alpha(colors.border, 0.7) }}>
                    <CardContent>
                        <form onSubmit={submit}>
                            <Stack spacing={2}>
                                <TextField
                                    label="Why do you want to become a writer?"
                                    multiline
                                    minRows={4}
                                    value={data.motivation}
                                    onChange={(e) => setData('motivation', e.target.value)}
                                    error={Boolean(errors.motivation)}
                                    helperText={errors.motivation || 'Describe your motivation and goals.'}
                                    required
                                />

                                <TextField
                                    label="Writing experience (optional)"
                                    multiline
                                    minRows={3}
                                    value={data.experience}
                                    onChange={(e) => setData('experience', e.target.value)}
                                    error={Boolean(errors.experience)}
                                    helperText={errors.experience || 'Clubs, blogs, publications, or related work.'}
                                />

                                <TextField
                                    label="Topics you want to write about (optional)"
                                    multiline
                                    minRows={3}
                                    value={data.topics}
                                    onChange={(e) => setData('topics', e.target.value)}
                                    error={Boolean(errors.topics)}
                                    helperText={errors.topics || 'Examples: campus life, science, arts, technology.'}
                                />

                                <Stack direction="row" spacing={1}>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        disabled={processing || hasPending}
                                        sx={{
                                            bgcolor: colors.newsprint,
                                            color: colors.paper,
                                            '&:hover': { bgcolor: colors.accent },
                                        }}
                                    >
                                        {processing ? 'Sending...' : hasPending ? 'Pending Review' : 'Send Application'}
                                    </Button>
                                    <Button component={Link} href="/student/dashboard" variant="outlined">
                                        Back
                                    </Button>
                                </Stack>
                            </Stack>
                        </form>
                    </CardContent>
                </Card>
            </Container>
        </StudentLayout>
    );
}
