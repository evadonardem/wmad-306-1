import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { Button, Paper, Typography, Box, Divider, TextField } from '@mui/material';

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
                setActiveArticle(null);
            },
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="text-sm font-medium tracking-widest text-gray-500 dark:text-slate-400 eclipse:text-rose-400 uppercase transition-colors">Student Reading Hub</h2>}
        >
            <Head title="Student Dashboard" />

            {/* Changed eclipse:bg-rose-950 to eclipse:bg-transparent so the layout background shows through */}
            <div className="py-12 bg-slate-50 dark:bg-slate-950 eclipse:bg-transparent min-h-screen transition-colors duration-500">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <Paper elevation={3} sx={{ p: 4 }} className="dark:!bg-slate-900 eclipse:!bg-rose-900/60 eclipse:backdrop-blur-xl dark:!text-white eclipse:!text-rose-50 border dark:border-slate-800 eclipse:border-red-900/50 transition-colors duration-500">
                        <Typography variant="h5" className="!font-black !mb-2">Published Articles</Typography>
                        <Typography variant="body2" className="text-gray-500 dark:text-slate-400 eclipse:text-rose-300 !mb-6 transition-colors">Read and engage with the latest publications from your peers.</Typography>

                        <div className="space-y-8">
                            {articles.length === 0 ? (
                                <Typography variant="body1">No published articles yet. Check back later!</Typography>
                            ) : (
                                articles.map((article) => (
                                    <Box key={article.id} className="p-6 border border-gray-100 dark:border-slate-800 eclipse:border-red-900/40 eclipse:bg-rose-950/40 rounded-xl transition-colors duration-500 hover:eclipse:shadow-[0_0_20px_rgba(220,38,38,0.15)]">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <Typography variant="h6" className="!font-bold">{article.title}</Typography>
                                                <Typography variant="caption" className="!font-mono !uppercase !tracking-widest text-gray-500 eclipse:text-red-400 transition-colors">
                                                    By {article.writer.name} • {article.category.name}
                                                </Typography>
                                            </div>
                                        </div>

                                        <Paper variant="outlined" sx={{ p: 3, bgcolor: 'transparent' }} className="dark:border-slate-700 eclipse:border-red-800/50 eclipse:bg-rose-900/20 !mb-4 transition-colors">
                                            <div
                                                dangerouslySetInnerHTML={{ __html: article.content }}
                                                className="prose dark:prose-invert max-w-none text-slate-800 dark:text-slate-200 eclipse:text-rose-200 [&_*]:dark:!text-slate-200 [&_*]:eclipse:!text-rose-200 transition-colors"
                                            />
                                        </Paper>

                                        <Divider className="dark:!border-slate-700 eclipse:!border-red-900/50 !my-4 transition-colors" />

                                        {/* Comments Section */}
                                        <div className="mt-4">
                                            <Typography variant="subtitle2" className="!font-bold !mb-4">
                                                Comments ({article.comments?.length || 0})
                                            </Typography>

                                            {article.comments?.length > 0 && (
                                                <div className="space-y-3 mb-4 pl-4 border-l-2 border-cyan-500 eclipse:border-red-600 transition-colors">
                                                    {article.comments.map(comment => (
                                                        <div key={comment.id} className="bg-gray-50 dark:bg-slate-800/50 eclipse:bg-rose-900/30 p-3 rounded-lg transition-colors">
                                                            <Typography variant="caption" className="!font-bold text-cyan-600 dark:text-cyan-400 eclipse:text-red-400 block transition-colors">
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
                                                        InputLabelProps={{ className: 'dark:text-gray-400 eclipse:text-rose-400 transition-colors' }}
                                                        InputProps={{ className: 'dark:text-white eclipse:text-rose-100 dark:border-gray-700 eclipse:border-red-800 transition-colors' }}
                                                        className="!mb-3"
                                                        required
                                                    />
                                                    <div className="flex gap-2 justify-end">
                                                        <Button size="small" onClick={() => setActiveArticle(null)} className="dark:!text-gray-400 eclipse:!text-rose-400">Cancel</Button>
                                                        <Button size="small" type="submit" variant="contained" disabled={processing} className="!bg-cyan-600 eclipse:!bg-red-700 hover:eclipse:!bg-red-600 eclipse:shadow-[0_0_15px_rgba(220,38,38,0.4)] transition-all">
                                                            Post Comment
                                                        </Button>
                                                    </div>
                                                </form>
                                            ) : (
                                                <Button size="small" variant="outlined" onClick={() => setActiveArticle(article.id)} className="!border-cyan-600 !text-cyan-600 dark:!text-cyan-400 eclipse:!border-red-600 eclipse:!text-red-500 hover:eclipse:!bg-red-900/20 transition-all">
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
