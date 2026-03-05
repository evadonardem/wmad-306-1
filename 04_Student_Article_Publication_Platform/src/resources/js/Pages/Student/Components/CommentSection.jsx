import { useState } from 'react';
import { Box, Typography, Avatar, Stack, Paper, Divider, TextField, Button } from '@mui/material';
import { COLORS, DARK_COLORS } from '../DashboardSections/dashboardTheme';

export default function CommentSection({
    comments = [],
    isDark = false,
    textColor,
    mutedColor,
    onSubmitComment,
    isSubmitting = false,
    currentUserName = 'You',
    errorMessage = '',
}) {
    const [commentText, setCommentText] = useState('');
    const [replyingTo, setReplyingTo] = useState(null);
    const [replyText, setReplyText] = useState('');
    const primaryText = textColor || (isDark ? DARK_COLORS.textPrimary : COLORS.deepPurple);
    const secondaryText = mutedColor || (isDark ? DARK_COLORS.mediumPurple : COLORS.royalPurple);

    const handleSubmit = () => {
        const value = commentText.trim();
        if (!value || !onSubmitComment || isSubmitting) {
            return;
        }
        onSubmitComment(value);
        setCommentText('');
    };

    const handleReplySubmit = (parentId) => {
        const value = replyText.trim();
        if (!value || !onSubmitComment || isSubmitting) return;
        onSubmitComment(value, parentId);
        setReplyText('');
        setReplyingTo(null);
    };

    const renderReplies = (replies, parentId) => (
        <Stack spacing={1.5} sx={{ ml: 5, mt: 1 }}>
            {replies.map((reply) => (
                <Stack key={reply.id} direction="row" spacing={1.5}>
                    <Avatar sx={{ width: 28, height: 28, bgcolor: COLORS.royalPurple }}>
                        {reply.author?.charAt(0) || 'U'}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: primaryText }}>
                                {reply.author || 'Anonymous'}
                            </Typography>
                            <Typography variant="caption" sx={{ color: secondaryText }}>
                                • {reply.created_at ? new Date(reply.created_at).toLocaleString() : 'just now'}
                            </Typography>
                        </Stack>
                        <Typography variant="body2" sx={{ color: secondaryText }}>
                            {reply.body}
                        </Typography>
                    </Box>
                </Stack>
            ))}
        </Stack>
    );

    return (
        <Paper elevation={0} sx={{ p: 2, borderRadius: 2, bgcolor: 'background.paper' }}>
            <Typography variant="h3" sx={{ color: primaryText, fontSize: 20, fontWeight: 600, mb: 2 }}>
                Comments ({comments.length})
            </Typography>

            <Stack direction="row" spacing={1.5} sx={{ mb: 3 }}>
                <Avatar sx={{ width: 36, height: 36, bgcolor: COLORS.softPink }}>
                    {(currentUserName || 'U').charAt(0).toUpperCase()}
                </Avatar>
                <TextField
                    fullWidth
                    size="small"
                    placeholder="Add a comment..."
                    value={commentText}
                    onChange={(event) => setCommentText(event.target.value)}
                    onKeyDown={(event) => {
                        if (event.key === 'Enter' && !event.shiftKey) {
                            event.preventDefault();
                            handleSubmit();
                        }
                    }}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            '& fieldset': { borderColor: `${COLORS.mediumPurple}55` },
                            '&.Mui-focused': {
                                boxShadow: 'none',
                                outline: 'none',
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: COLORS.softPink,
                            },
                            '& input:focus': {
                                outline: 'none',
                            },
                        },
                    }}
                />
                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={isSubmitting || !commentText.trim()}
                    sx={{
                        bgcolor: COLORS.softPink,
                        color: '#fff',
                        borderRadius: 1.5,
                        textTransform: 'none',
                        minWidth: 88,
                        '&:hover': { bgcolor: COLORS.royalPurple },
                        '&:focus, &:focus-visible': {
                            outline: 'none',
                            boxShadow: `0 0 0 2px ${COLORS.softPink}55`,
                        },
                        '&.Mui-disabled': { opacity: 0.6, color: '#fff' },
                    }}
                >
                    {isSubmitting ? 'Posting...' : 'Post'}
                </Button>
            </Stack>

            {errorMessage ? (
                <Typography variant="caption" sx={{ color: COLORS.softPink, display: 'block', mb: 2 }}>
                    {errorMessage}
                </Typography>
            ) : null}

            <Divider sx={{ mb: 2, borderColor: `${COLORS.mediumPurple}30` }} />

            <Stack spacing={2}>
                {comments.map((comment) => (
                    <Box key={comment.id}>
                        <Stack direction="row" spacing={1.5}>
                            <Avatar sx={{ width: 32, height: 32, bgcolor: COLORS.royalPurple }}>
                                {comment.author?.charAt(0) || 'U'}
                            </Avatar>
                            <Box sx={{ flex: 1 }}>
                                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                                    <Typography variant="body2" sx={{ fontWeight: 600, color: primaryText }}>
                                        {comment.author || 'Anonymous'}
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: secondaryText }}>
                                        • {comment.created_at ? new Date(comment.created_at).toLocaleString() : 'just now'}
                                    </Typography>
                                </Stack>
                                <Typography variant="body2" sx={{ color: secondaryText }}>
                                    {comment.body}
                                </Typography>
                                <Button
                                    size="small"
                                    sx={{ mt: 0.5, color: COLORS.softPink, textTransform: 'none' }}
                                    onClick={() => setReplyingTo(comment.id)}
                                >
                                    Reply
                                </Button>
                                {replyingTo === comment.id && (
                                    <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                                        <TextField
                                            size="small"
                                            fullWidth
                                            placeholder="Write a reply..."
                                            value={replyText}
                                            onChange={(e) => setReplyText(e.target.value)}
                                            onKeyDown={(event) => {
                                                if (event.key === 'Enter' && !event.shiftKey) {
                                                    event.preventDefault();
                                                    handleReplySubmit(comment.id);
                                                }
                                            }}
                                        />
                                        <Button
                                            variant="contained"
                                            onClick={() => handleReplySubmit(comment.id)}
                                            disabled={isSubmitting || !replyText.trim()}
                                            sx={{ bgcolor: COLORS.softPink, color: '#fff', borderRadius: 1.5, textTransform: 'none' }}
                                        >
                                            {isSubmitting ? 'Posting...' : 'Reply'}
                                        </Button>
                                        <Button
                                            size="small"
                                            onClick={() => { setReplyingTo(null); setReplyText(''); }}
                                            sx={{ color: COLORS.mediumPurple, textTransform: 'none' }}
                                        >
                                            Cancel
                                        </Button>
                                    </Stack>
                                )}
                                {comment.replies && comment.replies.length > 0 && renderReplies(comment.replies, comment.id)}
                            </Box>
                        </Stack>
                    </Box>
                ))}
            </Stack>
        </Paper>
    );
}
