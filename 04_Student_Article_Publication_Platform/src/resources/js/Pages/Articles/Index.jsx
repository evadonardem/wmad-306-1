import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ auth, articles }) {
    const isAdmin = auth.user.role === 'admin';

    if (isAdmin) {
        return (
            <AuthenticatedLayout user={auth.user} header={<h2 className="text-sm font-medium tracking-widest text-gray-500 dark:text-slate-400 uppercase">My Articles</h2>}>
                <Head title="Access Denied" />
                <div className="py-24 bg-white dark:bg-slate-950 min-h-screen">
                    <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                        <div className="bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-3xl p-16 text-center text-gray-500 dark:text-slate-400">
                            Admin Access Only
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        );
    }

    const [activeTab, setActiveTab] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [modalState, setModalState] = useState({ isOpen: false, type: null, articleId: null });

    const tabs = ['All', 'Drafts', 'Pending', 'Published', 'Rejected'];
    const openModal = (type, articleId) => setModalState({ isOpen: true, type, articleId });
    const closeModal = () => setModalState({ isOpen: false, type: null, articleId: null });

    const handleConfirm = () => {
        const { type, articleId } = modalState;
        if (type === 'submit') router.post(route('articles.submit', articleId), {}, { onFinish: closeModal });
        else if (type === 'unsubmit') router.post(route('articles.unsubmit', articleId), {}, { onFinish: closeModal });
    };

    const filteredArticles = articles.filter((article) => {
        const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase());
        if (activeTab === 'All') return matchesSearch;
        const statusMap = { 'Drafts': 'draft', 'Pending': 'pending_review', 'Published': 'published', 'Rejected': 'rejected' };
        return matchesSearch && article.status === statusMap[activeTab];
    });

    const modalContent = {
        submit: { title: 'Confirm Submission', message: "Submit this article for review?" },
        unsubmit: { title: 'Confirm Unsubmit', message: "Return this to drafts?" }
    }[modalState.type] || {};

    return (
        <AuthenticatedLayout user={auth.user} header={<h2 className="text-sm font-medium tracking-widest text-gray-500 dark:text-slate-400 uppercase">My Articles</h2>}>
            <Head title="My Articles" />

            <div className="py-16 sm:py-24 bg-white dark:bg-slate-950 min-h-screen transition-colors duration-500">
                <div className="max-w-5xl mx-auto sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 space-y-6 md:space-y-0 border-b border-gray-100 dark:border-slate-800 pb-8">
                        <div>
                            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2">Your Submissions</h1>
                            <p className="text-gray-500 dark:text-slate-400 font-light">Manage your drafts and track status.</p>
                        </div>
                        <Link href={route('articles.create')} className="px-6 py-3 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/30">
                            Create New Article
                        </Link>
                    </div>

                    <div className="mb-12 space-y-6">
                        <div className="relative max-w-xl">
                            <input
                                type="text"
                                className="pl-11 block w-full rounded-full border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-cyan-400 sm:text-sm py-3.5 transition-all"
                                placeholder="Search your articles..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {tabs.map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-5 py-2 text-sm font-medium rounded-full transition-all border ${
                                        activeTab === tab ? 'bg-gray-900 dark:bg-cyan-500 text-white border-gray-900' : 'bg-white dark:bg-slate-900 text-gray-500 dark:text-slate-400 border-gray-200 dark:border-slate-800'
                                    }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-6">
                        {filteredArticles.map(article => (
                            <div key={article.id} className="group relative bg-white dark:bg-slate-900 p-8 rounded-3xl border border-gray-100 dark:border-slate-800 hover:border-transparent transition-all duration-500 flex flex-col md:flex-row justify-between items-start md:items-center z-10 overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-cyan-50/50 to-blue-50/50 dark:from-cyan-900/10 dark:to-blue-900/10 opacity-0 group-hover:opacity-100 transition-opacity -z-10"></div>
                                <div className="flex-grow pr-8">
                                    <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{article.title}</h4>
                                    <p className="text-sm text-gray-500 dark:text-slate-400 font-light">Last updated: {new Date(article.updated_at).toLocaleDateString()}</p>
                                </div>
                                <div className="flex items-center space-x-4 flex-shrink-0 w-full md:w-auto justify-between md:justify-end">
                                    <span className={`px-3 py-1.5 text-[10px] font-mono uppercase tracking-widest border rounded-sm ${
                                        { draft: 'border-gray-200 text-gray-500 bg-white dark:bg-slate-800 dark:text-slate-400', pending_review: 'border-amber-200 text-amber-600 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-400', published: 'border-cyan-200 text-cyan-600 bg-cyan-50 dark:bg-cyan-900/20 dark:text-cyan-400', rejected: 'border-red-200 text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400' }[article.status]
                                    }`}>{article.status.replace('_', ' ')}</span>
                                    {article.status === 'draft' && (
                                        <div className="flex space-x-2">
                                            <Link href={route('articles.edit', article.id)} className="px-4 py-2 text-sm text-gray-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-full">Edit</Link>
                                            <button onClick={() => openModal('submit', article.id)} className="px-4 py-2 text-sm text-white bg-gray-900 dark:bg-cyan-600 rounded-full">Submit</button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {modalState.isOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={closeModal}></div>
                    <div className="relative bg-white dark:bg-slate-900 rounded-2xl p-8 max-w-lg w-full border border-gray-100 dark:border-slate-800 shadow-2xl transition-colors duration-500">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{modalContent.title}</h3>
                        <p className="text-gray-500 dark:text-slate-400 mb-6">{modalContent.message}</p>
                        <div className="flex justify-end space-x-3">
                            <button onClick={closeModal} className="px-6 py-2 text-sm text-gray-600 dark:text-slate-400">Cancel</button>
                            <button onClick={handleConfirm} className="px-6 py-2 text-sm bg-gray-900 dark:bg-cyan-600 text-white rounded-full">Confirm</button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
