import { Box, Chip, Typography, Stack, Paper, IconButton } from '@mui/material';
import {
    BookmarkBorderRounded as BookmarkBorderRoundedIcon,
    BookmarkRounded as BookmarkRoundedIcon,
    VisibilityOutlined as VisibilityOutlinedIcon,
    ChatBubbleOutlineRounded as ChatBubbleOutlineRoundedIcon,
} from '@mui/icons-material';
import { COLORS } from '../DashboardSections/dashboardTheme';

import { useTheme } from '@mui/material/styles';

export default function ArticleCard({ article, bookmarked = false, onToggleBookmark }) {
    const theme = useTheme();
    return (
        <Paper
            elevation={0}
            sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
                transition: 'all 150ms ease',
                '&:hover': {
                    transform: 'scale(1.02)',
                    borderColor: theme.palette.primary.main,
                    boxShadow: theme.shadows[4],
                },
                mb: 1.5,
            }}
        >
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ flexWrap: 'wrap' }}>
                    <Chip
                        label={article.category || 'General'}
                        size="small"
                        sx={{ bgcolor: theme.palette.primary.main, color: theme.palette.primary.contrastText, fontWeight: 600, borderRadius: 1.5 }}
                    />
                </Stack>
                <IconButton sx={{ color: theme.palette.secondary.main }} onClick={() => onToggleBookmark?.(article.id)}>
                    {bookmarked ? <BookmarkRoundedIcon /> : <BookmarkBorderRoundedIcon />}
                </IconButton>
            </Stack>

            <Typography variant="h3" sx={{ color: theme.palette.primary.dark, fontSize: 20, fontWeight: 600, mb: 0.8 }}>
                {article.title}
            </Typography>

            <Typography variant="body2" sx={{ color: theme.palette.primary.main, mb: 1.2 }}>
                {article.excerpt || article.content?.slice(0, 120) || ''}
            </Typography>

            <Stack direction="row" spacing={1.6} alignItems="center" sx={{ color: theme.palette.secondary.main }}>
                <Stack direction="row" spacing={0.4} alignItems="center">
                        {/*
                          Render article HTML content. This uses dangerouslySetInnerHTML, so ensure content is sanitized on the backend to prevent XSS.
                        */}
                        {article.content && (
                            <Box
                                sx={{
                                    mb: 1.2,
                                    color: theme.palette.text.primary,
                                    fontSize: 16,
                                    wordBreak: 'break-word',
                                    overflowWrap: 'anywhere',
                                }}
                                dangerouslySetInnerHTML={{ __html: article.content }}
                            />
                        )}
                    <VisibilityOutlinedIcon sx={{ fontSize: 16 }} />
                    <Typography variant="caption" sx={{ color: theme.palette.primary.dark, fontWeight: 600 }}>
                        1.2k
                    </Typography>
                </Stack>
                <Stack direction="row" spacing={0.4} alignItems="center">
                    <ChatBubbleOutlineRoundedIcon sx={{ fontSize: 16 }} />
                    <Typography variant="caption" sx={{ color: theme.palette.primary.dark, fontWeight: 600 }}>
                        {article.commentCount || 0}
                    </Typography>
                </Stack>
            </Stack>
        </Paper>
    );
}
