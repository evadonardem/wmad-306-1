import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Admin({ auth, articles }) {
    const [activeTab, setActiveTab] = useState('Pending Review');
    const [searchQuery, setSearchQuery] = useState('');
    const [modalState, setModalState] = useState({ isOpen: false, type: null, articleId: null });

    const tabs = ['Pending Review', 'Accepted', 'Rejected'];

    const openModal = (type, articleId) => {
        setModalState({ isOpen: true, type, articleId });
    };

    const closeModal = () => {
        setModalState({ isOpen: false, type: null, articleId: null });
    };

    const handleConfirm = () => {
        const { type, articleId } = modalState;
        const status = type === 'publish' ? 'published' : 'rejected';

        router.patch(route('articles.updateStatus', articleId), { status }, {
            preserveScroll: true,
            onFinish: closeModal,
        });
    };

    const filteredArticles = articles.filter((article) => {
        const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase());
        const statusMap = {
            'Pending Review': 'pending_review',
            'Accepted': 'published',
            'Rejected': 'rejected'
        };
        return matchesSearch && article.status === statusMap[activeTab];
    });

    const modalContent = {
        publish: { title: 'Confirm Acceptance', message: "Approve this article for public viewing?" },
        reject: { title: 'Confirm Rejection', message: "Mark this submission as rejected? The student will see this status." }
    }[modalState.type] || {};

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="text-sm font-medium tracking-widest text-gray-500 dark:text-slate-400 uppercase">Article Moderation</h2>}
        >
            <Head title="Admin Dashboard" />

            <div className="py-16 sm:py-24 bg-white dark:bg-slate-950 min-h-screen transition-colors duration-500">
                <div className="max-w-6xl mx-auto sm:px-6 lg:px-8">

                    {/* Page Title */}
                    <div className="mb-12 border-b border-gray-100 dark:border-slate-800 pb-10">
                        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">Review Board</h1>
                        <p className="text-gray-500 dark:text-slate-400 font-light mt-2 text-lg">Manage and moderate student submissions.</p>
                    </div>

                    {/* Search & Tabs */}
                    <div className="mb-12 space-y-8">
                        <div className="relative max-w-xl">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-gray-300 dark:text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                className="pl-11 block w-full rounded-2xl border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900/50 text-gray-900 dark:text-white focus:ring-cyan-500/10 focus:border-cyan-500/50 sm:text-sm py-4 transition-all"
                                placeholder="Search submissions..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {tabs.map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-6 py-2.5 text-[10px] font-mono font-bold uppercase tracking-[0.2em] rounded-full border transition-all duration-300
                                        ${activeTab === tab
                                            ? 'bg-slate-900 dark:bg-cyan-500 text-white border-slate-900 dark:border-cyan-400 shadow-lg shadow-cyan-500/20'
                                            : 'bg-white dark:bg-slate-900 text-gray-400 dark:text-slate-500 border-gray-100 dark:border-slate-800 hover:border-gray-300 dark:hover:text-slate-300'
                                        }
                                    `}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Submissions List */}
                    <div className="space-y-6">
                        {filteredArticles.length > 0 ? (
                            filteredArticles.map((article) => (
                                <div key={article.id} className="group relative bg-white dark:bg-slate-900 p-8 rounded-3xl border border-gray-100 dark:border-slate-800 hover:border-transparent transition-all duration-500 hover:shadow-2xl hover:shadow-cyan-500/5 flex flex-col md:flex-row justify-between items-start md:items-center overflow-hidden z-10">
                                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-50/30 to-blue-50/30 dark:from-cyan-900/10 dark:to-blue-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>

                                    <div className="flex-grow pr-8">
                                        <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">{article.title}</h4>
                                        <div className="flex items-center flex-wrap gap-x-6 gap-y-2 text-[11px] font-mono uppercase tracking-widest text-gray-400 dark:text-slate-500">
                                            <span>Author // <span className="text-gray-900 dark:text-slate-300">{article.user.name}</span></span>
                                            <span>Date // {new Date(article.created_at).toLocaleDateString()}</span>
                                        </div>
                                    </div>

                                    {article.status === 'pending_review' && (
                                        <div className="mt-6 md:mt-0 flex space-x-3 w-full md:w-auto">
                                            <button
                                                className="flex-1 md:flex-none px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-emerald-500 hover:bg-emerald-400 rounded-full transition shadow-lg shadow-emerald-500/20"
                                                onClick={() => openModal('publish', article.id)}
                                            >
                                                Accept
                                            </button>
                                            <button
                                                className="flex-1 md:flex-none px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400 bg-gray-100 dark:bg-slate-800 hover:bg-red-500 hover:text-white rounded-full transition"
                                                onClick={() => openModal('reject', article.id)}
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="bg-gray-50/50 dark:bg-slate-900/50 border border-gray-100 dark:border-slate-800 rounded-3xl p-20 text-center">
                                <p className="text-gray-400 dark:text-slate-600 font-mono text-xs uppercase tracking-widest">No entries found for {activeTab}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modern Review Modal */}
            {modalState.isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={closeModal}></div>
                    <div className="relative bg-white dark:bg-slate-900 rounded-3xl p-8 max-w-lg w-full border border-gray-100 dark:border-slate-800 shadow-2xl transition-all">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{modalContent.title}</h3>
                        <p className="text-gray-500 dark:text-slate-400 font-light mb-8 leading-relaxed">{modalContent.message}</p>
                        <div className="flex justify-end space-x-3">
                            <button onClick={closeModal} className="px-6 py-2.5 text-sm font-semibold text-gray-400 hover:text-gray-600 dark:hover:text-slate-200 transition">Cancel</button>
                            <button
                                onClick={handleConfirm}
                                className={`px-8 py-2.5 text-sm font-bold text-white rounded-full transition shadow-lg ${
                                    modalState.type === 'publish' ? 'bg-emerald-500 shadow-emerald-500/20' : 'bg-red-500 shadow-red-500/20'
                                }`}
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
