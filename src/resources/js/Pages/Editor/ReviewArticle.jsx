import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import {
    Alert,
    Box,
    Button,
    Chip,
    Container,
    Divider,
    Paper,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ReplayIcon from '@mui/icons-material/Replay';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import JoditEditor from 'jodit-react';
import { useRef, useMemo, useState } from 'react';

export default function ReviewArticle({ article }) {
    const { flash } = usePage().props;
    const editor = useRef(null);
    const [editing, setEditing] = useState(false);
    const revisionForm = useForm({ feedback: '' });
    const contentForm = useForm({ content: article.content ?? '' });

    const config = useMemo(() => ({
        readonly: false,
        placeholder: 'Edit article content...',
        height: 450,
    }), []);

    const handleRevision = (e) => {
        e.preventDefault();
        revisionForm.post(route('articles.revision', article.id), {
            onSuccess: () => revisionForm.reset(),
        });
    };

    const handlePublish = () => {
        if (confirm('Publish this article? It will be visible to all students.')) {
            revisionForm.post(route('articles.publish', article.id));
        }
    };

    const handleSaveContent = () => {
        contentForm.patch(route('editor.updateContent', article.id), {
            onSuccess: () => setEditing(false),
        });
    };

    return (
        <AuthenticatedLayout
            header={<Typography variant="h6">Review Article</Typography>}
        >
            <Head title="Review Article" />
            <Container maxWidth="lg" sx={{ py: 4 }}>

                {flash?.success && (
                    <Alert severity="success" sx={{ mb: 2 }}>{flash.success}</Alert>
                )}

                {/* Article Details */}
                <Paper elevation={2} sx={{ p: 4, mb: 3 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
                        <Box>
                            <Typography variant="h4" component="h1" gutterBottom>
                                {article.title}
                            </Typography>
                            <Stack direction="row" spacing={2}>
                                <Typography variant="body2" color="text.secondary">
                                    By <strong>{article.writer?.name}</strong>
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Category: <strong>{article.category?.name}</strong>
                                </Typography>
                            </Stack>
                        </Box>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Chip
                                label={article.status?.name}
                                color={
                                    article.status?.name === 'Published' ? 'success'
                                    : article.status?.name === 'Needs Revision' ? 'warning'
                                    : 'primary'
                                }
                                size="medium"
                            />
                            {!editing && (
                                <Button
                                    variant="outlined"
                                    size="small"
                                    startIcon={<EditIcon />}
                                    onClick={() => setEditing(true)}
                                >
                                    Edit Content
                                </Button>
                            )}
                        </Stack>
                    </Stack>

                    <Divider sx={{ my: 2 }} />

                    {editing ? (
                        <Box>
                            <JoditEditor
                                ref={editor}
                                value={contentForm.data.content}
                                config={config}
                                onBlur={(newContent) => contentForm.setData('content', newContent)}
                            />
                            {contentForm.errors.content && (
                                <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                                    {contentForm.errors.content}
                                </Typography>
                            )}
                            <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                                <Button
                                    variant="contained"
                                    startIcon={<SaveIcon />}
                                    onClick={handleSaveContent}
                                    disabled={contentForm.processing}
                                >
                                    Save Changes
                                </Button>
                                <Button
                                    variant="outlined"
                                    startIcon={<CloseIcon />}
                                    onClick={() => {
                                        contentForm.setData('content', article.content ?? '');
                                        setEditing(false);
                                    }}
                                >
                                    Cancel
                                </Button>
                            </Stack>
                        </Box>
                    ) : (
                        <Typography variant="body1" component="div"
                            dangerouslySetInnerHTML={{ __html: article.content }}
                            sx={{ lineHeight: 1.8 }}
                        />
                    )}
                </Paper>

                {/* Revision History */}
                {article.revisions?.length > 0 && (
                    <Paper elevation={1} sx={{ p: 3, mb: 3, bgcolor: 'grey.50' }}>
                        <Typography variant="h6" gutterBottom>Revision History</Typography>
                        <Stack spacing={2}>
                            {article.revisions.map((rev) => (
                                <Box key={rev.id} sx={{ pl: 2, borderLeft: 3, borderColor: 'warning.main' }}>
                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                        {new Date(rev.created_at).toLocaleDateString()}
                                    </Typography>
                                    <Typography variant="body2">{rev.feedback}</Typography>
                                </Box>
                            ))}
                        </Stack>
                    </Paper>
                )}

                {/* Editor Actions */}
                <Paper elevation={2} sx={{ p: 4 }}>
                    <Typography variant="h6" gutterBottom>Editor Actions</Typography>
                    <Divider sx={{ mb: 3 }} />

                    {article.status?.name === 'Needs Revision' ? (
                        <Stack spacing={2}>
                            <Alert severity="info">
                                This article is waiting for the writer to address your revision feedback and re-submit.
                            </Alert>
                            <Button
                                variant="text"
                                component={Link}
                                href={route('editor.dashboard')}
                            >
                                Back to Dashboard
                            </Button>
                        </Stack>
                    ) : (
                        <Box component="form" onSubmit={handleRevision}>
                            <Stack spacing={2}>
                                <TextField
                                    label="Revision Feedback"
                                    multiline
                                    rows={4}
                                    value={revisionForm.data.feedback}
                                    onChange={(e) => revisionForm.setData('feedback', e.target.value)}
                                    error={!!revisionForm.errors.feedback}
                                    helperText={revisionForm.errors.feedback ?? 'Describe what changes the writer should make.'}
                                    fullWidth
                                />
                                <Stack direction="row" spacing={2}>
                                    <Button
                                        type="submit"
                                        variant="outlined"
                                        color="warning"
                                        startIcon={<ReplayIcon />}
                                        disabled={revisionForm.processing}
                                    >
                                        Request Revision
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="success"
                                        startIcon={<CheckCircleIcon />}
                                        onClick={handlePublish}
                                        disabled={revisionForm.processing}
                                    >
                                        Publish Article
                                    </Button>
                                    <Button
                                        variant="text"
                                        component={Link}
                                        href={route('editor.dashboard')}
                                        sx={{ ml: 'auto' }}
                                    >
                                        Back to Dashboard
                                    </Button>
                                </Stack>
                            </Stack>
                        </Box>
                    )}
                </Paper>

            </Container>
        </AuthenticatedLayout>
    );
}
