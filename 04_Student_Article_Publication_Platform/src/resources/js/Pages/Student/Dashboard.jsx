import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import {
    Paper, Typography, TextField, Button, Box, Divider, MenuItem, Select,
    FormControl, InputLabel, IconButton, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ReplyIcon from '@mui/icons-material/Reply';

// A recursive component to render nested replies infinitely
// NEW: Added triggerConfirm as a prop
const CommentThread = ({ comment, auth, articleId, triggerConfirm }) => {
    const [isReplying, setIsReplying] = useState(false);
    const { data, setData, post, reset, processing } = useForm({
        content: '',
        parent_id: comment.id
    });

    const submitReply = (e) => {
        e.preventDefault();
        post(route('articles.comment', articleId), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setIsReplying(false);
            }
        });
    };

    const userName = comment.user?.name || 'Unknown Student';
    const userId = comment.user?.id || null;

    return (
        <Box className="mt-4">
            <div className="flex justify-between items-start bg-slate-100 dark:bg-slate-800/50 eclipse:bg-rose-950/40 p-3 rounded-xl border border-transparent dark:border-slate-700 eclipse:border-red-900/30">
                <div>
                    <Typography variant="subtitle2" className="!font-bold text-cyan-600 dark:text-cyan-400 eclipse:text-red-400">
                        {userName}
                    </Typography>
                    {/* FIXED: Increased contrast for the comment text in dark/eclipse modes */}
                    <Typography variant="body2" className="text-slate-700 dark:!text-slate-200 eclipse:!text-rose-100 mt-1">
                        {comment.content}
                    </Typography>
                </div>

                <div className="flex gap-1">
                    <IconButton size="small" onClick={() => setIsReplying(!isReplying)} className="!text-gray-500 eclipse:!text-rose-300">
                        <ReplyIcon fontSize="small" />
                    </IconButton>
                    {auth.user.id === userId && userId !== null && (
                        // NEW: Trigger the modal instead of browser confirm
                        <IconButton size="small" onClick={() => triggerConfirm(comment.id)} className="!text-red-400">
                            <DeleteIcon fontSize="small" />
                        </IconButton>
                    )}
                </div>
            </div>

            {/* Reply Input Form */}
            {isReplying && (
                <form onSubmit={submitReply} className="ml-8 mt-2 flex gap-2">
                    <TextField
                        size="small"
                        fullWidth
                        placeholder={`Reply to ${userName}...`}
                        value={data.content}
                        onChange={e => setData('content', e.target.value)}
                        InputProps={{ className: 'dark:text-white eclipse:text-rose-100 dark:border-gray-700 eclipse:border-red-800' }}
                    />
                    <Button type="submit" variant="contained" disabled={processing} className="!bg-cyan-600 eclipse:!bg-red-700">Reply</Button>
                </form>
            )}

            {/* Render Child Replies */}
            {comment.replies && comment.replies.length > 0 && (
                <div className="ml-8 border-l-2 border-slate-200 dark:border-slate-700 eclipse:border-red-900/50 pl-4 mt-2">
                    {comment.replies.map(reply => (
                        // NEW: Pass triggerConfirm down to children recursively
                        <CommentThread key={reply.id} comment={reply} auth={auth} articleId={articleId} triggerConfirm={triggerConfirm} />
                    ))}
                </div>
            )}
        </Box>
    );
};

