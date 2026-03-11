import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head, Link, router } from '@inertiajs/react'
import { useState } from 'react'

export default function Dashboard({
    articles = [],
    stats = {},
    popularArticles = [],
    search = ""
}) {

    const [searchTerm, setSearchTerm] = useState(search ?? "")

    const handleSearch = (e) => {

        e.preventDefault()

        router.get(route('student.dashboard'), {
            search: searchTerm
        })

    }

    return (

        <AuthenticatedLayout
            header={<h2 className="text-4xl font-serif">Student Dashboard</h2>}
        >

            <Head title="Student Dashboard" />

            <div className="max-w-7xl mx-auto px-12 pb-20">


                {/* STATISTICS */}

                <div className="grid md:grid-cols-3 gap-6 mb-14">

                    <StatCard
                        value={stats.articles_available ?? 0}
                        label="Articles Available"
                        color="#16A34A"
                    />

                    <StatCard
                        value={stats.comments_posted ?? 0}
                        label="Comments Posted"
                        color="#2563EB"
                    />

                    <StatCard
                        value={stats.total_comments ?? 0}
                        label="Platform Comments"
                        color="#0F172A"
                    />

                </div>


                {/* POPULAR ARTICLES */}

                <h3 className="text-2xl font-serif mb-6">
                    Popular Articles
                </h3>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">

                    {(popularArticles ?? []).map(article => (

                        <div
                            key={article.id}
                            className="bg-white border border-gray-200 rounded-xl p-8 hover:shadow-lg transition"
                        >

                            <h4 className="text-lg font-semibold mb-2 line-clamp-2">
                                {article.title}
                            </h4>

                            <p className="text-sm text-gray-500 mb-2">
                                {article.writer?.name}
                            </p>

                            <p className="text-sm text-gray-400 mb-4">
                                {article.comments_count} comments
                            </p>

                            <Link
                                href={route('articles.show', article.id)}
                                className="bg-[#0F172A] text-white px-4 py-2 rounded-md text-sm hover:bg-[#1E293B]"
                            >
                                Read Article
                            </Link>

                        </div>

                    ))}

                </div>



                {/* SEARCH BAR */}

                <form onSubmit={handleSearch} className="mb-10">

                    <div className="flex gap-3">

                        <input
                            type="text"
                            placeholder="Search articles..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="border border-gray-300 rounded-md px-4 py-2 w-full"
                        />

                        <button
                            type="submit"
                            className="bg-[#0F172A] text-white px-6 py-2 rounded-md hover:bg-[#1E293B]"
                        >
                            Search
                        </button>

                    </div>

                </form>



                {/* ALL ARTICLES */}

                <h3 className="text-2xl font-serif mb-6">
                    Published Articles
                </h3>


                {articles.length === 0 ? (

                    <div className="bg-white border border-gray-200 rounded-xl p-10 text-center text-gray-500">
                        No published articles available.
                    </div>

                ) : (

                    <div className="grid md:grid-cols-3 gap-8">

                        {articles.map(article => (

                            <div
                                key={article.id}
                                className="bg-white border border-gray-200 rounded-xl p-8 hover:shadow-lg transition"
                            >

                                <h3 className="text-lg font-semibold mb-2 line-clamp-2">
                                    {article.title}
                                </h3>

                                <p className="text-sm text-gray-500">
                                    {article.writer?.name}
                                </p>

                                <p className="text-sm text-gray-400 mb-4">
                                    {article.category?.name}
                                </p>

                                <span className="text-xs px-3 py-1 rounded-full border bg-green-100 text-green-700 border-green-200">
                                    Published
                                </span>

                                <div className="mt-6">

                                    <Link
                                        href={route('articles.show', article.id)}
                                        className="bg-[#0F172A] text-white px-4 py-2 rounded-md text-sm hover:bg-[#1E293B]"
                                    >
                                        Read Article
                                    </Link>

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </div>

        </AuthenticatedLayout>
    )
}



function StatCard({ value, label, color }) {

    const radius = 36
    const circumference = 2 * Math.PI * radius
    const progress = Math.min(value * 10, 100)
    const offset = circumference - (progress / 100) * circumference

    return (

        <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center shadow-sm hover:shadow-md transition">

            <div className="relative w-24 h-24 mb-3">

                <svg className="w-24 h-24 transform -rotate-90">

                    <circle
                        cx="48"
                        cy="48"
                        r={radius}
                        stroke="#E5E7EB"
                        strokeWidth="8"
                        fill="none"
                    />

                    <circle
                        cx="48"
                        cy="48"
                        r={radius}
                        stroke={color}
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                    />

                </svg>

                <div className="absolute inset-0 flex items-center justify-center text-xl font-semibold">
                    {value}
                </div>

            </div>

            <p className="text-sm text-gray-500">{label}</p>

        </div>

    )
}