import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import {
    Button, Paper, Typography, Box, Chip, Divider,
    TextField
} from '@mui/material';

export default function StudentDashboard({ auth, articles }) {
    const [activeArticle, setActiveArticle] = useState(null);
    const { data, setData, post, processing, reset } = useForm({
        content: '',
    });

    const submitComment = (e, articleId) => {
        e.preventDefault();
        post(route('articles.comment', articleId), {
            onSuccess: () => {
                reset();
                setActiveArticle(null); // Close the comment box after posting
            },
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="text-sm font-medium tracking-widest text-gray-500 dark:text-slate-400 uppercase">Student Reading Hub</h2>}
        >
            <Head title="Student Dashboard" />

            <div className="py-12 bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors duration-500">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <Paper elevation={3} sx={{ p: 4 }} className="dark:!bg-slate-900 dark:!text-white border dark:border-slate-800">
                        <Typography variant="h5" className="!font-black !mb-2">Published Articles</Typography>
                        <Typography variant="body2" className="text-gray-500 dark:text-slate-400 !mb-6">Read and engage with the latest publications from your peers.</Typography>

                        <div className="space-y-8">
                            {articles.length === 0 ? (
                                <Typography variant="body1">No published articles yet. Check back later!</Typography>
                            ) : (
                                articles.map((article) => (
                                    <Box key={article.id} className="p-6 border border-gray-100 dark:border-slate-800 rounded-xl">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <Typography variant="h6" className="!font-bold">{article.title}</Typography>
                                                <Typography variant="caption" className="!font-mono !uppercase !tracking-widest text-gray-500">
                                                    By {article.writer.name} • {article.category.name}
                                                </Typography>
                                            </div>
                                        </div>

                                        <Paper variant="outlined" sx={{ p: 3, bgcolor: 'transparent' }} className="dark:border-slate-700 !mb-4">
                                            {/* Safely render the Jodit HTML content */}
                                            <div dangerouslySetInnerHTML={{ __html: article.content }} className="prose dark:prose-invert max-w-none" />
                                        </Paper>

                                        <Divider className="dark:!border-slate-700 !my-4" />

                                        {/* Comments Section */}
                                        <div className="mt-4">
                                            <Typography variant="subtitle2" className="!font-bold !mb-4">
                                                Comments ({article.comments?.length || 0})
                                            </Typography>

                                            {article.comments?.length > 0 && (
                                                <div className="space-y-3 mb-4 pl-4 border-l-2 border-cyan-500">
                                                    {article.comments.map(comment => (
                                                        <div key={comment.id} className="bg-gray-50 dark:bg-slate-800/50 p-3 rounded-lg">
                                                            <Typography variant="caption" className="!font-bold text-cyan-600 dark:text-cyan-400 block">
                                                                {comment.student.name}
                                                            </Typography>
                                                            <Typography variant="body2">{comment.content}</Typography>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {activeArticle === article.id ? (
                                                <form onSubmit={(e) => submitComment(e, article.id)} className="mt-4">
                                                    <TextField
                                                        fullWidth
                                                        size="small"
                                                        label="Write a comment..."
                                                        variant="outlined"
                                                        value={data.content}
                                                        onChange={(e) => setData('content', e.target.value)}
                                                        InputLabelProps={{ className: 'dark:text-gray-400' }}
                                                        InputProps={{ className: 'dark:text-white dark:border-gray-700' }}
                                                        className="!mb-3"
                                                        required
                                                    />
                                                    <div className="flex gap-2 justify-end">
                                                        <Button size="small" onClick={() => setActiveArticle(null)} className="dark:!text-gray-400">Cancel</Button>
                                                        <Button size="small" type="submit" variant="contained" disabled={processing} className="!bg-cyan-600">Post Comment</Button>
                                                    </div>
                                                </form>
                                            ) : (
                                                <Button size="small" variant="outlined" onClick={() => setActiveArticle(article.id)} className="!border-cyan-600 !text-cyan-600 dark:!text-cyan-400">
                                                    Add Comment
                                                </Button>
                                            )}
                                        </div>
                                    </Box>
                                ))
                            )}
                        </div>
                    </Paper>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
