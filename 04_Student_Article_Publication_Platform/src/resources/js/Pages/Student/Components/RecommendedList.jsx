// RecommendedList.jsx (updated with complete dark mode support)
import {
    Box,
    Typography,
    Stack,
    Paper,
    Chip,
    List,
    ListItem,
    ListItemText,
    Divider,
    alpha,
} from '@mui/material';
import {
    TrendingUp,
    Visibility,
    ChatBubbleOutline,
    Schedule,
} from '@mui/icons-material';

export default function RecommendedList({
    articles = [],
    colors,
    isDarkMode = false,
    onArticleClick,
}) {
    if (!articles || articles.length === 0) return null;

    return (
        <Paper
            elevation={0}
            sx={{
                p: 2,
                borderRadius: 0,
                border: `1px solid ${colors.border}`,
                bgcolor: isDarkMode ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)',
            }}
        >
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                <TrendingUp sx={{ color: colors.accent, fontSize: 20 }} />
                <Typography
                    sx={{
                        fontFamily: '"Times New Roman", Times, serif',
                        fontWeight: 700,
                        color: colors.text,
                        textTransform: 'uppercase',
                        fontSize: '0.9rem',
                        letterSpacing: '0.05em',
                    }}
                >
                    Recommended for You
                </Typography>
            </Stack>

            <List disablePadding>
                {articles.map((article, index) => (
                    <Box key={article.id || index}>
                        <ListItem
                            button
                            onClick={() => onArticleClick?.(article.id)}
                            sx={{
                                px: 0,
                                py: 1.5,
                                '&:hover': {
                                    backgroundColor: isDarkMode
                                        ? 'rgba(255,255,255,0.03)'
                                        : 'rgba(0,0,0,0.02)',
                                },
                            }}
                        >
                            <Stack spacing={1} sx={{ width: '100%' }}>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        fontFamily: '"Times New Roman", Times, serif',
                                        fontWeight: 600,
                                        color: colors.text,
                                        lineHeight: 1.3,
                                    }}
                                >
                                    {article.title}
                                </Typography>

                                <Stack direction="row" spacing={1} alignItems="center">
                                    <Chip
                                        label={article.category || 'Article'}
                                        size="small"
                                        sx={{
                                            height: 20,
                                            fontSize: '0.6rem',
                                            fontFamily: '"Courier New", monospace',
                                            bgcolor: 'transparent',
                                            border: `1px solid ${colors.border}`,
                                            borderRadius: 0,
                                            color: colors.textSecondary,
                                        }}
                                    />

                                    <Stack direction="row" spacing={0.5} alignItems="center">
                                        <Visibility sx={{ fontSize: 12, color: colors.textSecondary }} />
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                fontFamily: '"Courier New", monospace',
                                                color: colors.textSecondary,
                                            }}
                                        >
                                            {article.viewCount?.toLocaleString() || '0'}
                                        </Typography>
                                    </Stack>

                                    <Stack direction="row" spacing={0.5} alignItems="center">
                                        <ChatBubbleOutline sx={{ fontSize: 12, color: colors.textSecondary }} />
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                fontFamily: '"Courier New", monospace',
                                                color: colors.textSecondary,
                                            }}
                                        >
                                            {article.commentCount || '0'}
                                        </Typography>
                                    </Stack>

                                    <Stack direction="row" spacing={0.5} alignItems="center">
                                        <Schedule sx={{ fontSize: 12, color: colors.textSecondary }} />
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                fontFamily: '"Courier New", monospace',
                                                color: colors.textSecondary,
                                            }}
                                        >
                                            {article.readMins || '5'} min
                                        </Typography>
                                    </Stack>
                                </Stack>
                            </Stack>
                        </ListItem>
                        {index < articles.length - 1 && (
                            <Divider sx={{ borderColor: colors.border }} />
                        )}
                    </Box>
                ))}
            </List>
        </Paper>
    );
}
