import { Link } from '@inertiajs/react';
import { Box, Container, Paper, Stack, Typography } from '@mui/material';

export default function GuestLayout({ title, subtitle, children }) {
    return (
        <Box
            sx={{
                minHeight: '100vh',
                py: 6,
                background:
                    'linear-gradient(155deg, #f4f1ea 0%, #fdf5e6 45%, #e5f1f7 100%)',
            }}
        >
            <Container maxWidth="sm">
                <Stack spacing={3}>
                    <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h4">
                            Project Tracker
                        </Typography>
                        <Typography color="text.secondary">
                            Plan projects, manage tasks, and track progress.
                        </Typography>
                    </Box>
                    <Paper sx={{ p: 3, borderRadius: 5 }}>
                        <Stack spacing={1.5} sx={{ mb: 2 }}>
                            <Typography variant="h5" sx={{ fontWeight: 700 }}>
                                {title}
                            </Typography>
                            {subtitle ? <Typography color="text.secondary">{subtitle}</Typography> : null}
                        </Stack>
                        {children}
                    </Paper>
                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                        Fake inbox: <Link href="/inbox">open Mailpit</Link>
                    </Typography>
                </Stack>
            </Container>
        </Box>
    );
}
