import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';
import { Box, Container, Paper } from '@mui/material';
import React from 'react';

export default function GuestLayout({ children }) {
    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', bgcolor: 'background.default', py: { xs: 6, sm: 8 } }}>
            <Box sx={{ position: 'absolute', top: { xs: 24, sm: 32 }, left: { xs: 16, sm: 24 } }}>
                <Link href="/">
                    <Box sx={{ width: 56, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <ApplicationLogo />
                    </Box>
                </Link>
            </Box>

            <Container maxWidth="sm">
                <Paper elevation={3} sx={{ p: { xs: 3, sm: 4 }, borderRadius: 2 }}>
                    {children}
                </Paper>
            </Container>
        </Box>
    );
}
