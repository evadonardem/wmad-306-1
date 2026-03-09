import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import { useForm, Head } from '@inertiajs/react';

export default function Create({ auth }) {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        content: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('articles.store'));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="text-sm font-medium tracking-widest text-gray-500 dark:text-slate-400 uppercase">Draft New Content</h2>}
        >
            <Head title="Create Article" />

            <div className="py-16 sm:py-24 bg-white dark:bg-slate-950 min-h-screen transition-colors duration-500">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">

                    <form onSubmit={submit} className="space-y-12">
                        {/* Title Input Section */}
                        <div className="group border-b border-gray-100 dark:border-slate-800 pb-8 focus-within:border-cyan-500 transition-colors duration-300">
                            <label htmlFor="title" className="block text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-gray-400 dark:text-cyan-500/60 mb-4">
                                Entry // Title
                            </label>
                            <input
                                id="title"
                                type="text"
                                value={data.title}
                                placeholder="Enter a compelling title..."
                                className="block w-full border-none bg-transparent p-0 text-3xl sm:text-5xl font-black text-gray-900 dark:text-white placeholder-gray-200 dark:placeholder-slate-800 focus:ring-0 transition-all"
                                onChange={(e) => setData('title', e.target.value)}
                                required
                                autoFocus
                            />
                            <InputError message={errors.title} className="mt-4" />
                        </div>

                        {/* Content Input Section */}
                        <div className="space-y-4">
                            <label htmlFor="content" className="block text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-gray-400 dark:text-cyan-500/60">
                                Entry // Content
                            </label>
                            <textarea
                                id="content"
                                value={data.content}
                                placeholder="Begin writing your article here..."
                                className="block w-full border-none bg-transparent p-0 text-lg leading-relaxed text-gray-600 dark:text-slate-300 placeholder-gray-200 dark:placeholder-slate-800 focus:ring-0 min-h-[400px] resize-none"
                                onChange={(e) => setData('content', e.target.value)}
                                required
                            ></textarea>
                            <InputError message={errors.content} className="mt-2" />
                        </div>

                        {/* Action Section */}
                        <div className="flex items-center justify-between pt-12 border-t border-gray-100 dark:border-slate-800">
                            <p className="text-xs text-gray-400 font-light italic">Your progress is saved as a draft.</p>
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center justify-center px-8 py-4 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/30 transition-all duration-300 disabled:opacity-50"
                            >
                                {processing ? 'Processing...' : 'Save Draft'}
                                <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </button>
                        </div>
                    </form>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
