import { Link } from '@inertiajs/react';
import { Box, Button, Stack, Typography } from '@mui/material';

export default function AppFooter() {
    const appName = import.meta.env.VITE_APP_NAME || 'Project Tracker';

    return (
        <Box
            component="footer"
            sx={{
                mt: 5,
                py: 2,
                borderTop: 1,
                borderColor: 'divider',
            }}
        >
            <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={1.5}
                justifyContent="space-between"
                alignItems={{ xs: 'flex-start', sm: 'center' }}
            >
                <Typography variant="caption" color="text.secondary">
                    © {new Date().getFullYear()} {appName}
                </Typography>

                <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="caption" color="text.disabled">
                        About
                    </Typography>
                    <Typography variant="caption" color="text.disabled">
                        •
                    </Typography>
                    <Typography variant="caption" color="text.disabled">
                        Privacy
                    </Typography>
                    <Typography variant="caption" color="text.disabled">
                        •
                    </Typography>
                    <Button
                        component={Link}
                        href={route('contact.show')}
                        size="small"
                        variant="text"
                        sx={{ minWidth: 0, px: 0.5 }}
                    >
                        Contact Us
                    </Button>
                </Stack>
            </Stack>
        </Box>
    );
}
