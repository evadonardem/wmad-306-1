import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    Box,
    Button,
    Container,
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

export default function CreateArticle({ categories }) {
    const editor = useRef(null);
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        content: '',
        category_id: '',
    });

    const config = useMemo(() => ({
        readonly: false,
        placeholder: 'Start writing your article content here...',
        height: 400,
    }), []);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('articles.store'));
    };

    return (
        <AuthenticatedLayout
            header={<Typography variant="h6">Create New Article</Typography>}
        >
            <Head title="Create Article" />
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Paper elevation={2} sx={{ p: 4 }}>
                    <Typography variant="h4" component="h1" gutterBottom>
                        New Article
                    </Typography>

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
                                autoFocus
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
                                    Save as Draft
                                </Button>
                            </Stack>
                        </Stack>
                    </Box>
                </Paper>
            </Container>
        </AuthenticatedLayout>
    );
}
