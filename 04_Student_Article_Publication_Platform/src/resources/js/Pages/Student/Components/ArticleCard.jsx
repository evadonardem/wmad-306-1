import { Box, Chip, Typography, Stack, Paper, IconButton } from '@mui/material';
import {
    BookmarkBorderRounded as BookmarkBorderRoundedIcon,
    BookmarkRounded as BookmarkRoundedIcon,
    VisibilityOutlined as VisibilityOutlinedIcon,
    ChatBubbleOutlineRounded as ChatBubbleOutlineRoundedIcon,
} from '@mui/icons-material';
import { COLORS } from '../DashboardSections/dashboardTheme';

export default function ArticleCard({ article, bookmarked = false, onToggleBookmark }) {
    return (
        <Paper
            elevation={0}
            sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: 'background.paper',
                border: `1px solid ${COLORS.mediumPurple}`,
                transition: 'all 150ms ease',
                '&:hover': {
                    transform: 'scale(1.02)',
                    borderColor: COLORS.royalPurple,
                    boxShadow: '0 8px 24px rgba(55,48,107,0.12)',
                },
                mb: 1.5,
            }}
        >
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ flexWrap: 'wrap' }}>
                    <Chip
                        label={article.category || 'General'}
                        size="small"
                        sx={{ bgcolor: COLORS.royalPurple, color: '#fff', fontWeight: 600, borderRadius: 1.5 }}
                    />
                    <Typography variant="caption" sx={{ color: COLORS.mediumPurple, fontWeight: 500 }}>
                        {article.readMins || '5'} min read
                    </Typography>
                </Stack>

                <IconButton sx={{ color: COLORS.mediumPurple }} onClick={() => onToggleBookmark?.(article.id)}>
                    {bookmarked ? <BookmarkRoundedIcon /> : <BookmarkBorderRoundedIcon />}
                </IconButton>
            </Stack>

            <Typography variant="h3" sx={{ color: COLORS.deepPurple, fontSize: 20, fontWeight: 600, mb: 0.8 }}>
                {article.title}
            </Typography>

            <Typography variant="body2" sx={{ color: COLORS.royalPurple, mb: 1.2 }}>
                {article.excerpt || article.content?.slice(0, 120) || ''}
            </Typography>

            <Stack direction="row" spacing={1.6} alignItems="center" sx={{ color: COLORS.mediumPurple }}>
                <Stack direction="row" spacing={0.4} alignItems="center">
                    <VisibilityOutlinedIcon sx={{ fontSize: 16 }} />
                    <Typography variant="caption" sx={{ color: COLORS.deepPurple, fontWeight: 600 }}>
                        1.2k
                    </Typography>
                </Stack>
                <Stack direction="row" spacing={0.4} alignItems="center">
                    <ChatBubbleOutlineRoundedIcon sx={{ fontSize: 16 }} />
                    <Typography variant="caption" sx={{ color: COLORS.deepPurple, fontWeight: 600 }}>
                        {article.commentCount || 0}
                    </Typography>
                </Stack>
            </Stack>
        </Paper>
    );
}
