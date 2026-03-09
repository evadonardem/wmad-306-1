import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router, usePoll } from '@inertiajs/react';
import {
    Paper, Typography, TextField, Button, Box, Divider, MenuItem, Select,
    FormControl, InputLabel, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Chip, Alert
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ReplyIcon from '@mui/icons-material/Reply';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

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

const getReadingTime = (htmlContent) => {
    const plainText = htmlContent?.replace(/<[^>]*>?/gm, '') || '';
    const words = plainText.trim().split(/\s+/).length;
    return Math.max(1, Math.ceil(words / 200));
};

const CommentThread = ({ comment, auth, articleId, writerId, triggerConfirm, isReply = false }) => {
    const [isReplying, setIsReplying] = useState(false);
    const [showReplies, setShowReplies] = useState(true);
    const { data, setData, post, reset, processing } = useForm({ content: '', parent_id: comment.id });

    const isArticleAuthor = comment.user?.id === writerId;
    const isMine = auth.user.id === comment.user?.id;
    const hasReplies = comment.replies && comment.replies.length > 0;

    const submitReply = (e) => {
        e.preventDefault();
        post(route('articles.comment', articleId), { preserveScroll: true, onSuccess: () => { reset(); setIsReplying(false); setShowReplies(true); } });
    };

    return (
        <Box className={`${isReply ? 'ml-8 mt-2' : 'mt-4'} relative`}>
            {/* L-Shape Connector Lines */}
            {isReply && (
                <div className="absolute -left-6 top-0 bottom-0 w-px bg-slate-300 dark:bg-slate-700 eclipse:bg-rose-500/50 lunar:bg-pink-400/50 transition-colors">
                    <div className="absolute top-5 left-0 w-6 h-px bg-slate-300 dark:bg-slate-700 eclipse:bg-rose-500/50 lunar:bg-pink-400/50 transition-colors"></div>
                </div>
            )}

            <div className={`p-3 rounded-2xl border transition-all duration-300 flex justify-between items-start ${
                isArticleAuthor
                ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-800/40 eclipse:bg-rose-950/60 eclipse:border-rose-700/50 lunar:bg-rose-900 lunar:border-rose-500/50'
                : 'bg-slate-100 dark:bg-slate-800/50 border-transparent dark:border-slate-700 eclipse:bg-rose-900 eclipse:border-rose-800/50 lunar:bg-pink-900 lunar:border-rose-700/50'
            }`}>
                <div className="flex-1">
                    <div className="flex items-center gap-x-2 mb-1">
                        {/* Lightened author names for contrast */}
                        <Typography variant="subtitle2" className={`!font-bold flex items-center ${isArticleAuthor ? 'text-emerald-600 dark:text-emerald-400 eclipse:text-rose-200 lunar:text-pink-200' : 'text-cyan-600 dark:text-cyan-400 eclipse:text-rose-200 lunar:text-pink-200'}`}>
                            {comment.user?.name}
                            {isArticleAuthor && <Chip label="AUTHOR" size="small" className="!h-4 !text-[7px] !font-black !bg-emerald-600 !text-white !ml-1 eclipse:!bg-rose-600 lunar:!bg-rose-500" />}
                        </Typography>
                        <Typography variant="caption" className="text-gray-400 dark:text-slate-400 eclipse:text-rose-300/70 lunar:text-pink-200/70 ml-auto transition-colors">{timeAgo(comment.created_at)}</Typography>
                    </div>
                    {/* Primary text radiant white/pink */}
                    <Typography variant="body2" className="text-slate-700 dark:text-slate-200 eclipse:text-rose-50 lunar:text-pink-50 transition-colors">{comment.content}</Typography>

                    <Box className="flex items-center gap-2 mt-1">
                        {/* Lightened buttons */}
                        <Button size="small" onClick={() => setIsReplying(!isReplying)} startIcon={<ReplyIcon sx={{ fontSize: 14 }} />} className="!text-[10px] !text-gray-500 dark:!text-slate-400 eclipse:!text-rose-300 lunar:!text-pink-200">Reply</Button>
                        {hasReplies && (
                            <Button
                                size="small"
                                startIcon={showReplies ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                onClick={() => setShowReplies(!showReplies)}
                                className="!text-[10px] !text-cyan-600 dark:!text-cyan-400 !font-black uppercase eclipse:!text-rose-300 lunar:!text-pink-200"
                            >
                                {showReplies ? 'Hide' : `View ${comment.replies.length} replies`}
                            </Button>
                        )}
                    </Box>
                </div>
                {isMine && (
                    <IconButton size="small" onClick={() => triggerConfirm(comment.id)} className="!text-red-400 opacity-60 hover:opacity-100 ml-2 transition-opacity"><DeleteIcon fontSize="small" /></IconButton>
                )}
            </div>
            {isReplying && (
                <form onSubmit={submitReply} className="ml-8 mt-2 flex gap-2">
                    <TextField size="small" fullWidth autoComplete="off" value={data.content} onChange={e => setData('content', e.target.value)} InputProps={{ className: 'dark:text-white eclipse:text-rose-50 lunar:text-pink-50 text-sm !rounded-xl transition-colors' }} />
                    <Button type="submit" variant="contained" size="small" disabled={processing} className="!bg-cyan-600 !rounded-xl eclipse:!bg-red-700 lunar:!bg-rose-600">Send</Button>
                </form>
            )}
            {showReplies && comment.replies?.map(reply => (
                <CommentThread key={reply.id} comment={reply} auth={auth} articleId={articleId} writerId={writerId} triggerConfirm={triggerConfirm} isReply={true} />
            ))}
        </Box>
    );
};

export default function StudentDashboard({ auth, articles, categories, filters }) {
    const { data, setData, get } = useForm({ search: filters.search || '', category_id: filters.category_id || '' });
    const [confirmModal, setConfirmModal] = useState({ open: false, commentId: null });
    const [expandedArticleId, setExpandedArticleId] = useState(null);

    const [snackbar, setSnackbar] = useState({ open: false, message: '' });

    usePoll(5000);

    const toggleArticle = (id) => setExpandedArticleId(expandedArticleId === id ? null : id);

    return (
        <AuthenticatedLayout user={auth.user} header={<h2 className="text-sm uppercase tracking-widest text-gray-500 dark:text-slate-400 eclipse:text-rose-200 lunar:text-pink-200 transition-colors">Research Hub</h2>}>
            <Head title="Student Dashboard" />

            <div
                className="py-12 bg-slate-50 dark:bg-slate-950 min-h-screen transition-all duration-500
                    eclipse:bg-[url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSXyIRL_MNeinE7XdR4raOfImFpsE5RpQDX39wYyCe03X7n_u2')]
                    lunar:bg-[url('https://img.freepik.com/premium-photo/pink-moon-purple-sky-with-palm-tree_1153744-173071.jpg')]
                    eclipse:bg-cover eclipse:bg-center eclipse:bg-fixed
                    lunar:bg-cover lunar:bg-center lunar:bg-fixed"
            >
                <div className="max-w-4xl mx-auto space-y-8 px-4">

                    {/* Search Bar - Solid Lunar Background */}
                    <Paper elevation={0} className="!bg-white dark:!bg-slate-900 border border-slate-100 dark:border-slate-800 !rounded-3xl p-4 eclipse:!bg-rose-900 eclipse:border-red-900/50 lunar:!bg-pink-950 lunar:border-rose-700/50 transition-colors duration-500 shadow-md">
                        <div className="flex gap-4">
                            <TextField
                                autoComplete="off"
                                label="Search Research..."
                                size="small"
                                fullWidth
                                value={data.search}
                                onChange={e => setData('search', e.target.value)}
                                InputProps={{ className: 'dark:text-white eclipse:text-rose-50 lunar:text-pink-50 !rounded-2xl transition-colors' }}
                                InputLabelProps={{ className: 'dark:!text-slate-400 eclipse:!text-rose-300 lunar:!text-pink-200 transition-colors' }}
                                sx={{ "& label.Mui-focused": { color: "#06b6d4" }, "& .MuiOutlinedInput-root": { "& fieldset": { borderColor: "transparent" } } }}
                            />
                            <FormControl size="small" className="w-64">
                                <InputLabel className="dark:!text-slate-400 eclipse:!text-rose-300 lunar:!text-pink-200">Category</InputLabel>
                                <Select
                                    value={data.category_id}
                                    label="Category"
                                    onChange={e => setData('category_id', e.target.value)}
                                    className="!rounded-2xl dark:text-white text-black eclipse:text-rose-50 lunar:text-pink-50 transition-colors"
                                    sx={{ ".MuiOutlinedInput-notchedOutline": { borderColor: "transparent" } }}
                                >
                                    <MenuItem value="">All</MenuItem>
                                    {categories.map(cat => <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>)}
                                </Select>
                            </FormControl>
                        </div>
                    </Paper>

                    {articles.map((article) => {
                        const isExpanded = expandedArticleId === article.id;
                        return (
                            <Paper
                                key={article.id}
                                elevation={0}
                                className={`transition-all duration-500 !bg-white dark:!bg-slate-900 border border-slate-100 dark:border-slate-800 !rounded-[2rem] p-6
                                    eclipse:!bg-rose-900 eclipse:border-red-900/50
                                    lunar:!bg-pink-950 lunar:border-rose-700/50 shadow-md
                                    ${isExpanded ? 'ring-2 ring-cyan-500/20 eclipse:ring-red-500/40 lunar:ring-rose-600/40' : ''}`}
                            >
                                <Typography variant="h5" className="!font-black mb-4 dark:text-white eclipse:text-rose-50 lunar:text-pink-50 transition-colors">{article.title}</Typography>

                                {/* Lightened meta text */}
                                <Box className="flex gap-4 text-[10px] text-gray-400 dark:text-slate-400 mb-6 font-mono uppercase eclipse:text-rose-300 lunar:text-pink-200 transition-colors">
                                    <span>By {article.writer?.name}</span>
                                    <span>{getReadingTime(article.content)} min read</span>
                                </Box>

                                {!isExpanded ? (
                                    <Button onClick={() => toggleArticle(article.id)} variant="contained" className="!bg-cyan-600 !rounded-2xl !px-8 eclipse:!bg-red-700 lunar:!bg-rose-600 shadow-md">Read Article</Button>
                                ) : (
                                    <>
                                        <div
                                            dangerouslySetInnerHTML={{ __html: article.content }}
                                            className="prose dark:prose-invert max-w-none mb-8 transition-colors dark:text-slate-200 eclipse:text-rose-100 lunar:text-pink-50 [&_*]:dark:!text-slate-200 [&_*]:eclipse:!text-rose-100 [&_*]:lunar:!text-pink-50"
                                        />

                                        <Button onClick={() => toggleArticle(article.id)} variant="text" startIcon={<KeyboardArrowUpIcon />} className="!text-gray-500 dark:!text-slate-400 eclipse:!text-rose-300 lunar:!text-pink-200 !mb-8 transition-colors">Collapse</Button>

                                        <Divider className="!mb-8 eclipse:border-red-900/50 lunar:border-rose-700/50 transition-colors" />

                                        <Typography variant="h6" className="!font-bold mb-6 dark:text-white eclipse:text-rose-50 lunar:text-pink-50 transition-colors">Peer Discussion</Typography>

                                        <form onSubmit={(e) => { e.preventDefault(); router.post(route('articles.comment', article.id), { content: e.target.content.value }, { preserveScroll: true, onSuccess: () => { e.target.reset(); setSnackbar({ open: true, message: 'Comment posted!' }); } }); }} className="flex gap-4 mb-10">
                                            <TextField name="content" size="small" fullWidth autoComplete="off" placeholder="Join the discussion..." required InputProps={{ className: 'dark:text-white eclipse:text-rose-50 lunar:text-pink-50 !rounded-2xl transition-colors' }} />
                                            <Button type="submit" variant="contained" className="!bg-cyan-600 !rounded-2xl !px-8 eclipse:!bg-red-700 lunar:!bg-rose-600 shadow-md">Post</Button>
                                        </form>

                                        {article.comments?.map(comment => (
                                            <CommentThread key={comment.id} comment={comment} auth={auth} articleId={article.id} writerId={article.writer_id} triggerConfirm={(id) => setConfirmModal({open: true, commentId: id})} />
                                        ))}
                                    </>
                                )}
                            </Paper>
                        );
                    })}
                </div>
            </div>

            <Dialog open={confirmModal.open} onClose={() => setConfirmModal({open: false, commentId: null})} PaperProps={{ className: 'dark:!bg-slate-900 eclipse:!bg-rose-950 lunar:!bg-pink-950 dark:!text-white eclipse:!text-rose-50 lunar:!text-pink-50 !rounded-2xl transition-all duration-500' }}>
                <DialogTitle className="!font-bold dark:text-white eclipse:text-rose-50 lunar:text-white">Delete Comment?</DialogTitle>
                <DialogActions className="!p-4">
                    <Button onClick={() => setConfirmModal({open: false, commentId: null})} className="dark:text-slate-300 eclipse:text-rose-200 lunar:text-pink-200 transition-colors">Cancel</Button>
                    <Button onClick={() => router.delete(route('comments.destroy', confirmModal.commentId), { preserveScroll: true, onFinish: () => { setConfirmModal({open: false, commentId: null}); setSnackbar({ open: true, message: 'Comment deleted!' }); } })} variant="contained" color="error" className="shadow-md">Delete</Button>
                </DialogActions>
            </Dialog>

            <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
                <Alert severity="success" sx={{ width: '100%' }} className="!rounded-2xl shadow-xl"> {snackbar.message} </Alert>
            </Snackbar>
        </AuthenticatedLayout>
    );
}
