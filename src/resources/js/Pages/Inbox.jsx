import { Link } from '@inertiajs/react';
import { Box, Button, Container, Paper, Stack, Typography } from '@mui/material';

export default function Inbox() {
    return (
        <Box sx={{ minHeight: '100vh', py: 6, backgroundColor: '#f7f9fb' }}>
            <Container maxWidth="md">
                <Paper sx={{ p: 4 }}>
                    <Stack spacing={2}>
                        <Typography variant="h4" sx={{ fontWeight: 700 }}>
                            Fake Email Inbox
                        </Typography>
                        <Typography color="text.secondary">
                            Password reset emails are delivered to Mailpit.
                        </Typography>
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                            <Button
                                variant="contained"
                                color="secondary"
                                href="http://localhost:8025"
                                target="_blank"
                                rel="noreferrer"
                            >
                                Open Mailpit Inbox
                            </Button>
                            <Button component={Link} href="/forgot-password" variant="outlined">
                                Forgot Password
                            </Button>
                            <Button component={Link} href="/" variant="text">
                                Back to Welcome
                            </Button>
                        </Stack>
                    </Stack>
                </Paper>
            </Container>
        </Box>
    );
}
