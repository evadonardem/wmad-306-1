import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage, router } from '@inertiajs/react';
import {
    Alert,
    Avatar,
    Box,
    Button,
    Chip,
    Container,
    Divider,
    IconButton,
    Paper,
    Stack,
    TextField,
    Tooltip,
    Typography,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';

export default function ArticleDetail({ article }) {
    const { flash, auth } = usePage().props;
    const { data, setData, post, processing, errors, reset } = useForm({ content: '' });

    const handleComment = (e) => {
        e.preventDefault();
        post(route('articles.comment', article.id), {
            onSuccess: () => reset('content'),
        });
    };

    const handleDeleteComment = (commentId) => {
        if (confirm('Delete this comment?')) {
            router.delete(route('student.delete-comment', commentId));
        }
    };

    return (
        <AuthenticatedLayout
            header={<Typography variant="h6">Article</Typography>}
        >
            <Head title={article.title} />
            <Container maxWidth="md" sx={{ py: 4 }}>

                <Button
                    variant="text"
                    startIcon={<ArrowBackIcon />}
                    component={Link}
                    href={route('student.dashboard')}
                    sx={{ mb: 2 }}
                >
                    Back to Articles
                </Button>

                {flash?.success && (
                    <Alert severity="success" sx={{ mb: 2 }}>{flash.success}</Alert>
                )}

                {/* Article */}
                <Paper elevation={2} sx={{ p: 4, mb: 4 }}>
                    <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                        <Chip label={article.category?.name} size="small" color="primary" variant="outlined" />
                        <Chip label="Published" size="small" color="success" />
                    </Stack>

                    <Typography variant="h3" component="h1" gutterBottom sx={{ lineHeight: 1.3 }}>
                        {article.title}
                    </Typography>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        By <strong>{article.writer?.name}</strong> &bull;{' '}
                        {new Date(article.updated_at).toLocaleDateString()}
                    </Typography>

                    <Divider sx={{ mb: 3 }} />

                    <Typography
                        variant="body1"
                        component="div"
                        dangerouslySetInnerHTML={{ __html: article.content }}
                        sx={{ lineHeight: 1.9, '& img': { maxWidth: '100%' } }}
                    />
                </Paper>

                {/* Comments */}
                <Paper elevation={2} sx={{ p: 3 }}>
                    <Typography variant="h5" gutterBottom>
                        Comments ({article.comments?.length ?? 0})
                    </Typography>
                    <Divider sx={{ mb: 3 }} />

                    {/* Existing comments */}
                    {article.comments?.length === 0 ? (
                        <Typography color="text.secondary" sx={{ mb: 3 }}>
                            No comments yet. Be the first to comment!
                        </Typography>
                    ) : (
                        <Stack spacing={2} sx={{ mb: 3 }}>
                            {article.comments.map((comment) => (
                                <Box key={comment.id}>
                                    <Stack direction="row" spacing={2} alignItems="flex-start">
                                        <Avatar sx={{ width: 36, height: 36, bgcolor: 'primary.main', fontSize: 14 }}>
                                            {comment.student?.name?.[0]?.toUpperCase()}
                                        </Avatar>
                                        <Box sx={{ flexGrow: 1 }}>
                                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                                <Typography variant="subtitle2">
                                                    {comment.student?.name}
                                                    <Typography
                                                        component="span"
                                                        variant="caption"
                                                        color="text.secondary"
                                                        sx={{ ml: 1 }}
                                                    >
                                                        {new Date(comment.created_at).toLocaleDateString()}
                                                    </Typography>
                                                </Typography>
                                                {auth.user?.id === comment.student_id && (
                                                    <Tooltip title="Delete comment">
                                                        <IconButton
                                                            size="small"
                                                            color="error"
                                                            onClick={() => handleDeleteComment(comment.id)}
                                                        >
                                                            <DeleteIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                )}
                                            </Stack>
                                            <Typography variant="body2" sx={{ mt: 0.5 }}>
                                                {comment.content}
                                            </Typography>
                                        </Box>
                                    </Stack>
                                    <Divider sx={{ mt: 2 }} />
                                </Box>
                            ))}
                        </Stack>
                    )}

                    {/* Post a comment */}
                    <Box component="form" onSubmit={handleComment}>
                        <Typography variant="subtitle1" gutterBottom fontWeight="medium">
                            Post a Comment
                        </Typography>
                        <Stack spacing={2}>
                            <TextField
                                label="Your comment"
                                multiline
                                rows={3}
                                value={data.content}
                                onChange={(e) => setData('content', e.target.value)}
                                error={!!errors.content}
                                helperText={errors.content}
                                fullWidth
                            />
                            <Box>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    disabled={processing}
                                >
                                    Post Comment
                                </Button>
                            </Box>
                        </Stack>
                    </Box>
                </Paper>

            </Container>
        </AuthenticatedLayout>
    );
}
