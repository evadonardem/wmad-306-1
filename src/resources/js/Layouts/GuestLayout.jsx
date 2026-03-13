import { Link } from '@inertiajs/react';
import { Box, Paper, Typography } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';

export default function GuestLayout({ children }) {
    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: '#FAFAF9',
                py: 4,
            }}
        >
            <Link href="/" style={{ textDecoration: 'none', marginBottom: 24 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <SchoolIcon sx={{ fontSize: 48, color: '#064E3B' }} />
                    <Box>
                        <Typography variant="h5" sx={{ color: '#064E3B', fontWeight: 700, lineHeight: 1.2 }}>
                            Highland Scholar
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#57534E' }}>
                            Student Article Publication Platform
                        </Typography>
                    </Box>
                </Box>
            </Link>

            <Paper
                elevation={3}
                sx={{
                    width: '100%',
                    maxWidth: 440,
                    p: 4,
                    borderRadius: 3,
                    borderTop: '4px solid #064E3B',
                }}
            >
                {children}
            </Paper>

            <Typography variant="caption" color="text.secondary" sx={{ mt: 3 }}>
                Highland Scholar &copy; {new Date().getFullYear()}
            </Typography>
        </Box>
    );
}
