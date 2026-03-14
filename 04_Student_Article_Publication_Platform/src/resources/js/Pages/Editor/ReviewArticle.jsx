import { Head, useForm } from '@inertiajs/react';
import { useMemo } from 'react';
import {
    alpha,
    Box,
    Button,
    Card,
    CardContent,
    Divider,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import EditorLayout from '@/Layouts/EditorLayout';
import { getThemeColors, useThemeContext } from '@/Components/ThemeContext';

function formatDate(value) {
    if (!value) return '-';
    return new Date(value).toLocaleString();
}

export default function ReviewArticle({ article, availableRoles = [] }) {
    const { theme: currentTheme } = useThemeContext();
    const colors = getThemeColors(currentTheme);

    const revisionForm = useForm({ notes: '' });
    const rejectForm = useForm({ reason: '' });
    const commentForm = useForm({ body: '' });

    const sortedRevisions = useMemo(
        () => [...(article?.revisions || [])].sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0)),
        [article?.revisions],
    );

    return (
        <EditorLayout active="queue" availableRoles={availableRoles}>
            <Head title={`Review: ${article?.title || 'Article'}`} />

            <Box sx={{ mb: 2 }}>
                <Typography variant="h5" fontWeight={900} sx={{ color: colors.newsprint }}>
                    Editorial Review
                </Typography>
                <Typography variant="body2" sx={{ color: colors.byline }}>
                    Review content and leave editorial feedback. Direct article editing is intentionally disabled.
                </Typography>
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', xl: '1.6fr 1fr' }, gap: 1.5 }}>
                <Card elevation={0} sx={{ border: '1px solid', borderColor: alpha(colors.border, 0.7) }}>
                    <CardContent>
                        <Typography variant="h5" fontWeight={900} sx={{ color: colors.newsprint, mb: 1 }}>
                            {article.title}
                        </Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 2 }}>
                            <Typography variant="caption" sx={{ color: colors.byline }}>
                                Author: {article.author?.name || 'Unknown'}
                            </Typography>
                            <Typography variant="caption" sx={{ color: colors.byline }}>
                                Category: {article.category?.name || 'Uncategorized'}
                            </Typography>
                            <Typography variant="caption" sx={{ color: colors.byline }}>
                                Submitted: {formatDate(article.submitted_at)}
                            </Typography>
                        </Stack>
                        <Divider sx={{ mb: 2 }} />
                        {/* <Typography
                            variant="body1"
                            component="div"
                            sx={{ color: colors.ink, lineHeight: 1.8, whiteSpace: 'pre-wrap' }}
                        >
                            {article.content}
                        </Typography> */}
                        <div dangerouslySetInnerHTML={{ __html: article.content }} />
                    </CardContent>
                </Card>

                <Stack spacing={1.5}>
                    <Card elevation={0} sx={{ border: '1px solid', borderColor: alpha(colors.border, 0.7) }}>
                        <CardContent>
                            <Typography variant="h6" fontWeight={800} sx={{ color: colors.newsprint, mb: 1.25 }}>
                                Editorial Actions
                            </Typography>

                            <Stack spacing={1.25}>
                                <TextField
                                    multiline
                                    minRows={3}
                                    label="Revision notes"
                                    value={revisionForm.data.notes}
                                    onChange={(e) => revisionForm.setData('notes', e.target.value)}
                                    error={Boolean(revisionForm.errors.notes)}
                                    helperText={revisionForm.errors.notes}
                                />
                                <Button
                                    variant="outlined"
                                    onClick={() =>
                                        revisionForm.post(route('editor.articles.requestRevision', article.id), {
                                            preserveScroll: true,
                                        })
                                    }
                                    disabled={revisionForm.processing || !revisionForm.data.notes.trim()}
                                >
                                    Return for Revision
                                </Button>

                                <TextField
                                    multiline
                                    minRows={3}
                                    label="Rejection reason"
                                    value={rejectForm.data.reason}
                                    onChange={(e) => rejectForm.setData('reason', e.target.value)}
                                    error={Boolean(rejectForm.errors.reason)}
                                    helperText={rejectForm.errors.reason}
                                />
                                <Button
                                    color="error"
                                    variant="outlined"
                                    onClick={() =>
                                        rejectForm.post(route('editor.articles.reject', article.id), { preserveScroll: true })
                                    }
                                    disabled={rejectForm.processing || !rejectForm.data.reason.trim()}
                                >
                                    Reject Entry
                                </Button>

                                <Button
                                    variant="contained"
                                    sx={{ bgcolor: colors.newsprint, '&:hover': { bgcolor: colors.accent } }}
                                    onClick={() => revisionForm.post(route('editor.articles.publish', article.id))}
                                    disabled={revisionForm.processing || rejectForm.processing}
                                >
                                    Accept and Publish
                                </Button>
                            </Stack>
                        </CardContent>
                    </Card>

                    <Card elevation={0} sx={{ border: '1px solid', borderColor: alpha(colors.border, 0.7) }}>
                        <CardContent>
                            <Typography variant="h6" fontWeight={800} sx={{ color: colors.newsprint, mb: 1.25 }}>
                                Reviewer Discussion
                            </Typography>
                            <TextField
                                multiline
                                minRows={2}
                                label="Comment on article"
                                value={commentForm.data.body}
                                onChange={(e) => commentForm.setData('body', e.target.value)}
                                error={Boolean(commentForm.errors.body)}
                                helperText={commentForm.errors.body || 'Visible in article comments after posting.'}
                                fullWidth
                            />
                            <Button
                                sx={{ mt: 1 }}
                                variant="outlined"
                                onClick={() =>
                                    commentForm.post(route('public.articles.comment', article.id), {
                                        preserveScroll: true,
                                        onSuccess: () => commentForm.reset('body'),
                                    })
                                }
                                disabled={commentForm.processing || !commentForm.data.body.trim()}
                            >
                                Post Comment
                            </Button>
                        </CardContent>
                    </Card>

                    <Card elevation={0} sx={{ border: '1px solid', borderColor: alpha(colors.border, 0.7) }}>
                        <CardContent>
                            <Typography variant="h6" fontWeight={800} sx={{ color: colors.newsprint, mb: 1.25 }}>
                                Revision History
                            </Typography>
                            <Stack spacing={1}>
                                {sortedRevisions.map((revision) => (
                                    <Box key={revision.id} sx={{ border: '1px solid', borderColor: alpha(colors.border, 0.7), p: 1 }}>
                                        <Typography variant="caption" sx={{ color: colors.byline }}>
                                            {revision.requester?.name || 'Editor'} | {formatDate(revision.created_at)}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: colors.ink }}>
                                            {revision.notes}
                                        </Typography>
                                    </Box>
                                ))}
                                {sortedRevisions.length === 0 && (
                                    <Typography variant="body2" sx={{ color: colors.byline }}>
                                        No revision requests yet.
                                    </Typography>
                                )}
                            </Stack>
                        </CardContent>
                    </Card>
                </Stack>
            </Box>
        </EditorLayout>
    );
}