export default function StudentDashboard({ auth, articles, categories, filters }) {
    const { data, setData, get } = useForm({
        search: filters.search || '',
        category_id: filters.category_id || '',
    });

    // NEW: Modal State for Deletions
    const [confirmModal, setConfirmModal] = useState({ open: false, commentId: null });

    const triggerConfirm = (id) => setConfirmModal({ open: true, commentId: id });
    const closeConfirm = () => setConfirmModal({ open: false, commentId: null });

    const executeDelete = () => {
        router.delete(route('comments.destroy', confirmModal.commentId), {
            preserveScroll: true,
            onFinish: () => closeConfirm()
        });
    };

    const handleFilter = (e) => {
        e.preventDefault();
        get(route('student.dashboard'), { preserveState: true, preserveScroll: true });
    };

    const clearFilters = () => {
        setData({ search: '', category_id: '' });
        router.get(route('student.dashboard'));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="text-sm font-medium tracking-widest text-gray-500 dark:text-slate-400 eclipse:text-rose-400 uppercase transition-colors">Student Reading Hub</h2>}
        >
            <Head title="Student Dashboard" />

            <div className="py-12 bg-slate-50 dark:bg-slate-950 eclipse:bg-transparent min-h-screen transition-colors duration-500">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8 space-y-8">

                    {/* SEARCH AND FILTER BAR */}
                    <Paper elevation={3} sx={{ p: 3 }} className="dark:!bg-slate-900 eclipse:!bg-rose-950/80 eclipse:backdrop-blur-xl border dark:border-slate-800 eclipse:border-red-900/50">
                        <form onSubmit={handleFilter} className="flex flex-col md:flex-row gap-4 items-center">
                            <TextField
                                label="Search Research..."
                                variant="outlined"
                                size="small"
                                fullWidth
                                value={data.search}
                                onChange={e => setData('search', e.target.value)}
                                InputLabelProps={{ className: 'dark:text-gray-400 eclipse:text-rose-400' }}
                                InputProps={{ className: 'dark:text-white eclipse:text-rose-100 dark:border-gray-700 eclipse:border-red-800' }}
                            />
                            <FormControl size="small" className="w-full md:w-64">
                                <InputLabel className="dark:text-gray-400 eclipse:text-rose-400">Category</InputLabel>
                                <Select
                                    value={data.category_id}
                                    label="Category"
                                    onChange={e => setData('category_id', e.target.value)}
                                    className="dark:text-white eclipse:text-rose-100"
                                >
                                    <MenuItem value=""><em>All Categories</em></MenuItem>
                                    {categories.map(cat => <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>)}
                                </Select>
                            </FormControl>
                            <Button type="submit" variant="contained" className="!bg-cyan-600 eclipse:!bg-red-700 !whitespace-nowrap">Filter</Button>
                            {(data.search || data.category_id) && (
                                <Button onClick={clearFilters} variant="text" className="!text-gray-500 eclipse:!text-rose-400">Clear</Button>
                            )}
                        </form>
                    </Paper>

                    {/* ARTICLES AND COMMENTS */}
                    {articles.length === 0 ? (
                        <Typography className="text-center text-gray-500 eclipse:text-rose-300">No publications found.</Typography>
                    ) : (
                        articles.map((article) => (
                            <Paper key={article.id} elevation={3} sx={{ p: 4 }} className="dark:!bg-slate-900 eclipse:!bg-rose-950/60 eclipse:backdrop-blur-xl border dark:border-slate-800 eclipse:border-red-900/50">
                                <Typography variant="h5" className="!font-black text-slate-900 dark:text-white eclipse:text-rose-50 mb-2">
                                    {article.title}
                                </Typography>
                                <Typography variant="caption" className="text-gray-500 eclipse:text-red-400 font-mono tracking-widest uppercase mb-4 block">
                                    By {article.writer?.name || 'Unknown'} • {article.category?.name || 'Uncategorized'}
                                </Typography>

                                <div dangerouslySetInnerHTML={{ __html: article.content }} className="prose dark:prose-invert max-w-none text-slate-800 dark:text-slate-200 eclipse:text-rose-100 mb-8" />

                                <Divider className="dark:!border-slate-800 eclipse:!border-red-900/50 !mb-6" />

                                <Typography variant="h6" className="!font-bold text-slate-800 dark:text-white eclipse:text-rose-200 mb-4">
                                    Discussion Thread
                                </Typography>

                                {/* ROOT COMMENT FORM */}
                                <form onSubmit={(e) => {
                                    e.preventDefault();
                                    router.post(route('articles.comment', article.id), { content: e.target.content.value }, { preserveScroll: true, onSuccess: () => e.target.reset() });
                                }} className="flex gap-4 mb-8">
                                    <TextField name="content" size="small" fullWidth placeholder="Write a comment..." required InputProps={{ className: 'dark:text-white eclipse:text-rose-100 dark:border-gray-700 eclipse:border-red-800' }}/>
                                    <Button type="submit" variant="contained" className="!bg-cyan-600 eclipse:!bg-red-700">Post</Button>
                                </form>

                                {/* RENDER TOP-LEVEL COMMENTS */}
                                {article.comments.length === 0 ? (
                                    <Typography variant="body2" className="text-gray-500 eclipse:text-rose-400 italic">No comments yet. Be the first to start the discussion!</Typography>
                                ) : (
                                    article.comments.map(comment => (
                                        <CommentThread
                                            key={comment.id}
                                            comment={comment}
                                            auth={auth}
                                            articleId={article.id}
                                            triggerConfirm={triggerConfirm}
                                        />
                                    ))
                                )}
                            </Paper>
                        ))
                    )}
                </div>
            </div>

            {/* NEW: CUSTOM ECLIPSE CONFIRMATION MODAL FOR COMMENTS */}
            <Dialog open={confirmModal.open} onClose={closeConfirm} PaperProps={{ className: 'dark:!bg-slate-900 eclipse:!bg-rose-950 dark:!text-white eclipse:!text-rose-100 eclipse:border eclipse:border-red-900/50' }}>
                <DialogTitle className="!font-bold">Delete Comment?</DialogTitle>
                <DialogContent>
                    <Typography variant="body2" className="text-slate-600 dark:text-slate-300 eclipse:text-rose-200">
                        This action is permanent. Deleting this comment will also delete any replies underneath it.
                    </Typography>
                </DialogContent>
                <DialogActions className="!p-4">
                    <Button onClick={closeConfirm} className="dark:!text-gray-400 eclipse:!text-rose-400">Cancel</Button>
                    <Button onClick={executeDelete} variant="contained" className="!bg-red-600 eclipse:!bg-red-800">Confirm Delete</Button>
                </DialogActions>
            </Dialog>
        </AuthenticatedLayout>
    );
}
