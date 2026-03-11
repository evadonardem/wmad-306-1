import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head } from '@inertiajs/react'

export default function Analytics({ publishedArticles, stats }) {

    const topArticles = publishedArticles.slice(0, 5)
    const maxEngagement = Math.max(...publishedArticles.map(a => a.engagement), 1)

    return (
        <AuthenticatedLayout
            header={<h2 className="text-3xl font-serif">Analytics</h2>}
        >
            <Head title="Writer Analytics" />

            <div className="max-w-7xl mx-auto px-12 pb-20">

                {/* STATS CARDS */}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">

                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                        <p className="text-gray-600 text-sm font-medium mb-2">Total Views</p>
                        <p className="text-4xl font-bold text-blue-600">{stats.total_views.toLocaleString()}</p>
                        <p className="text-xs text-gray-500 mt-2">Across all published articles</p>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                        <p className="text-gray-600 text-sm font-medium mb-2">Total Comments</p>
                        <p className="text-4xl font-bold text-green-600">{stats.total_comments.toLocaleString()}</p>
                        <p className="text-xs text-gray-500 mt-2">Student engagement</p>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                        <p className="text-gray-600 text-sm font-medium mb-2">Published Articles</p>
                        <p className="text-4xl font-bold text-purple-600">{stats.total_articles}</p>
                        <p className="text-xs text-gray-500 mt-2">Total published</p>
                    </div>

                </div>

                {/* TOP ARTICLES CHART */}

                <div className="bg-white border border-gray-200 rounded-xl p-8 mb-12">

                    <h3 className="text-2xl font-serif mb-8">Top Performing Articles</h3>

                    {publishedArticles.length === 0 ? (
                        <p className="text-gray-500 py-8">No published articles yet</p>
                    ) : (
                        <div className="space-y-6">
                            {topArticles.map((article, idx) => {
                                const barWidth = (article.engagement / maxEngagement) * 100
                                return (
                                    <div key={article.id}>
                                        <div className="flex justify-between mb-2">
                                            <div>
                                                <p className="font-semibold text-gray-900">{idx + 1}. {article.title}</p>
                                                <p className="text-xs text-gray-500">{article.created_at}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-lg">{article.engagement}</p>
                                                <p className="text-xs text-gray-500">{article.views} views • {article.comments} comments</p>
                                            </div>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
                                                style={{ width: `${barWidth}%` }}
                                            />
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}

                </div>

                {/* ALL ARTICLES TABLE */}

                <div className="bg-white border border-gray-200 rounded-xl p-8">

                    <h3 className="text-2xl font-serif mb-6">All Articles Performance</h3>

                    {publishedArticles.length === 0 ? (
                        <p className="text-gray-500 py-8">No published articles yet</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Article Title</th>
                                        <th className="text-center py-3 px-4 font-semibold text-gray-700">👁️ Views</th>
                                        <th className="text-center py-3 px-4 font-semibold text-gray-700">💬 Comments</th>
                                        <th className="text-center py-3 px-4 font-semibold text-gray-700">📊 Engagement</th>
                                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Published</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {publishedArticles.map(article => (
                                        <tr key={article.id} className="border-b border-gray-100 hover:bg-gray-50">
                                            <td className="py-3 px-4 font-medium text-gray-900">{article.title}</td>
                                            <td className="text-center py-3 px-4 text-gray-600">{article.views.toLocaleString()}</td>
                                            <td className="text-center py-3 px-4 text-gray-600">{article.comments}</td>
                                            <td className="text-center py-3 px-4">
                                                <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
                                                    {article.engagement}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-gray-500 text-xs">{article.created_at}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                </div>

            </div>

        </AuthenticatedLayout>
    )
}
