import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import {
    Button, Paper, Typography, Box, Chip,
    Dialog, DialogTitle, DialogContent, DialogActions, TextField
} from '@mui/material';

export default function EditorDashboard({ auth, articles = [] }) {
    const [selectedArticle, setSelectedArticle] = useState(null);
    const [actionType, setActionType] = useState(null);

    const { data, setData, post, processing, reset } = useForm({
        comments: '',
    });

    const openModal = (article, type) => {
        setSelectedArticle(article);
        setActionType(type);
    };

    const closeModal = () => {
        setSelectedArticle(null);
        setActionType(null);
        reset();
    };

    const handleAction = (e) => {
        e.preventDefault();
        const routeName = actionType === 'publish' ? 'articles.publish' : 'articles.revision';

        post(route(routeName, selectedArticle.id), {
            onSuccess: () => closeModal(),
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="text-sm font-medium tracking-widest text-gray-500 dark:text-slate-400 eclipse:text-rose-400 uppercase transition-colors">Editor Command Center</h2>}
        >
            <Head title="Editor Dashboard" />

            {/* Changed eclipse:bg-rose-950 to eclipse:bg-transparent so the layout background shows through */}
            <div className="py-12 bg-slate-50 dark:bg-slate-950 eclipse:bg-transparent min-h-screen transition-colors duration-500">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <Paper elevation={3} sx={{ p: 4 }} className="dark:!bg-slate-900 eclipse:!bg-rose-900/60 eclipse:backdrop-blur-xl dark:!text-white eclipse:!text-rose-50 border dark:border-slate-800 eclipse:border-red-900/50 transition-colors duration-500">
                        <Typography variant="h5" className="!font-black !mb-2">Review Queue</Typography>
                        <Typography variant="body2" className="text-gray-500 dark:text-slate-400 eclipse:text-rose-300 !mb-6 transition-colors">Evaluate pending articles and manage published content.</Typography>

                        <div className="space-y-6">
                            {articles.length === 0 ? (
                                <Typography variant="body1">No articles in the queue.</Typography>
                            ) : (
                                articles.map((article) => (
                                    <Box key={article.id} className="p-6 border border-gray-100 dark:border-slate-800 eclipse:border-red-900/40 eclipse:bg-rose-950/40 rounded-xl transition-colors duration-500 hover:eclipse:shadow-[0_0_20px_rgba(220,38,38,0.15)]">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <Typography variant="h6" className="!font-bold">{article.title}</Typography>
                                                <Typography variant="caption" className="!font-mono !uppercase !tracking-widest text-gray-500 eclipse:text-red-400 transition-colors">
                                                    By {article?.writer?.name} • {article?.category?.name}
                                                </Typography>
                                            </div>
                                            <Chip
                                                label={article?.status?.label || 'Unknown'}
                                                color={article?.status?.name === 'published' ? 'success' : 'warning'}
                                                className="!font-mono !uppercase !tracking-widest !text-[10px] eclipse:shadow-[0_0_10px_rgba(220,38,38,0.3)]"
                                            />
                                        </div>

                                        <Paper variant="outlined" sx={{ p: 3, bgcolor: 'transparent' }} className="dark:border-slate-700 eclipse:border-red-800/50 eclipse:bg-rose-900/20 !mb-4 transition-colors">
                                            <div
                                                dangerouslySetInnerHTML={{ __html: article.content }}
                                                className="prose dark:prose-invert max-w-none text-slate-800 dark:text-slate-200 eclipse:text-rose-200 [&_*]:dark:!text-slate-200 [&_*]:eclipse:!text-rose-200 transition-colors"
                                            />
                                        </Paper>

                                        {article?.status?.name === 'pending_review' && (
                                            <div className="flex gap-3 justify-end">
                                                <Button
                                                    variant="outlined"
                                                    color="error"
                                                    onClick={() => openModal(article, 'revise')}
                                                    className="!font-bold hover:eclipse:bg-red-900/30 eclipse:border-red-600 eclipse:text-red-500"
                                                >
                                                    Request Revision
                                                </Button>
                                                <Button
                                                    variant="contained"
                                                    color="success"
                                                    onClick={() => openModal(article, 'publish')}
                                                    className="!font-bold eclipse:!bg-red-700 hover:eclipse:!bg-red-600 eclipse:shadow-[0_0_15px_rgba(220,38,38,0.5)]"
                                                >
                                                    Publish
                                                </Button>
                                            </div>
                                        )}
                                    </Box>
                                ))
                            )}
                        </div>
                    </Paper>
                </div>
            </div>

            <Dialog
                open={!!selectedArticle}
                onClose={closeModal}
                PaperProps={{ className: 'dark:!bg-slate-900 eclipse:!bg-rose-950 dark:!text-white eclipse:!text-rose-50 eclipse:border eclipse:border-red-900/50 transition-colors' }}
            >
                <form onSubmit={handleAction}>
                    <DialogTitle className="!font-bold">
                        {actionType === 'publish' ? 'Confirm Publication' : 'Request Revision'}
                    </DialogTitle>
                    <DialogContent>
                        <Typography variant="body2" className="!mb-4 eclipse:text-rose-200">
                            {actionType === 'publish'
                                ? 'Are you sure you want to publish this article? It will be visible to all students.'
                                : 'Please provide feedback for the writer.'}
                        </Typography>

                        {actionType === 'revise' && (
                            <TextField
                                autoFocus
                                margin="dense"
                                label="Revision Comments"
                                type="text"
                                fullWidth
                                multiline
                                rows={4}
                                required
                                value={data.comments}
                                onChange={(e) => setData('comments', e.target.value)}
                                InputLabelProps={{ className: 'dark:text-gray-400 eclipse:text-rose-400 transition-colors' }}
                                InputProps={{ className: 'dark:text-white eclipse:text-rose-100 dark:border-gray-700 eclipse:border-red-800 transition-colors' }}
                            />
                        )}
                    </DialogContent>
                    <DialogActions className="!p-4">
                        <Button onClick={closeModal} className="dark:!text-gray-400 eclipse:!text-rose-400">Cancel</Button>
                        <Button
                            type="submit"
                            variant="contained"
                            color={actionType === 'publish' ? 'success' : 'primary'}
                            disabled={processing}
                            className={actionType === 'publish' ? "eclipse:!bg-red-700 eclipse:shadow-[0_0_15px_rgba(220,38,38,0.5)]" : "eclipse:!bg-rose-700"}
                        >
                            Confirm
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </AuthenticatedLayout>
    );
}
