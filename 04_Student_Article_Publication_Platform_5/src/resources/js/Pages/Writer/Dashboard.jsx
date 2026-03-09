import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import JoditEditor from 'jodit-react';
import {
    TextField, Button, MenuItem, FormControl, InputLabel, Select,
    Paper, Typography, Box, Chip, Divider, IconButton,
    Dialog, DialogTitle, DialogContent, DialogActions, Tooltip
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import ReplyIcon from '@mui/icons-material/Reply';
import SendIcon from '@mui/icons-material/Send';
import UndoIcon from '@mui/icons-material/Undo';
import RefreshIcon from '@mui/icons-material/Refresh';
import DeleteIcon from '@mui/icons-material/Delete';

const timeAgo = (dateString) => {
    if (!dateString) return '';
    const seconds = Math.floor((new Date() - new Date(dateString)) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + "y";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + "mo";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + "d";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + "h";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + "m";
    return "just now";
};

const WriterCommentThread = ({ comment, auth, articleId, writerId, triggerCommentDelete, isReply = false }) => {
    const [isReplying, setIsReplying] = useState(false);
    const { data, setData, post, reset, processing } = useForm({ content: '', parent_id: comment.id });

    const submitReply = (e) => {
        e.preventDefault();
        post(route('articles.comment', articleId), {
            preserveScroll: true,
            onSuccess: () => { reset(); setIsReplying(false); }
        });
    };

    const isAuthor = comment.user?.id === writerId;
    const isMine = comment.user?.id === auth.user.id;

    return (
        <Box className={`${isReply ? 'ml-8 mt-2' : 'mt-4'} relative`}>
            {isReply && <div className="absolute -left-6 top-0 bottom-0 w-px bg-slate-300 dark:bg-slate-700" />}
            <div className={`p-3 rounded-2xl border transition-all duration-300 flex justify-between items-start ${
                isAuthor
                ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-800/40 eclipse:bg-rose-900 eclipse:border-rose-700/50'
                : 'bg-slate-50 dark:bg-slate-800/40 border-slate-100 dark:border-slate-700/50 eclipse:bg-rose-950 eclipse:border-rose-800/50'
            }`}>
                <div className="flex-1">
                    <Typography variant="subtitle2" className="!font-bold text-cyan-600 dark:text-cyan-400 eclipse:text-rose-200">
                        {comment.user?.name}
                        {isAuthor && <Chip label="AUTHOR" size="small" className="!h-4 !text-[7px] !font-black !bg-emerald-600 !text-white !ml-1" />}
                    </Typography>
                    <Typography variant="body2" className="text-slate-700 dark:text-slate-200 eclipse:text-rose-50">{comment.content}</Typography>
                    <Button size="small" onClick={() => setIsReplying(!isReplying)} startIcon={<ReplyIcon sx={{ fontSize: 14 }} />} className="!text-[10px] !text-gray-500">Reply</Button>
                </div>
                {isMine && (
                    <IconButton size="small" onClick={() => triggerCommentDelete(comment.id)} className="!text-red-400 opacity-60 hover:opacity-100"><DeleteIcon fontSize="small" /></IconButton>
                )}
            </div>
            {isReplying && (
                <form onSubmit={submitReply} className="ml-8 mt-2 flex gap-2">
                    <TextField size="small" fullWidth value={data.content} onChange={e => setData('content', e.target.value)} InputProps={{ className: 'dark:text-white eclipse:text-rose-50' }} />
                    <Button type="submit" variant="contained" size="small" disabled={processing} className="!bg-cyan-600">Reply</Button>
                </form>
            )}
            {comment.replies?.map(reply => (
                <WriterCommentThread key={reply.id} comment={reply} auth={auth} articleId={articleId} writerId={writerId} triggerCommentDelete={triggerCommentDelete} isReply={true} />
            ))}
        </Box>
    );
};

export default function Dashboard({ auth, articles, categories }) {
    const [editorModal, setEditorModal] = useState(false);
    const [viewModal, setViewModal] = useState({ open: false, article: null });
    const [deleteCommentModal, setDeleteCommentModal] = useState({ open: false, id: null });

    // FIX 1: Dedicated rock-solid state just for the Rich Text Editor
    const [localContent, setLocalContent] = useState('');

    const { data, setData, processing, reset, errors } = useForm({
        id: null,
        title: '',
        category_id: ''
    });

    const queueArticles = articles.filter(a => ['draft', 'pending_review'].includes(a.status.name));
    const archiveArticles = articles.filter(a => ['published', 'needs_revision'].includes(a.status.name));

    // FIX 2: Guaranteed Payload Assembly and Route Matching
    const handleSubmit = (e) => {
        e.preventDefault();

        // Assemble the exact data Laravel wants
        const payload = {
            title: data.title,
            category_id: data.category_id,
            content: localContent
        };

        if (data.id) {
            // Must hit 'articles.revise' to match your original web.php
            router.put(route('articles.revise', data.id), payload, {
                onSuccess: () => { setEditorModal(false); reset(); setLocalContent(''); },
                preserveScroll: true
            });
        } else {
            router.post(route('articles.store'), payload, {
                onSuccess: () => { setEditorModal(false); reset(); setLocalContent(''); },
                preserveScroll: true
            });
        }
    };

    const handleOpenCreate = () => {
        reset();
        setLocalContent('');
        setEditorModal(true);
    };

    const handleOpenRevise = (article) => {
        setData({
            id: article.id,
            title: article.title,
            category_id: article.category_id
        });
        setLocalContent(article.content);
        setEditorModal(true);
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Writer Dashboard" />

            <div className="min-h-screen flex flex-col">
                <div className="bg-white dark:bg-slate-900 shadow border-b border-transparent eclipse:border-red-500/30 transition-colors duration-500">
                    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                        <h2 className="text-sm font-medium tracking-widest text-gray-500 dark:text-slate-400 eclipse:text-rose-200 uppercase">Writer Command Center</h2>
                        <Tooltip title="Refresh Library"><IconButton onClick={() => router.reload()} className="dark:text-white eclipse:text-rose-200"><RefreshIcon /></IconButton></Tooltip>
                    </div>
                </div>

                <div className="py-12 flex-1">
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-8">
                        <Box className="flex justify-between items-center mb-8">
                            <Box>
                                <Typography variant="h4" className="!font-black text-slate-900 dark:text-white eclipse:text-rose-50 drop-shadow-md">Content Library</Typography>
                                <Typography variant="body2" className="text-gray-500 dark:text-slate-400 eclipse:text-rose-200">Manage your article lifecycle and research.</Typography>
                            </Box>
                            <Button onClick={handleOpenCreate} variant="contained" startIcon={<AddIcon />} className="!bg-cyan-600 !rounded-full !px-6 eclipse:!bg-red-700 shadow-lg">
                                Write New Article
                            </Button>
                        </Box>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <Paper className="p-6 dark:!bg-slate-900 eclipse:!bg-rose-950 border dark:border-slate-800 eclipse:border-red-900/50 !rounded-2xl shadow-lg transition-all duration-500">
                                <Typography variant="h6" className="!font-mono !font-bold !uppercase !tracking-widest !text-sm !mb-4 text-slate-800 dark:text-white eclipse:text-rose-100 transition-colors">Active Queue</Typography>
                                <Divider className="!mb-4 eclipse:border-rose-800" />
                                <div className="space-y-4">
                                    {queueArticles.map(article => (
                                        <Box key={article.id} className="p-4 border border-slate-100 dark:border-slate-800 eclipse:border-red-900/50 rounded-2xl eclipse:bg-rose-900 transition-colors">
                                            <div className="flex justify-between items-start">
                                                <Typography variant="subtitle1" className="!font-bold text-slate-900 dark:text-white eclipse:text-rose-50">{article.title}</Typography>
                                                <Chip label={article.status.label} size="small" variant="outlined" className="dark:text-white eclipse:text-rose-200" />
                                            </div>
                                            <div className="flex justify-end gap-2 mt-4">
                                                <IconButton onClick={() => setViewModal({ open: true, article })} size="small" className="dark:text-white eclipse:text-rose-50"><VisibilityIcon fontSize="small"/></IconButton>
                                                {article.status.name === 'draft' && <Button onClick={() => router.post(route('articles.submit', article.id))} variant="contained" size="small" className="!bg-cyan-600">Submit</Button>}
                                                {article.status.name === 'pending_review' && <Button onClick={() => router.post(route('articles.unsubmit', article.id))} variant="outlined" size="small" startIcon={<UndoIcon />} className="!rounded-xl eclipse:text-rose-200 eclipse:border-rose-400">Unsubmit</Button>}
                                            </div>
                                        </Box>
                                    ))}
                                </div>
                            </Paper>

                            <Paper className="p-6 dark:!bg-slate-900 eclipse:!bg-rose-950 border dark:border-slate-800 eclipse:border-red-900/50 !rounded-2xl shadow-lg transition-all duration-500">
                                <Typography variant="h6" className="!font-mono !font-bold !uppercase !tracking-widest !text-sm !mb-4 text-slate-800 dark:text-white eclipse:text-rose-100 transition-colors">Archive</Typography>
                                <Divider className="!mb-4 eclipse:border-rose-800" />
                                <div className="space-y-4">
                                    {archiveArticles.map(article => (
                                        <Box key={article.id} className="p-4 border border-slate-100 dark:border-slate-800 eclipse:border-red-900/50 rounded-2xl eclipse:bg-rose-900 transition-colors">
                                            <div className="flex justify-between items-start">
                                                <Typography variant="subtitle1" className="!font-bold text-slate-900 dark:text-white eclipse:text-rose-50">{article.title}</Typography>
                                                <Chip label={article.status.label} size="small" color={article.status.name === 'published' ? 'success' : 'error'} />
                                            </div>
                                            <div className="flex justify-end gap-2 mt-4">
                                                <IconButton onClick={() => setViewModal({ open: true, article })} size="small" className="dark:text-white eclipse:text-rose-50"><VisibilityIcon fontSize="small"/></IconButton>
                                                {article.status.name === 'needs_revision' && (
                                                    <Button onClick={() => handleOpenRevise(article)} variant="outlined" size="small" className="mr-2 dark:text-white eclipse:text-rose-200 eclipse:border-rose-400">Revise</Button>
                                                )}
                                            </div>
                                        </Box>
                                    ))}
                                </div>
                            </Paper>
                        </div>
                    </div>
                </div>
            </div>

            <Dialog fullWidth maxWidth="lg" open={editorModal} onClose={() => setEditorModal(false)} PaperProps={{ className: 'dark:!bg-slate-900 eclipse:!bg-rose-950 !rounded-3xl' }}>
                <DialogTitle className="!font-bold border-b dark:border-slate-800 eclipse:border-rose-800">
                    <span className="text-slate-900 dark:text-white eclipse:text-rose-50">{data.id ? 'Revise Article' : 'Write New Article'}</span>
                </DialogTitle>
                <form onSubmit={handleSubmit}>
                    <DialogContent className="space-y-6 !pt-6">
                        <TextField
                            size="small" fullWidth label="Article Title" value={data.title}
                            onChange={e => setData('title', e.target.value)} required
                            error={!!errors.title} helperText={errors.title}
                            InputProps={{ className: 'dark:text-white eclipse:text-rose-50 !rounded-2xl' }}
                            InputLabelProps={{ className: 'dark:!text-slate-400 eclipse:!text-rose-300' }}
                        />
                        <FormControl size="small" fullWidth error={!!errors.category_id}>
                            <InputLabel className="dark:!text-slate-400 eclipse:!text-rose-300">Category</InputLabel>
                            <Select
                                value={data.category_id} label="Category"
                                onChange={e => setData('category_id', e.target.value)} required
                                className="dark:text-white eclipse:text-rose-50 !rounded-2xl"
                            >
                                {categories?.map(cat => <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>)}
                            </Select>
                        </FormControl>
                        <Box className="bg-white rounded-xl overflow-hidden shadow-inner">
                            <JoditEditor
                                value={localContent}
                                config={{ theme: 'default' }}
                                onBlur={newContent => setLocalContent(newContent)}
                            />
                        </Box>
                    </DialogContent>
                    <DialogActions className="!p-4 border-t dark:border-slate-800 eclipse:border-rose-800">
                        <Button onClick={() => setEditorModal(false)} className="dark:text-slate-300 eclipse:text-rose-200">Cancel</Button>
                        <Button type="submit" disabled={processing} variant="contained" className="!bg-cyan-600 eclipse:!bg-red-700 shadow-md">
                            {data.id ? 'Save Revision' : 'Save Draft'}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>

            <Dialog fullWidth maxWidth="md" open={viewModal.open} onClose={() => setViewModal({open: false, article: null})} PaperProps={{ className: 'dark:!bg-slate-900 eclipse:!bg-rose-950 !rounded-3xl border eclipse:border-rose-800' }}>
                <DialogTitle className="!font-bold border-b dark:border-slate-800 eclipse:border-rose-800 flex justify-between items-center">
                    <span className="text-slate-900 dark:text-white eclipse:text-rose-50">{viewModal.article?.title}</span>
                    <IconButton onClick={() => setViewModal({open: false, article: null})} size="small" className="dark:text-white eclipse:text-rose-50"><CloseIcon /></IconButton>
                </DialogTitle>
                <DialogContent className="!pt-6">
                    <div dangerouslySetInnerHTML={{ __html: viewModal.article?.content }} className="prose dark:prose-invert max-w-none mb-10 text-slate-700 dark:text-slate-200 eclipse:text-rose-100" />
                    <Divider className="!my-8 eclipse:border-rose-800" />
                    {viewModal.article?.comments?.map(comment => (
                        <WriterCommentThread key={comment.id} comment={comment} auth={auth} articleId={viewModal.article.id} writerId={viewModal.article.writer_id} triggerCommentDelete={(id) => setDeleteCommentModal({open: true, id})} />
                    ))}
                </DialogContent>
            </Dialog>

            <Dialog open={deleteCommentModal.open} onClose={() => setDeleteCommentModal({open: false, id: null})} PaperProps={{ className: 'dark:!bg-slate-900 !rounded-2xl' }}>
                <DialogTitle className="dark:text-white">Delete Comment?</DialogTitle>
                <DialogActions className="!p-4">
                    <Button onClick={() => setDeleteCommentModal({open: false, id: null})}>Cancel</Button>
                    <Button onClick={() => router.delete(route('comments.destroy', deleteCommentModal.id), { onFinish: () => setDeleteCommentModal({open: false, id: null}) })} variant="contained" color="error">Delete</Button>
                </DialogActions>
            </Dialog>
        </AuthenticatedLayout>
    );
}
