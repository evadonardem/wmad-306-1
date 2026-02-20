import { alpha, Box, Typography, useTheme } from '@mui/material';
import { CheckCheck, FolderKanban } from 'lucide-react';

export default function BrandMark({ size = 22, name = 'Project Tracker' }) {
    const theme = useTheme();

    const [main, sub] = String(name).split(/\s+/, 2);

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
                sx={{
                    position: 'relative',
                    width: size + 8,
                    height: size + 8,
                    borderRadius: 2,
                    display: 'grid',
                    placeItems: 'center',
                    color: theme.palette.primary.main,
                    background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.24)} 0%, ${alpha(theme.palette.secondary.main, 0.18)} 100%)`,
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.35)}`,
                }}
            >
                <FolderKanban size={size - 2} />
                <Box
                    sx={{
                        position: 'absolute',
                        right: -3,
                        bottom: -3,
                        width: 14,
                        height: 14,
                        borderRadius: '50%',
                        display: 'grid',
                        placeItems: 'center',
                        backgroundColor: theme.palette.background.paper,
                        border: `1px solid ${alpha(theme.palette.primary.main, 0.35)}`,
                        color: theme.palette.success.main,
                    }}
                >
                    <CheckCheck size={9} />
                </Box>
            </Box>

            <Typography variant="subtitle1" sx={{ fontWeight: 800, letterSpacing: 0.15 }}>
                {main}
                {sub ? (
                    <Box component="span" sx={{ color: 'text.secondary', ml: 0.5, fontWeight: 700 }}>
                        {sub}
                    </Box>
                ) : null}
            </Typography>
        </Box>
    );
}
