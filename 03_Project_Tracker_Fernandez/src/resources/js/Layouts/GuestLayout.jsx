import BrandMark from '@/Components/BrandMark';
import AppFooter from '@/Components/AppFooter';
import PageTransition from '@/Components/PageTransition';
import { Link } from '@inertiajs/react';
import {
    AppBar,
    Box,
    Card,
    Container,
    Toolbar,
} from '@mui/material';

export default function GuestLayout({ children }) {
    return (
        <Box sx={{ minHeight: '100dvh' }}>
            <AppBar position="sticky" color="default" elevation={0}>
                <Toolbar>
                    <Box
                        component={Link}
                        href="/"
                        sx={{ color: 'inherit', textDecoration: 'none' }}
                    >
                        <BrandMark />
                    </Box>

                    <Box sx={{ flex: 1 }} />
                </Toolbar>
            </AppBar>

            <Container maxWidth="sm" sx={{ py: 6 }}>
                <Card sx={{ p: { xs: 2.5, sm: 3.5 } }}>
                    <PageTransition>{children}</PageTransition>
                </Card>
                <AppFooter />
            </Container>
        </Box>
    );
}
