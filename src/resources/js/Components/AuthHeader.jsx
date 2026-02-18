import { router, usePage } from '@inertiajs/react';
import { Button, Chip, Stack, Typography } from '@mui/material';

export default function AuthHeader({ title }) {
    const { auth } = usePage().props;

    return (
        <Stack
            direction={{ xs: 'column', md: 'row' }}
            justifyContent="space-between"
            alignItems={{ xs: 'flex-start', md: 'center' }}
            spacing={1.5}
            sx={{ mb: 3 }}
        >
            <Typography variant="h4" sx={{ fontWeight: 700, lineHeight: 1.15 }}>
                {title}
            </Typography>
            <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={1}
                alignItems={{ xs: 'stretch', sm: 'center' }}
                sx={{ width: { xs: '100%', md: 'auto' } }}
            >
                <Chip
                    label={auth?.user?.email}
                    color="primary"
                    variant="outlined"
                    sx={{
                        maxWidth: { xs: '100%', md: 320 },
                        '& .MuiChip-label': {
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                        },
                    }}
                />
                <Button
                    size="small"
                    variant="outlined"
                    onClick={() => router.post('/logout')}
                    sx={{ alignSelf: { xs: 'flex-start', sm: 'auto' } }}
                >
                    Logout
                </Button>
            </Stack>
        </Stack>
    );
}
