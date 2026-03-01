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
            header={<h2 className="text-sm font-medium tracking-widest text-gray-500 dark:text-slate-400 uppercase">Editor Command Center</h2>}
        >
            <Head title="Editor Dashboard" />

            <div className="py-12 bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors duration-500">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <Paper elevation={3} sx={{ p: 4 }} className="dark:!bg-slate-900 dark:!text-white border dark:border-slate-800">
                        <Typography variant="h5" className="!font-black !mb-2">Review Queue</Typography>
                        <Typography variant="body2" className="text-gray-500 dark:text-slate-400 !mb-6">Evaluate pending articles and manage published content.</Typography>

                        <div className="space-y-6">
                            {articles.length === 0 ? (
                                <Typography variant="body1">No articles in the queue.</Typography>
                            ) : (
                                articles.map((article) => (
                                    <Box key={article.id} className="p-6 border border-gray-100 dark:border-slate-800 rounded-xl hover:shadow-lg transition-shadow">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <Typography variant="h6" className="!font-bold">{article.title}</Typography>
                                                <Typography variant="caption" className="!font-mono !uppercase !tracking-widest text-gray-500">
                                                    By {article?.writer?.name} • {article?.category?.name}
                                                </Typography>
                                            </div>
                                            <Chip
                                                label={article?.status?.label || 'Unknown'}
                                                color={article?.status?.name === 'published' ? 'success' : 'warning'}
                                                className="!font-mono !uppercase !tracking-widest !text-[10px]"
                                            />
                                        </div>

                                        <Paper variant="outlined" sx={{ p: 3, bgcolor: 'transparent' }} className="dark:border-slate-700 !mb-4">
                                            <div dangerouslySetInnerHTML={{ __html: article.content }} className="prose dark:prose-invert max-w-none" />
                                        </Paper>

                                        {article?.status?.name === 'pending_review' && (
                                            <div className="flex gap-3 justify-end">
                                                <Button
                                                    variant="outlined"
                                                    color="error"
                                                    onClick={() => openModal(article, 'revise')}
                                                    className="!font-bold"
                                                >
                                                    Request Revision
                                                </Button>
                                                <Button
                                                    variant="contained"
                                                    color="success"
                                                    onClick={() => openModal(article, 'publish')}
                                                    className="!font-bold"
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

            <Dialog open={!!selectedArticle} onClose={closeModal} PaperProps={{ className: 'dark:!bg-slate-900 dark:!text-white' }}>
                <form onSubmit={handleAction}>
                    <DialogTitle className="!font-bold">
                        {actionType === 'publish' ? 'Confirm Publication' : 'Request Revision'}
                    </DialogTitle>
                    <DialogContent>
                        <Typography variant="body2" className="!mb-4">
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
                                InputLabelProps={{ className: 'dark:text-gray-400' }}
                                InputProps={{ className: 'dark:text-white dark:border-gray-700' }}
                            />
                        )}
                    </DialogContent>
                    <DialogActions className="!p-4">
                        <Button onClick={closeModal} className="dark:!text-gray-400">Cancel</Button>
                        <Button
                            type="submit"
                            variant="contained"
                            color={actionType === 'publish' ? 'success' : 'primary'}
                            disabled={processing}
                        >
                            Confirm
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </AuthenticatedLayout>
    );
}
