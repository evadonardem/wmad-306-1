import { Box, Typography, Stack, Paper, Chip } from '@mui/material';
import { BookmarkBorder, Visibility, Comment } from '@mui/icons-material';
import { COLORS, DARK_COLORS } from '../DashboardSections/dashboardTheme';

export default function RecommendedList({
    articles = [],
    isDark = false,
    textColor,
    mutedColor,
}) {
    const primaryText = textColor || (isDark ? DARK_COLORS.textPrimary : COLORS.deepPurple);
    const secondaryText = mutedColor || (isDark ? DARK_COLORS.mediumPurple : COLORS.mediumPurple);

    return (
        <Paper elevation={0} sx={{ p: 2, borderRadius: 2, bgcolor: 'background.paper' }}>
            <Stack spacing={1.5}>
                {articles.map((article) => (
                    <Box
                        key={article.id}
                        sx={{
                            p: 1.5,
                            borderRadius: 1.5,
                            border: `1px solid ${COLORS.mediumPurple}30`,
                            cursor: 'pointer',
                            transition: 'all 150ms ease',
                            '&:hover': {
                                borderColor: COLORS.royalPurple,
                                bgcolor: `${COLORS.royalPurple}08`,
                            },
                        }}
                    >
                        <Typography sx={{ color: primaryText, fontWeight: 600, fontSize: 14, mb: 0.5 }}>
                            {article.title}
                        </Typography>

                        <Stack direction="row" spacing={1.5} alignItems="center">
                            <Chip
                                label={article.category || 'General'}
                                size="small"
                                sx={{
                                    height: 20,
                                    fontSize: 10,
                                    bgcolor: COLORS.royalPurple,
                                    color: '#fff',
                                    borderRadius: 1,
                                }}
                            />
                            <Stack direction="row" spacing={0.5} alignItems="center">
                                <Visibility sx={{ fontSize: 12, color: secondaryText }} />
                                <Typography variant="caption" sx={{ color: primaryText }}>345</Typography>
                            </Stack>
                            <Stack direction="row" spacing={0.5} alignItems="center">
                                <Comment sx={{ fontSize: 12, color: secondaryText }} />
                                <Typography variant="caption" sx={{ color: primaryText }}>{article.commentCount || 0}</Typography>
                            </Stack>
                            <BookmarkBorder sx={{ fontSize: 14, color: secondaryText }} />
                        </Stack>
                    </Box>
                ))}
            </Stack>
        </Paper>
    );
}
