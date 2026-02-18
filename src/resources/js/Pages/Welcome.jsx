import { Link } from '@inertiajs/react';
import { Box, Button, Container, Paper, Stack, Typography } from '@mui/material';

export default function Welcome() {
    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                background:
                    'radial-gradient(circle at 10% 10%, #f9c784 0%, transparent 30%), radial-gradient(circle at 80% 15%, #8ecae6 0%, transparent 28%), linear-gradient(145deg, #f4f1ea 0%, #f7ede2 50%, #eaf4f4 100%)',
                py: 4,
            }}
        >
            <Container maxWidth="md">
                <Paper sx={{ p: { xs: 3, md: 6 }, borderRadius: 6 }}>
                    <Stack spacing={2.5}>
                        <Typography variant="h3">
                            Project Tracker Website
                        </Typography>
                        <Typography color="text.secondary" sx={{ maxWidth: 620 }}>
                            Full Laravel + Inertia + React + MUI app with Projects, Tasks, Authentication, and Password Reset.
                        </Typography>
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                            <Button component={Link} href="/register" variant="contained">
                                Create Account
                            </Button>
                            <Button component={Link} href="/login" variant="outlined">
                                Login
                            </Button>
                            <Button component={Link} href="/inbox" color="secondary" variant="outlined">
                                Fake Email Inbox
                            </Button>
                        </Stack>
                    </Stack>
                </Paper>
            </Container>
        </Box>
    );
}
