import React, { useRef, useMemo, useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import JoditEditor from 'jodit-react';
import {
    TextField, Button, MenuItem, FormControl, InputLabel, Select,
    Paper, Typography, Box, Chip, Divider, IconButton,
    Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import UndoIcon from '@mui/icons-material/Undo';
import VisibilityIcon from '@mui/icons-material/Visibility';

export default function Dashboard({ auth, articles, categories }) {
    const editor = useRef(null);
    const formRef = useRef(null);

    // States for Modals
    const [confirmModal, setConfirmModal] = useState({ open: false, type: null, id: null });
    const [viewModal, setViewModal] = useState({ open: false, article: null });

    const { data, setData, post, put, processing, errors, reset } = useForm({
        id: null, title: '', content: '', category_id: '',
    });

    const config = useMemo(() => ({
        theme: 'dark',
        placeholder: 'Start writing your article...',
        height: 400,
    }), []);

    const queueArticles = articles.filter(a => ['draft', 'pending_review'].includes(a.status.name));
    const archiveArticles = articles.filter(a => ['published', 'needs_revision'].includes(a.status.name));

    const handleEdit = (article) => {
        setData({ id: article.id, title: article.title, content: article.content, category_id: article.category_id });
        formRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // Modal Triggers
    const triggerConfirm = (id, type) => setConfirmModal({ open: true, type, id });
    const closeConfirm = () => setConfirmModal({ open: false, type: null, id: null });

    const openView = (article) => setViewModal({ open: true, article });
    const closeView = () => setViewModal({ open: false, article: null });

    const executeAction = () => {
        const options = {
            preserveScroll: true, // FIXED: This stops the page from "rolling up"
            onFinish: () => closeConfirm()
        };

        if (confirmModal.type === 'delete') {
            router.delete(route('articles.destroy', confirmModal.id), options);
        } else if (confirmModal.type === 'unsubmit') {
            router.post(route('articles.unsubmit', confirmModal.id), {}, options);
        }
    };

    // Submit for review with preserved scroll
    const submitForReview = (id) => {
        router.post(route('articles.submit', id), {}, { preserveScroll: true });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="text-sm font-medium tracking-widest text-gray-500 dark:text-slate-400 eclipse:text-rose-400 uppercase transition-colors">Writer Command Center</h2>}
        >
            <Head title="Writer Dashboard" />

            <div className="py-12 bg-slate-50 dark:bg-slate-950 eclipse:bg-transparent min-h-screen transition-colors duration-500">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-8">

                    {/* SECTION 1: THE EDITOR */}
                    <div ref={formRef}>
                        <Paper elevation={3} sx={{ p: 4 }} className="dark:!bg-slate-900 eclipse:!bg-rose-900/60 eclipse:backdrop-blur-xl dark:!text-white eclipse:!text-rose-50 border dark:border-slate-800 eclipse:border-red-900/50 transition-colors">
                            <Typography variant="h5" className="!font-black !mb-6 text-slate-900 dark:text-white eclipse:text-rose-50">
                                {data.id ? 'Edit Article' : 'Draft New Article'}
                            </Typography>
                            <form onSubmit={e => { e.preventDefault(); data.id ? put(route('articles.revise', data.id), { preserveScroll: true, onSuccess: () => reset() }) : post(route('articles.store'), { preserveScroll: true, onSuccess: () => reset() }) }} className="space-y-6">
                                <TextField label="Article Title" variant="outlined" fullWidth required value={data.title} onChange={e => setData('title', e.target.value)} InputLabelProps={{ className: 'dark:text-gray-400 eclipse:text-rose-400' }} InputProps={{ className: 'dark:text-white eclipse:text-rose-100 dark:border-gray-700 eclipse:border-red-800' }} />
                                <FormControl fullWidth><InputLabel className="dark:text-gray-400 eclipse:text-rose-400">Category</InputLabel><Select value={data.category_id} label="Category" onChange={e => setData('category_id', e.target.value)} className="dark:text-white eclipse:text-rose-100">{categories.map(cat => <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>)}</Select></FormControl>
                                <JoditEditor ref={editor} value={data.content} config={config} onBlur={newContent => setData('content', newContent)} />
                                <div className="flex justify-end pt-4 gap-4">
                                    {data.id && <Button onClick={() => reset()} className="!text-gray-500 dark:!text-gray-400">Cancel Edit</Button>}
                                    <Button type="submit" variant="contained" disabled={processing} className="!bg-gradient-to-r !from-cyan-500 !to-blue-600 eclipse:!from-red-600 eclipse:!to-rose-900 !rounded-full !px-8 !font-bold">
                                        {data.id ? 'Update Article' : 'Save as Draft'}
                                    </Button>
                                </div>
                            </form>
                        </Paper>
                    </div>

                    {/* SECTION 2: THE COLUMNS */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* QUEUE COLUMN */}
                        <Paper sx={{ p: 3 }} className="dark:!bg-slate-900 eclipse:!bg-rose-900/60 eclipse:backdrop-blur-xl dark:!text-white border dark:border-slate-800 eclipse:border-red-900/50">
                            <Typography variant="h6" className="!font-mono !font-bold !uppercase !tracking-widest !text-sm !mb-4 eclipse:text-red-500">Active Queue</Typography>
                            <Divider className="eclipse:border-red-900/50 !mb-4" />
                            <div className="space-y-6">
                                {queueArticles.map(article => (
                                    <Box key={article.id} className="p-4 border border-gray-100 dark:border-slate-800 eclipse:border-red-900/40 eclipse:bg-rose-950/40 rounded-xl">
                                        <div className="flex justify-between items-start mb-2">
                                            <Typography variant="subtitle1" className="!font-bold text-slate-900 dark:text-white eclipse:text-rose-100">{article.title}</Typography>
                                            <Chip label={article.status.label} size="small" variant="outlined" sx={{ color: '#94a3b8', borderColor: '#475569' }} />
                                        </div>
                                        <div className="flex justify-end gap-2">
                                            <IconButton onClick={() => openView(article)} size="small" className="!text-gray-500 dark:!text-gray-400"><VisibilityIcon fontSize="small"/></IconButton>
                                            {article.status.name === 'draft' ? (
                                                <>
                                                    <IconButton onClick={() => handleEdit(article)} size="small" className="!text-cyan-500"><EditIcon fontSize="small"/></IconButton>
                                                    <IconButton onClick={() => triggerConfirm(article.id, 'delete')} size="small" className="!text-red-500"><DeleteIcon fontSize="small"/></IconButton>
                                                    <Button onClick={() => submitForReview(article.id)} variant="contained" size="small" className="!bg-cyan-600 !text-white !text-[10px]">Submit</Button>
                                                </>
                                            ) : (
                                                <Button onClick={() => triggerConfirm(article.id, 'unsubmit')} startIcon={<UndoIcon />} size="small" color="warning" className="!font-bold">Unsubmit</Button>
                                            )}
                                        </div>
                                    </Box>
                                ))}
                            </div>
                        </Paper>

                        {/* ARCHIVE COLUMN */}
                        <Paper sx={{ p: 3 }} className="dark:!bg-slate-900 eclipse:!bg-rose-900/60 eclipse:backdrop-blur-xl dark:!text-white border dark:border-slate-800 eclipse:border-red-900/50">
                            <Typography variant="h6" className="!font-mono !font-bold !uppercase !tracking-widest !text-sm !mb-4 eclipse:text-emerald-400">Archive</Typography>
                            <Divider className="eclipse:border-red-900/50 !mb-4" />
                            <div className="space-y-6">
                                {archiveArticles.map(article => (
                                    <Box key={article.id} className="p-4 border border-gray-100 dark:border-slate-800 eclipse:border-red-900/40 rounded-xl">
                                        <div className="flex justify-between items-start mb-4">
                                            <Typography variant="subtitle1" className="!font-bold text-slate-900 dark:text-white eclipse:text-rose-100">{article.title}</Typography>
                                            <Chip label={article.status.label} size="small" color={article.status.name === 'published' ? 'success' : 'error'} />
                                        </div>
                                        <div className="flex justify-end gap-2">
                                            <IconButton onClick={() => openView(article)} size="small" className="!text-gray-500 dark:!text-gray-400"><VisibilityIcon fontSize="small"/></IconButton>
                                            {article.status.name === 'needs_revision' && (
                                                <Button onClick={() => handleEdit(article)} startIcon={<EditIcon />} variant="outlined" size="small" className="!text-cyan-500 !border-cyan-500">Revise</Button>
                                            )}
                                        </div>
                                    </Box>
                                ))}
                            </div>
                        </Paper>
                    </div>
                </div>
            </div>

            {/* ACTION CONFIRMATION MODAL */}
            <Dialog open={confirmModal.open} onClose={closeConfirm} PaperProps={{ className: 'dark:!bg-slate-900 eclipse:!bg-rose-950 dark:!text-white eclipse:!text-rose-50 eclipse:border eclipse:border-red-900/50' }}>
                <DialogTitle className="!font-bold">{confirmModal.type === 'delete' ? 'Delete Draft?' : 'Unsubmit Article?'}</DialogTitle>
                <DialogContent><Typography variant="body2" className="text-slate-600 dark:text-slate-300 eclipse:text-rose-200">
                    {confirmModal.type === 'delete'
                        ? 'This action is permanent and will remove the draft article from your queue.'
                        : 'This will pull the article back from the editors review queue and place it in your drafts.'}
                </Typography></DialogContent>
                <DialogActions className="!p-4">
                    <Button onClick={closeConfirm} className="dark:!text-gray-400 eclipse:!text-rose-400">Cancel</Button>
                    <Button onClick={executeAction} variant="contained" className={confirmModal.type === 'delete' ? "!bg-red-600" : "!bg-rose-700"}>Confirm</Button>
                </DialogActions>
            </Dialog>

            {/* READ-ONLY VIEW MODAL */}
            <Dialog fullWidth maxWidth="md" open={viewModal.open} onClose={closeView} PaperProps={{ className: 'dark:!bg-slate-900 eclipse:!bg-rose-950 dark:!text-white eclipse:!text-rose-50 border eclipse:border-red-900/50' }}>
                <DialogTitle className="!font-bold border-b dark:border-slate-800 eclipse:border-red-900/30">
                    {viewModal.article?.title}
                    <Typography variant="caption" className="block text-gray-500 eclipse:text-red-400">
                        Category: {viewModal.article?.category?.name} | Status: {viewModal.article?.status?.label}
                    </Typography>
                </DialogTitle>
                <DialogContent className="!pt-6">
                    <div
                        dangerouslySetInnerHTML={{ __html: viewModal.article?.content }}
                        className="prose dark:prose-invert max-w-none text-slate-800 dark:text-slate-200 eclipse:text-rose-100"
                    />
                </DialogContent>
                <DialogActions className="!p-4">
                    <Button onClick={closeView} variant="contained" className="!bg-slate-700 eclipse:!bg-red-800">Close</Button>
                </DialogActions>
            </Dialog>
        </AuthenticatedLayout>
    );
}
