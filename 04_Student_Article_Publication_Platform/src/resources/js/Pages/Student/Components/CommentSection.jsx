import { useState } from 'react';
import { Box, Typography, Avatar, Stack, Paper, Divider, TextField, Button } from '@mui/material';
import { useTheme } from '@/Contexts/ThemeContext';

// Recursive component for rendering comments and their replies
const CommentItem = ({
    comment,
    onSubmitReply,
    isSubmitting,
    currentUserName,
    colors,
    isDarkMode,
    level = 0
}) => {
    const [isReplying, setIsReplying] = useState(false);
    const [replyText, setReplyText] = useState('');
    const maxDepth = 5; // Prevent infinite nesting

    const handleReplySubmit = () => {
        const value = replyText.trim();
        if (!value || !onSubmitReply || isSubmitting) return;

        // Pass the parent ID (current comment's ID) and the level
        onSubmitReply(value, comment.id, level + 1);
        setReplyText('');
        setIsReplying(false);
    };

    const marginLeft = level > 0 ? 4 : 0;
    const avatarSize = level === 0 ? 32 : 28;

    return (
        <Box sx={{ ml: marginLeft }}>
            <Stack direction="row" spacing={1.5}>
                <Avatar sx={{
                    width: avatarSize,
                    height: avatarSize,
                    bgcolor: colors.accent,
                    color: colors.background,
                    fontSize: avatarSize === 32 ? '1rem' : '0.875rem',
                    fontWeight: 600,
                }}>
                    {comment.author?.charAt(0) || 'U'}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5, flexWrap: 'wrap', gap: 0.5 }}>
                        <Typography variant="body2" sx={{
                            fontWeight: 700,
                            color: colors.text,
                            fontFamily: '"Times New Roman", Times, serif',
                        }}>
                            {comment.author || 'Anonymous'}
                            {comment.author === currentUserName && ' (You)'}
                        </Typography>
                        <Typography variant="caption" sx={{
                            color: colors.textSecondary,
                            fontFamily: '"Courier New", monospace',
                        }}>
                            • {comment.created_at ? new Date(comment.created_at).toLocaleString() : 'just now'}
                        </Typography>
                    </Stack>

                    <Typography variant="body2" sx={{
                        color: colors.text,
                        fontFamily: '"Times New Roman", Times, serif',
                        lineHeight: 1.6,
                        mb: 1,
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                    }}>
                        {comment.body}
                    </Typography>

                    {/* Reply button - only show if not at max depth */}
                    {level < maxDepth && (
                        <Button
                            size="small"
                            sx={{
                                mt: 0.5,
                                color: colors.textSecondary,
                                textTransform: 'none',
                                fontFamily: '"Times New Roman", Times, serif',
                                fontWeight: 600,
                                fontSize: '0.8rem',
                                p: 0,
                                minWidth: 'auto',
                                '&:hover': {
                                    color: colors.accent,
                                    backgroundColor: 'transparent',
                                }
                            }}
                            onClick={() => setIsReplying(true)}
                        >
                            Reply
                        </Button>
                    )}

                    {/* Reply input field */}
                    {isReplying && (
                        <Box sx={{ mt: 2, mb: 2 }}>
                            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
                                <Avatar sx={{
                                    width: 24,
                                    height: 24,
                                    bgcolor: colors.accent,
                                    color: colors.background,
                                    fontSize: '0.7rem',
                                    flexShrink: 0,
                                }}>
                                    {(currentUserName || 'U').charAt(0).toUpperCase()}
                                </Avatar>
                                <TextField
                                    size="small"
                                    fullWidth
                                    placeholder={`Reply to ${comment.author || 'Anonymous'}...`}
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    onKeyDown={(event) => {
                                        if (event.key === 'Enter' && !event.shiftKey) {
                                            event.preventDefault();
                                            handleReplySubmit();
                                        }
                                    }}
                                    sx={{
                                        flex: 1,
                                        minWidth: 200,
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 0,
                                            color: colors.text,
                                            fontSize: '0.9rem',
                                            fontFamily: '"Times New Roman", Times, serif',
                                            backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                                            '& fieldset': {
                                                borderColor: colors.border,
                                            },
                                            '&:hover fieldset': {
                                                borderColor: colors.accent,
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: colors.accent,
                                            },
                                        },
                                        '& .MuiInputBase-input::placeholder': {
                                            color: colors.textSecondary,
                                            opacity: 1,
                                        },
                                    }}
                                />
                            </Stack>
                            <Stack direction="row" spacing={1} sx={{ mt: 1, justifyContent: 'flex-end' }}>
                                <Button
                                    size="small"
                                    onClick={() => {
                                        setIsReplying(false);
                                        setReplyText('');
                                    }}
                                    sx={{
                                        color: colors.textSecondary,
                                        textTransform: 'none',
                                        fontFamily: '"Times New Roman", Times, serif',
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    size="small"
                                    variant="contained"
                                    onClick={handleReplySubmit}
                                    disabled={isSubmitting || !replyText.trim()}
                                    sx={{
                                        bgcolor: colors.accent,
                                        color: colors.background,
                                        borderRadius: 0,
                                        textTransform: 'none',
                                        fontFamily: '"Times New Roman", Times, serif',
                                        '&:hover': {
                                            bgcolor: colors.accent,
                                            filter: 'brightness(0.9)',
                                        },
                                        '&.Mui-disabled': {
                                            opacity: 0.5,
                                        },
                                    }}
                                >
                                    {isSubmitting ? '...' : 'Reply'}
                                </Button>
                            </Stack>
                        </Box>
                    )}

                    {/* Render replies recursively */}
                    {comment.replies && comment.replies.length > 0 && (
                        <Box sx={{
                            mt: 2,
                            ml: level < 2 ? 2 : 1,
                            pl: 1,
                            borderLeft: level < 3 ? `1px solid ${colors.border}` : 'none',
                        }}>
                            <Stack spacing={2}>
                                {comment.replies.map((reply) => (
                                    <CommentItem
                                        key={reply.id}
                                        comment={reply}
                                        onSubmitReply={onSubmitReply}
                                        isSubmitting={isSubmitting}
                                        currentUserName={currentUserName}
                                        colors={colors}
                                        isDarkMode={isDarkMode}
                                        level={level + 1}
                                    />
                                ))}
                            </Stack>
                        </Box>
                    )}
                </Box>
            </Stack>

            {/* Divider for top-level comments */}
            {level === 0 && (
                <Divider sx={{ my: 2, borderColor: colors.border }} />
            )}
        </Box>
    );
};

