import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import { Head, useForm } from '@inertiajs/react';

export default function Edit({ auth, article }) {
    const { data, setData, patch, processing, errors } = useForm({
        title: article.title,
        content: article.content,
    });

    const submit = (e) => {
        e.preventDefault();
        patch(route('articles.update', article.id));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="text-sm font-medium tracking-widest text-gray-500 dark:text-slate-400 uppercase">Refine Content</h2>}
        >
            <Head title="Edit Article" />

            <div className="py-16 sm:py-24 bg-white dark:bg-slate-950 min-h-screen transition-colors duration-500">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">

                    <form onSubmit={submit} className="space-y-12">
                        {/* Title Section */}
                        <div className="group border-b border-gray-100 dark:border-slate-800 pb-8 focus-within:border-cyan-500 transition-colors duration-300">
                            <label htmlFor="title" className="block text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-gray-400 dark:text-cyan-500/60 mb-4">
                                Edit // Title
                            </label>
                            <input
                                id="title"
                                type="text"
                                value={data.title}
                                className="block w-full border-none bg-transparent p-0 text-3xl sm:text-5xl font-black text-gray-900 dark:text-white focus:ring-0 transition-all"
                                onChange={(e) => setData('title', e.target.value)}
                                required
                            />
                            <InputError message={errors.title} className="mt-4" />
                        </div>

                        {/* Content Section */}
                        <div className="space-y-4">
                            <label htmlFor="content" className="block text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-gray-400 dark:text-cyan-500/60">
                                Edit // Content
                            </label>
                            <textarea
                                id="content"
                                value={data.content}
                                className="block w-full border-none bg-transparent p-0 text-lg leading-relaxed text-gray-600 dark:text-slate-300 focus:ring-0 min-h-[400px] resize-none"
                                onChange={(e) => setData('content', e.target.value)}
                                required
                            ></textarea>
                            <InputError message={errors.content} className="mt-2" />
                        </div>

                        {/* Action Section */}
                        <div className="flex items-center justify-end pt-12 border-t border-gray-100 dark:border-slate-800">
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center justify-center px-10 py-4 rounded-full text-sm font-semibold text-white bg-slate-900 dark:bg-cyan-600 hover:bg-slate-800 dark:hover:bg-cyan-500 shadow-xl transition-all duration-300 disabled:opacity-50"
                            >
                                {processing ? 'Updating...' : 'Update Article'}
                                <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                            </button>
                        </div>
                    </form>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
