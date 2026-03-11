import { Head, Link } from '@inertiajs/react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { useState } from 'react'

export default function Favorites({ favoriteArticles }) {

    const [filter, setFilter] = useState('all')

    return (
        <AuthenticatedLayout
            header={<h2 className="text-3xl font-serif">My Saved Articles</h2>}
        >
            <Head title="Saved Articles" />

            <div className="max-w-7xl mx-auto px-12 pb-20">

                {favoriteArticles.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-gray-500 text-lg mb-4">No saved articles yet</p>
                        <Link
                            href={route('student.dashboard')}
                            className="text-blue-600 hover:underline font-medium"
                        >
                            Browse articles →
                        </Link>
                    </div>
                ) : (
                    <div>
                        <p className="text-gray-600 mb-8">
                            You have <strong>{favoriteArticles.length}</strong> saved article{favoriteArticles.length !== 1 ? 's' : ''}
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {favoriteArticles.map(article => (
                                <div
                                    key={article.id}
                                    className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition"
                                >
                                    <div className="p-6">
                                        <div className="flex items-start justify-between mb-3">
                                            <span
                                                className="text-xs font-semibold px-3 py-1 rounded text-white"
                                                style={{
                                                    backgroundColor: article.category?.color || '#3B82F6'
                                                }}
                                            >
                                                {article.category?.icon} {article.category?.name}
                                            </span>
                                        </div>

                                        <h3 className="text-lg font-semibold mb-2 line-clamp-2">
                                            {article.title}
                                        </h3>

                                        <p className="text-sm text-gray-600 mb-4">
                                            by {article.writer?.name}
                                        </p>

                                        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                                            <span>👁️ {article.views_count || 0} views</span>
                                            <span>💬 {article.comments?.length || 0}</span>
                                        </div>

                                        <Link
                                            href={route('articles.show', article.id)}
                                            className="w-full bg-[#0F172A] text-white text-center py-2 rounded-md hover:bg-[#1E293B] font-medium text-sm"
                                        >
                                            Read Article
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </AuthenticatedLayout>
    )
}
