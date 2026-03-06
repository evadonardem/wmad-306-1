import { Link } from '@inertiajs/react';
import WriterLayout from '@/Layouts/WriterLayout';
import ArticleForm from './Components/ArticleForm';

export default function EditArticle({ article, categories = [], initialDraftVersions = [] }) {
    return (
        <WriterLayout>
            <div className="mb-4">
                <Link
                    href={route('writer.dashboard')}
                    className="inline-flex items-center gap-2 rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                    Back to dashboard
                </Link>
            </div>

            <h2 className="text-xl font-semibold text-gray-900">Edit Article</h2>
            <ArticleForm article={article} categories={categories} initialDraftVersions={initialDraftVersions} />
        </WriterLayout>
    );
}
