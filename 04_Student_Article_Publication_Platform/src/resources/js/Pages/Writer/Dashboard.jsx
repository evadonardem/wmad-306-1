import React, { useRef, useMemo } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import JoditEditor from 'jodit-react';
import {
    TextField, Button, MenuItem, FormControl, InputLabel, Select,
    Paper, Typography, Box, Chip, Divider
} from '@mui/material';

export default function Dashboard({ auth, articles, categories }) {
    const editor = useRef(null);
    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        content: '',
        category_id: '',
    });

    // Jodit Editor config to match your dark theme
    const config = useMemo(() => ({
        theme: 'dark',
        placeholder: 'Start writing your article...',
        height: 400,
    }), []);

    const submitDraft = (e) => {
        e.preventDefault();
        post(route('articles.store'), {
            onSuccess: () => reset(),
        });
    };

    const submitForReview = (articleId) => {
        router.post(route('articles.submit', articleId));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="text-sm font-medium tracking-widest text-gray-500 dark:text-slate-400 uppercase">Writer Command Center</h2>}
        >
            <Head title="Writer Dashboard" />

            <div className="py-12 bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors duration-500">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 flex flex-col md:flex-row gap-8">

                    {/* SIDEBAR: My Articles (Rubric Requirement) */}
                    <div className="w-full md:w-1/3 flex flex-col gap-6">
                        <Paper elevation={3} sx={{ p: 3, bgcolor: 'background.paper' }} className="dark:!bg-slate-900 dark:!text-white border dark:border-slate-800">
                            <Typography variant="h6" className="!font-mono !font-bold !uppercase !tracking-widest !text-sm !mb-4 dark:!text-cyan-500">
                                My Article Queue
                            </Typography>
                            <Divider className="dark:!border-slate-800 !mb-4" />

                            {articles.length === 0 ? (
                                <Typography variant="body2" className="text-gray-500 dark:text-slate-400">No articles yet. Start writing!</Typography>
                            ) : (
                                <div className="space-y-4">
                                    {articles.map((article) => (
                                        <Box key={article.id} className="p-4 border border-gray-100 dark:border-slate-800 rounded-xl hover:border-cyan-500/50 transition-colors">
                                            <Typography variant="subtitle1" className="!font-bold">{article.title}</Typography>
                                            <div className="flex justify-between items-center mt-2">
                                                <Chip
                                                    label={article.status.label}
                                                    size="small"
                                                    color={article.status.name === 'draft' ? 'default' : (article.status.name === 'needs_revision' ? 'error' : 'success')}
                                                    className="!text-[10px] !uppercase !tracking-widest !font-mono"
                                                />
                                                {/* Only allow submission if it's a draft or needs revision */}
                                                {['draft', 'needs_revision'].includes(article.status.name) && (
                                                    <Button
                                                        size="small"
                                                        variant="contained"
                                                        color="primary"
                                                        onClick={() => submitForReview(article.id)}
                                                        className="!bg-cyan-600 hover:!bg-cyan-500 !text-[10px]"
                                                    >
                                                        Submit
                                                    </Button>
                                                )}
                                            </div>
                                        </Box>
                                    ))}
                                </div>
                            )}
                        </Paper>
                    </div>

                    {/* MAIN CONTENT: New Article Form (Rubric Requirement) */}
                    <div className="w-full md:w-2/3">
                        <Paper elevation={3} sx={{ p: 4 }} className="dark:!bg-slate-900 dark:!text-white border dark:border-slate-800">
                            <Typography variant="h5" className="!font-black !mb-6">Draft New Article</Typography>

                            <form onSubmit={submitDraft} className="space-y-6">
                                {/* MUI TextField */}
                                <TextField
                                    label="Article Title"
                                    variant="outlined"
                                    fullWidth
                                    required
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    error={!!errors.title}
                                    helperText={errors.title}
                                    InputLabelProps={{ className: 'dark:text-gray-400' }}
                                    InputProps={{ className: 'dark:text-white dark:border-gray-700' }}
                                />

                                {/* MUI Select / Dropdown */}
                                <FormControl fullWidth required error={!!errors.category_id}>
                                    <InputLabel id="category-label" className="dark:text-gray-400">Category</InputLabel>
                                    <Select
                                        labelId="category-label"
                                        value={data.category_id}
                                        label="Category"
                                        onChange={(e) => setData('category_id', e.target.value)}
                                        className="dark:text-white"
                                    >
                                        {categories.map((cat) => (
                                            <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                {/* Jodit Editor (Rubric Requirement) */}
                                <div className="dark:text-black">
                                    <Typography variant="caption" className="!font-mono !uppercase !tracking-widest !mb-2 block dark:!text-cyan-500/80">Article Content</Typography>
                                    <JoditEditor
                                        ref={editor}
                                        value={data.content}
                                        config={config}
                                        tabIndex={1}
                                        onBlur={(newContent) => setData('content', newContent)}
                                    />
                                    {errors.content && <Typography color="error" variant="caption">{errors.content}</Typography>}
                                </div>

                                {/* MUI Button */}
                                <div className="flex justify-end pt-4">
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        size="large"
                                        disabled={processing}
                                        className="!bg-gradient-to-r !from-cyan-500 !to-blue-600 !rounded-full !px-8 !font-bold"
                                    >
                                        {processing ? 'Saving...' : 'Save as Draft'}
                                    </Button>
                                </div>
                            </form>
                        </Paper>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