export default function CommentSection({
    comments = [],
    onSubmitComment,
    isSubmitting = false,
    currentUserName = 'You',
    errorMessage = '',
}) {
    const { colors, isDarkMode } = useTheme();
    const [commentText, setCommentText] = useState('');

    const handleSubmit = () => {
        const value = commentText.trim();
        if (!value || !onSubmitComment || isSubmitting) {
            return;
        }
        // Pass null as parentId for top-level comments
        onSubmitComment(value, null, 0);
        setCommentText('');
    };

    // Wrapper for handling replies at any depth
    const handleReplySubmit = (replyText, parentId, level) => {
        if (!onSubmitComment || isSubmitting) return;
        onSubmitComment(replyText, parentId, level);
    };

    return (
        <Paper elevation={0} sx={{
            p: 2,
            borderRadius: 0,
            bgcolor: 'transparent',
            border: `1px solid ${colors.border}`,
            width: '100%',
            overflow: 'hidden',
        }}>
            {/* Header */}
            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{
                    mb: 2,
                    flexWrap: 'wrap',
                    gap: 1,
                }}
            >
                <Typography
                    variant="h6"
                    sx={{
                        color: colors.text,
                        fontSize: 18,
                        fontWeight: 700,
                        fontFamily: '"Times New Roman", Times, serif',
                        letterSpacing: 0.5,
                        textTransform: 'uppercase',
                    }}
                >
                    Discussion
                </Typography>
                <Typography
                    sx={{
                        fontFamily: '"Courier New", monospace',
                        fontSize: '0.75rem',
                        color: colors.accent,
                        px: 1,
                        py: 0.5,
                        border: `1px solid ${colors.border}`,
                        whiteSpace: 'nowrap',
                    }}
                >
                    {countAllComments(comments)} {countAllComments(comments) === 1 ? 'Comment' : 'Comments'}
                </Typography>
            </Stack>

            {/* Top-level comment input */}
            <Stack
                direction="row"
                spacing={1.5}
                sx={{
                    mb: 3,
                    flexWrap: { xs: 'wrap', sm: 'nowrap' },
                }}
            >
                <Avatar sx={{
                    width: 36,
                    height: 36,
                    bgcolor: colors.accent,
                    color: colors.background,
                    fontFamily: '"Times New Roman", Times, serif',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    flexShrink: 0,
                }}>
                    {(currentUserName || 'U').charAt(0).toUpperCase()}
                </Avatar>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <TextField
                        fullWidth
                        multiline
                        minRows={2}
                        maxRows={4}
                        size="small"
                        placeholder="Share your thoughts..."
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
                                borderRadius: 0,
                                color: colors.text,
                                backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                                fontFamily: '"Times New Roman", Times, serif',
                                '& fieldset': {
                                    borderColor: colors.border,
                                },
                                '&:hover fieldset': {
                                    borderColor: colors.accent,
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: colors.accent,
                                },
                            },
                            '& .MuiInputBase-input': {
                                color: colors.text,
                            },
                            '& .MuiInputBase-input::placeholder': {
                                color: colors.textSecondary,
                                opacity: 1,
                                fontFamily: '"Times New Roman", Times, serif',
                                fontStyle: 'italic',
                            },
                        }}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                        <Button
                            variant="outlined"
                            onClick={handleSubmit}
                            disabled={isSubmitting || !commentText.trim()}
                            sx={{
                                borderColor: colors.accent,
                                color: colors.accent,
                                borderRadius: 0,
                                textTransform: 'none',
                                fontWeight: 600,
                                fontFamily: '"Times New Roman", Times, serif',
                                '&:hover': {
                                    borderColor: colors.accent,
                                    backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.02)',
                                },
                                '&.Mui-disabled': {
                                    opacity: 0.5,
                                    borderColor: colors.textSecondary,
                                    color: colors.textSecondary,
                                },
                            }}
                        >
                            {isSubmitting ? 'Posting...' : 'Post Comment'}
                        </Button>
                    </Box>
                </Box>
            </Stack>

            {errorMessage && (
                <Typography variant="caption" sx={{
                    color: '#FF4444',
                    display: 'block',
                    mb: 2,
                    fontFamily: '"Times New Roman", Times, serif',
                }}>
                    {errorMessage}
                </Typography>
            )}

            <Divider sx={{ mb: 2, borderColor: colors.border }} />

            {/* Comments List - Scrollable if needed */}
            <Box sx={{
                maxHeight: 500,
                overflowY: 'auto',
                pr: 1,
                '&::-webkit-scrollbar': {
                    width: 6,
                },
                '&::-webkit-scrollbar-track': {
                    background: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                },
                '&::-webkit-scrollbar-thumb': {
                    background: colors.accent,
                    borderRadius: 0,
                },
            }}>
                {comments.length === 0 ? (
                    <Box sx={{ py: 4, textAlign: 'center' }}>
                        <Typography
                            sx={{
                                color: colors.textSecondary,
                                fontFamily: '"Times New Roman", Times, serif',
                                fontStyle: 'italic',
                            }}
                        >
                            No comments yet. Be the first to share your thoughts!
                        </Typography>
                    </Box>
                ) : (
                    <Stack spacing={2}>
                        {comments && comments.map((comment) => (
                            <CommentItem
                                key={comment.id}
                                comment={comment}
                                onSubmitReply={handleReplySubmit}
                                isSubmitting={isSubmitting}
                                currentUserName={currentUserName}
                                colors={colors}
                                isDarkMode={isDarkMode}
                                level={0}
                            />
                        ))}
                    </Stack>
                )}
            </Box>
        </Paper>
    );
}

// Helper function to count all comments including nested replies
function countAllComments(comments) {
    if (!comments || !Array.isArray(comments)) return 0;

    return comments.reduce((count, comment) => {
        let total = 1; // Count this comment
        if (comment.replies && comment.replies.length > 0) {
            total += countAllComments(comment.replies);
        }
        return count + total;
    }, 0);
}
