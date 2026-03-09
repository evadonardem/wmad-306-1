import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import {
    Button, Paper, Typography, Box, Chip,
    Dialog, DialogTitle, DialogContent, DialogActions, TextField,
    Tabs, Tab
} from '@mui/material';

// ❄️ CSS for the "Red Snow" effect, pervasive but limited to left-middle
const snowStyles = `
@keyframes snow {
  0% { transform: translateY(-10vh) translateX(0); opacity: 0; }
  20% { opacity: 1; }
  100% { transform: translateY(100vh) translateX(20px); opacity: 0; }
}
.snow-particle {
  position: absolute;
  background: white;
  border-radius: 50%;
  filter: blur(1px) drop-shadow(0 0 5px #ff0000);
  opacity: 0.6;
  pointer-events: none;
  animation: snow linear infinite;
}
`;

const RedSnow = () => (
    <Box className="absolute inset-y-0 left-0 overflow-hidden pointer-events-none rounded-l-[2rem]" sx={{ zIndex: 1, width: '60%', maskImage: 'linear-gradient(to right, black 70%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to right, black 70%, transparent 100%)' }}>
        {[...Array(35)].map((_, i) => (
            <div key={i} className="snow-particle" style={{
                width: Math.random() * 3 + 'px',
                height: Math.random() * 3 + 'px',
                left: Math.random() * 100 + '%',
                animationDuration: Math.random() * 3 + 2 + 's',
                animationDelay: Math.random() * 5 + 's',
            }} />
        ))}
    </Box>
);

