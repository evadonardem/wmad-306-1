import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    Alert,
    Box,
    Button,
    Chip,
    Container,
    Divider,
    FormControl,
    FormHelperText,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import JoditEditor from 'jodit-react';
import { useRef, useMemo } from 'react';

const STATUS_COLORS = {
    Draft: 'default',
    Submitted: 'primary',
    'Needs Revision': 'warning',
    Published: 'success',
};

export default function EditArticle({ article, categories }) {
    const editor = useRef(null);
    const { data, setData, patch, processing, errors } = useForm({
        title: article.title ?? '',
        content: article.content ?? '',
        category_id: article.category_id ?? '',
    });

    const config = useMemo(() => ({
        readonly: false,
        placeholder: 'Edit your article content here...',
        height: 400,
    }), []);

    const handleSubmit = (e) => {
        e.preventDefault();
        patch(route('articles.update', article.id));
    };

    const latestRevision = article.revisions?.[article.revisions.length - 1];

    return (
        <AuthenticatedLayout
            header={<Typography variant="h6">Edit Article</Typography>}
        >
            <Head title="Edit Article" />
            <Container maxWidth="lg" sx={{ py: 4 }}>

                {/* Revision feedback banner */}
                {article.status?.name === 'Needs Revision' && latestRevision && (
                    <Alert severity="warning" sx={{ mb: 3 }}>
                        <Typography variant="subtitle2" gutterBottom>
                            Editor Feedback:
                        </Typography>
                        {latestRevision.feedback}
                    </Alert>
                )}

                <Paper elevation={2} sx={{ p: 4 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                        <Typography variant="h4" component="h1">
                            Edit Article
                        </Typography>
                        <Chip
                            label={article.status?.name}
                            color={STATUS_COLORS[article.status?.name] ?? 'default'}
                        />
                    </Stack>

                    <Divider sx={{ mb: 3 }} />

                    <Box component="form" onSubmit={handleSubmit}>
                        <Stack spacing={3}>
                            <TextField
                                label="Title"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                error={!!errors.title}
                                helperText={errors.title}
                                fullWidth
                                required
                            />

                            <FormControl fullWidth error={!!errors.category_id} required>
                                <InputLabel>Category</InputLabel>
                                <Select
                                    value={data.category_id}
                                    onChange={(e) => setData('category_id', e.target.value)}
                                    label="Category"
                                >
                                    {categories.map((cat) => (
                                        <MenuItem key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {errors.category_id && (
                                    <FormHelperText>{errors.category_id}</FormHelperText>
                                )}
                            </FormControl>

                            <Box>
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                    Content <span style={{ color: 'red' }}>*</span>
                                </Typography>
                                <JoditEditor
                                    ref={editor}
                                    value={data.content}
                                    config={config}
                                    onBlur={(newContent) => setData('content', newContent)}
                                />
                                {errors.content && (
                                    <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                                        {errors.content}
                                    </Typography>
                                )}
                            </Box>

                            <Stack direction="row" spacing={2} justifyContent="flex-end">
                                <Button
                                    variant="outlined"
                                    component={Link}
                                    href={route('writer.dashboard')}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    disabled={processing}
                                >
                                    Save Changes
                                </Button>
                            </Stack>
                        </Stack>
                    </Box>
                </Paper>
            </Container>
        </AuthenticatedLayout>
    );
}
