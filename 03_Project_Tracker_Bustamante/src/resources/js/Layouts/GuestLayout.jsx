import { Link } from '@inertiajs/react';
import { Box, Container, Paper, Stack, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { FolderKanban } from 'lucide-react';

export default function GuestLayout({ children }) {
    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                py: 6,
            }}
        >
            <Container maxWidth="sm">
                <Stack spacing={3} alignItems="center">
                    <Stack direction="row" spacing={1.25} alignItems="center">
                        <Box
                            sx={(theme) => ({
                                width: 34,
                                height: 34,
                                borderRadius: 2,
                                display: 'grid',
                                placeItems: 'center',
                                bgcolor: alpha(theme.palette.primary.main, 0.16),
                                border: `1px solid ${alpha(theme.palette.primary.main, 0.28)}`,
                            })}
                        >
                            <FolderKanban size={18} />
                        </Box>
                        <Typography
                            component={Link}
                            href="/"
                            variant="h5"
                            fontWeight={900}
                            color="inherit"
                            sx={{ textDecoration: 'none' }}
                        >
                            Project Tracker of Juswa
                        </Typography>
                    </Stack>

                    <Paper elevation={10} sx={{ width: '100%', p: 3 }}>
                        {children}
                    </Paper>
                </Stack>
            </Container>
        </Box>
    );
}