export default function EditorDashboard({ auth, articles = [] }) {
    const [selectedArticle, setSelectedArticle] = useState(null);
    const [tabIndex, setTabIndex] = useState(0);

    // 🚩 FIXED: Added the missing actionType state to prevent crashes
    const [actionType, setActionType] = useState(null);

    const { data, setData, post, processing, reset } = useForm({ comments: '' });

    const openModal = (article, type) => { setSelectedArticle(article); setActionType(type); };
    const closeModal = () => { setSelectedArticle(null); setActionType(null); reset(); };

    const handleAction = (e) => {
        e.preventDefault();
        const routeName = actionType === 'publish' ? 'articles.publish' : 'articles.revision';
        post(route(routeName, selectedArticle.id), { onSuccess: () => closeModal() });
    };

    const pendingArticles = articles.filter(a => a?.status?.name === 'pending_review');
    const publishedArticles = articles.filter(a => a?.status?.name === 'published');
    const displayedArticles = tabIndex === 0 ? pendingArticles : publishedArticles;

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="text-sm font-medium tracking-widest text-gray-500 dark:text-slate-400 eclipse:text-rose-200 lunar:text-pink-200 uppercase transition-colors">Editor Command Center</h2>}
        >
            <style>{snowStyles}</style>
            <Head title="Editor Dashboard" />

            {/* Background Container - Isolated for Lunar radiant palm theme */}
            <div className="py-12 bg-slate-50 dark:bg-slate-950 min-h-screen transition-all duration-500
                eclipse:bg-[url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSXyIRL_MNeinE7XdR4raOfImFpsE5RpQDX39wYyCe03X7n_u2')]
                lunar:bg-[url('https://img.freepik.com/premium-photo/pink-moon-purple-sky-with-palm-tree_1153744-173071.jpg')]
                bg-cover bg-center bg-fixed transition-colors duration-500">

                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Main Workspace with Lunar radiant styling */}
                    <Paper
                        elevation={3}
                        sx={{ p: 4 }}
                        className="dark:!bg-slate-900 eclipse:!bg-rose-900 lunar:!bg-pink-950/40 lunar:backdrop-blur-xl dark:!text-white eclipse:!text-rose-50 lunar:!text-pink-100 border dark:border-slate-800 eclipse:border-red-900/50 lunar:border-rose-700/50 transition-colors duration-500 !rounded-[2.5rem]"
                    >
                        <div className="hidden eclipse:block"><RedSnow /></div>

                        <Box className="relative z-10">
                            <Typography variant="h5" className="!font-black !mb-2">Review Workspace</Typography>

                            {/* Brightened text for readability */}
                            <Typography variant="body2" className="text-gray-500 dark:text-slate-400 eclipse:text-rose-200 lunar:text-pink-200 !mb-6 transition-colors">
                                Manage your editorial pipeline across different stages.
                            </Typography>

                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }} className="mb-6 dark:border-slate-800 eclipse:border-red-900/50 lunar:border-rose-700/50 transition-colors duration-500">
                                <Tabs
                                    value={tabIndex}
                                    onChange={(e, newValue) => setTabIndex(newValue)}
                                    TabIndicatorProps={{ className: 'bg-cyan-600 eclipse:bg-rose-400 lunar:bg-rose-400 transition-colors' }}
                                    textColor="inherit"
                                >
                                    <Tab
                                        label={`Pending Review (${pendingArticles.length})`}
                                        className={`!font-bold transition-colors ${tabIndex === 0 ? 'text-cyan-600 dark:text-cyan-400 eclipse:!text-rose-200 lunar:!text-pink-200' : 'text-gray-500 dark:text-gray-400 eclipse:text-rose-200/70 lunar:text-pink-200/70'}`}
                                    />
                                    <Tab
                                        label={`Published (${publishedArticles.length})`}
                                        className={`!font-bold transition-colors ${tabIndex === 1 ? 'text-cyan-600 dark:text-cyan-400 eclipse:!text-rose-200 lunar:!text-pink-200' : 'text-gray-500 dark:text-gray-400 eclipse:text-rose-200/70 lunar:text-pink-200/70'}`}
                                    />
                                </Tabs>
                            </Box>

                            <div className="space-y-6">
                                {displayedArticles.length === 0 ? (
                                    <Typography variant="body1" className="py-20 text-center text-gray-500 eclipse:text-rose-200 lunar:text-pink-200 italic font-medium transition-colors">
                                        No articles are currently awaiting review.
                                    </Typography>
                                ) : (
                                    displayedArticles.map((article) => (
                                        <Box key={article.id} className="p-6 border border-gray-100 dark:border-slate-800 eclipse:border-red-900/40 lunar:border-rose-700/40 eclipse:bg-rose-950/40 lunar:bg-pink-900/20 backdrop-blur-md rounded-xl transition-all duration-500">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <Typography variant="h6" className="!font-bold">{article.title}</Typography>
                                                    {/* Brightened author name text */}
                                                    <Typography variant="caption" className="!font-mono !uppercase !tracking-widest text-gray-500 eclipse:text-rose-300 lunar:text-pink-200 transition-colors">
                                                        By {article?.writer?.name} • {article?.category?.name}
                                                    </Typography>
                                                </div>
                                                <Chip label={article?.status?.label || 'Unknown'} className="!font-mono !uppercase !tracking-widest !text-[10px] lunar:!bg-rose-600 lunar:!text-white transition-colors" />
                                            </div>

                                            <Paper variant="outlined" sx={{ p: 3, bgcolor: 'transparent' }} className="dark:border-slate-700 eclipse:border-red-800/50 lunar:border-rose-700/50 eclipse:bg-rose-900 lunar:bg-pink-950/30 !mb-4 transition-colors !rounded-xl">
                                                {/* 🚩 Nuclear Option: Override injected black text so the article is legible in all themes */}
                                                <div dangerouslySetInnerHTML={{ __html: article.content }} className="prose dark:prose-invert max-w-none transition-colors dark:text-slate-200 eclipse:text-rose-100 lunar:text-pink-50 [&_*]:dark:!text-slate-200 [&_*]:eclipse:!text-rose-100 [&_*]:lunar:!text-pink-50" />
                                            </Paper>

                                            {article?.status?.name === 'pending_review' && (
                                                <div className="flex gap-3 justify-end">
                                                    {/* Brightened buttons */}
                                                    <Button onClick={() => openModal(article, 'revise')} className="!font-bold eclipse:!text-rose-200 lunar:!text-pink-200 transition-colors">Revision</Button>
                                                    <Button onClick={() => openModal(article, 'publish')} variant="contained" className="!font-bold eclipse:!bg-red-700 lunar:!bg-rose-600 transition-colors shadow-md">Publish</Button>
                                                </div>
                                            )}
                                        </Box>
                                    ))
                                )}
                            </div>
                        </Box>
                    </Paper>
                </div>
            </div>

            {/* Modal with Lunar radiant styling and legible text */}
            <Dialog
                open={!!selectedArticle}
                onClose={closeModal}
                PaperProps={{ className: 'dark:!bg-slate-900 eclipse:!bg-rose-950 lunar:!bg-rose-900 dark:!text-white eclipse:!text-rose-50 lunar:!text-pink-50 !rounded-3xl transition-colors duration-500' }}
            >
                <form onSubmit={handleAction}>
                    <DialogTitle className="!font-black transition-colors">Action Required</DialogTitle>
                    <DialogContent>
                        {actionType === 'revise' && (
                            <TextField
                                autoFocus
                                margin="dense"
                                label="Comments"
                                fullWidth
                                multiline
                                rows={4}
                                required
                                value={data.comments}
                                onChange={(e) => setData('comments', e.target.value)}
                                InputLabelProps={{ className: 'dark:!text-slate-300 eclipse:!text-rose-200 lunar:!text-pink-200 transition-colors' }}
                                InputProps={{ className: 'dark:text-white eclipse:text-rose-50 lunar:text-pink-50 transition-colors' }}
                            />
                        )}
                        {actionType === 'publish' && (
                            <Typography className="eclipse:text-rose-200 lunar:text-pink-200 mt-2">
                                Are you sure you want to publish this article? This action will make it visible to students.
                            </Typography>
                        )}
                    </DialogContent>
                    <DialogActions className="!p-4">
                        <Button onClick={closeModal} className="dark:text-slate-300 eclipse:!text-rose-200 lunar:!text-pink-200 transition-colors">Cancel</Button>
                        <Button type="submit" variant="contained" className="lunar:!bg-rose-600 eclipse:!bg-red-700 transition-colors">Confirm Action</Button>
                    </DialogActions>
                </form>
            </Dialog>
        </AuthenticatedLayout>
    );
}
