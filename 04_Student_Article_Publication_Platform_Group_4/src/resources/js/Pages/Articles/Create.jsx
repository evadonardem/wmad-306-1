import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, useForm } from '@inertiajs/react';
import JoditEditor from 'jodit-react';
import { useMemo, useRef } from 'react';

export default function ArticleCreate({ categories = [] }) {
    const editor = useRef(null);
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        category: categories[0] || 'General',
        content: '',
    });

    const editorConfig = useMemo(
        () => ({
            readonly: false,
            placeholder: 'Start writing your article...',
            height: 360,
        }),
        [],
    );

    const submit = (e) => {
        e.preventDefault();
        post(route('articles.store'));
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold text-slate-100">New Article</h2>}>
            <Head title="Create Article" />
            <div className="py-10">
                <div className="mx-auto max-w-4xl rounded-2xl border border-slate-800/80 bg-slate-900/70 p-6 shadow-2xl shadow-slate-950/40 sm:px-8">
                    <form onSubmit={submit} className="space-y-4">
                        <div>
                            <InputLabel htmlFor="title" value="Article Title" />
                            <TextInput
                                id="title"
                                value={data.title}
                                className="mt-1 block w-full border-slate-700 bg-slate-950/70 text-slate-100 placeholder:text-slate-500 focus:border-cyan-300 focus:ring-cyan-300"
                                onChange={(e) => setData('title', e.target.value)}
                                placeholder="Enter your article title"
                                required
                            />
                            <InputError message={errors.title} className="mt-2" />
                        </div>
                        <div>
                            <InputLabel htmlFor="content" value="Article Content" />
                            <div className="mt-1 rounded-md border border-slate-700 bg-slate-950/70 p-2">
                                <JoditEditor
                                    ref={editor}
                                    value={data.content}
                                    config={editorConfig}
                                    onBlur={(newContent) => setData('content', newContent)}
                                />
                            </div>
                            <InputError message={errors.content} className="mt-2" />
                        </div>
                        <div>
                            <InputLabel htmlFor="category" value="Category" />
                            <select
                                id="category"
                                value={data.category}
                                onChange={(e) => setData('category', e.target.value)}
                                className="mt-1 block w-full rounded-md border border-slate-700 bg-slate-950/70 text-slate-100 shadow-sm focus:border-cyan-300 focus:ring-cyan-300"
                                required
                            >
                                {categories.map((category) => (
                                    <option key={category} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </select>
                            <InputError message={errors.category} className="mt-2" />
                        </div>
                        <PrimaryButton disabled={processing}>Submit for Review</PrimaryButton>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
