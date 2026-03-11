import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head, Link, router } from '@inertiajs/react'

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Tooltip,
    Legend
} from 'chart.js'

import { Line, Doughnut, Pie } from 'react-chartjs-2'

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Tooltip,
    Legend
)

export default function Dashboard({
    articles = [],
    stats = {},
    activity = [],
    draftActivity = [],
    deletedActivity = [],
    activityRange = 'month',
    categoryStats = [],
    needsRevisionArticles = []
}) {

    const submitArticle = (id) => {
        router.post(`/writer/articles/${id}/submit`, {}, { preserveScroll: true })
    }

    const deleteArticle = (id) => {
        if (confirm('Are you sure you want to delete this article?')) {
            router.delete(`/articles/${id}`, { preserveScroll: true })
        }
    }

    const activitySafe = activity ?? []
    const draftSafe = draftActivity ?? []
    const deletedSafe = deletedActivity ?? []
    const categorySafe = categoryStats ?? []

    /*
    ---------------------------
    Writing Activity Chart
    ---------------------------
    */

    const labels = activitySafe.map(a => a.label)

    const draftMap = Object.fromEntries(draftSafe.map(a => [a.label, a.total]))
    const deletedMap = Object.fromEntries(deletedSafe.map(a => [a.label, a.total]))

    const draftData = labels.map((label) => draftMap[label] || 0)
    const deletedData = labels.map((label) => deletedMap[label] || 0)

    const activityChartData = {
        labels,
        datasets: [
            {
                label: "Created",
                data: activitySafe.map(a => a.total),
                borderColor: "#0F172A",
                backgroundColor: "rgba(15,23,42,0.12)",
                fill: true,
                tension: 0.4
            },
            {
                label: "Drafts",
                data: draftData,
                borderColor: "#64748B",
                backgroundColor: "rgba(100,116,139,0.12)",
                fill: true,
                tension: 0.4
            },
            {
                label: "Deleted",
                data: deletedData,
                borderColor: "#EF4444",
                backgroundColor: "rgba(239,68,68,0.12)",
                fill: true,
                tension: 0.4
            }
        ]
    }

    const activityOptions = {
        maintainAspectRatio:false,
        animation:{duration:1000}
    }

    /*
    ---------------------------
    Status Chart
    ---------------------------
    */

    const statusData = {
        labels:["Drafts","Submitted","Published"],
        datasets:[
            {
                data:[
                    stats.drafts || 0,
                    stats.submitted || 0,
                    stats.published || 0
                ],
                backgroundColor:[
                    "#94A3B8",
                    "#3B82F6",
                    "#16A34A"
                ]
            }
        ]
    }

    /*
    ---------------------------
    Category Chart
    ---------------------------
    */

    const categoryData = {
        labels: categorySafe.map(c => c.category),
        datasets:[
            {
                data: categorySafe.map(c => c.total),
                backgroundColor:[
                    "#0F172A",
                    "#3B82F6",
                    "#16A34A",
                    "#F59E0B",
                    "#8B5CF6"
                ]
            }
        ]
    }

    return (

        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center w-full">
                    <h2 className="text-4xl font-serif">Writer Dashboard</h2>
                    <Link
                        href={route('writer.analytics')}
                        className="bg-[#0F172A] text-white px-4 py-2 rounded-md hover:bg-[#1E293B] font-medium text-sm"
                    >
                        📊 View Analytics
                    </Link>
                </div>
            }
        >

            <Head title="Writer Dashboard" />

            <div className="max-w-7xl mx-auto px-12 pb-20">

                {/* STATISTICS */}

                <div className="grid md:grid-cols-4 gap-6 mb-14">

                    <StatCard title="Total Articles" value={stats.total_articles || 0}/>
                    <StatCard title="Drafts" value={stats.drafts || 0}/>
                    <StatCard title="Submitted" value={stats.submitted || 0}/>
                    <StatCard title="Published" value={stats.published || 0}/>

                </div>


                {/* WRITING ACTIVITY */}

                <div className="bg-white border rounded-xl p-8 mb-14">

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                        <h3 className="text-2xl font-serif">
                            Writing Activity
                        </h3>

                        <div className="flex items-center gap-2">
                            {['day','week','month'].map((rangeOption) => {
                                const label = rangeOption.charAt(0).toUpperCase() + rangeOption.slice(1);
                                const isActive = activityRange === rangeOption;

                                return (
                                    <button
                                        key={rangeOption}
                                        type="button"
                                        onClick={() => {
                                            if (activityRange === rangeOption) return;
                                            router.get(route('writer.dashboard'), { range: rangeOption }, { preserveState: true, preserveScroll: true });
                                        }}
                                        className={`px-4 py-2 rounded-md text-sm font-medium border transition ${isActive ? 'bg-[#0F172A] text-white border-[#0F172A]' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'}`}
                                    >
                                        {label}
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    <div style={{height:"260px"}}>

                        <Line
                            data={activityChartData}
                            options={activityOptions}
                        />

                    </div>

                </div>



                {/* ARTICLE MANAGEMENT */}

                <div className="flex justify-between items-center mb-12">

                    <div>

                        <h3 className="text-3xl font-serif mb-3">
                            Manage Your Articles
                        </h3>

                        <p className="text-gray-600">
                            Draft, submit, and revise your publications.
                        </p>

                    </div>

                    <Link
                        href={route('writer.articles.create')}
                        className="bg-[#0F172A] text-white px-7 py-3 rounded-md hover:bg-[#1E293B]"
                    >
                        Create Article
                    </Link>

                </div>


                {/* ARTICLE GRID */}

                {needsRevisionArticles.length > 0 && (
                    <div className="mb-12">
                        <h3 className="text-3xl font-serif mb-4">Pending Revisions</h3>

                        <div className="grid md:grid-cols-2 gap-6 mb-8">
                            {needsRevisionArticles.map(article => {

                                const latestRevision = (article.revisions && article.revisions[0]) || null

                                return (
                                    <div key={article.id} className="bg-white p-6 rounded-xl border hover:shadow-lg transition">
                                        <h4 className="text-lg font-semibold mb-2">{article.title}</h4>
                                        <p className="text-sm text-gray-600 mb-3">{article.category?.name}</p>
                                        {latestRevision && (
                                            <div className="mb-3 text-sm text-gray-700">
                                                <strong>Editor feedback:</strong>
                                                <p className="mt-2 whitespace-pre-line">{latestRevision.comments}</p>
                                            </div>
                                        )}

                                        <div className="flex gap-3">
                                            <Link href={`/articles/${article.id}/edit`} className="text-sm px-4 py-2 border rounded-md">Edit</Link>
                                            <button onClick={() => submitArticle(article.id)} className="text-sm px-4 py-2 bg-green-600 text-white rounded-md">Submit</button>
                                            <button onClick={() => deleteArticle(article.id)} className="text-sm px-4 py-2 bg-red-600 text-white rounded-md">Delete</button>
                                        </div>
                                    </div>
                                )

                            })}
                        </div>
                    </div>
                )}

                {/* Draft Articles */}
                <div className="mb-12">
                    <h3 className="text-3xl font-serif mb-4">Draft Articles</h3>

                    {articles.filter(a => a.status?.name === 'draft').length === 0 ? (
                        <p className="text-gray-600">No draft articles yet. Create one to start writing.</p>
                    ) : (
                        <div className="grid md:grid-cols-2 gap-6 mb-8">
                            {articles.filter(a => a.status?.name === 'draft').map(article => (
                                <div key={article.id} className="bg-white p-6 rounded-xl border hover:shadow-lg transition">
                                    <h4 className="text-lg font-semibold mb-2">{article.title}</h4>
                                    <p className="text-sm text-gray-600 mb-3">{article.category?.name}</p>

                                    <div className="flex gap-3">
                                        <Link href={`/articles/${article.id}/edit`} className="text-sm px-4 py-2 border rounded-md">Edit</Link>
                                        <button onClick={() => submitArticle(article.id)} className="text-sm px-4 py-2 bg-green-600 text-white rounded-md">Submit</button>
                                        <button onClick={() => deleteArticle(article.id)} className="text-sm px-4 py-2 bg-red-600 text-white rounded-md">Delete</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Published Articles */}
                <div className="mb-12">
                    <h3 className="text-3xl font-serif mb-4">Published Articles</h3>

                    {articles.filter(a => a.status?.name === 'published').length === 0 ? (
                        <p className="text-gray-600">You haven't published anything yet.</p>
                    ) : (
                        <div className="grid md:grid-cols-3 gap-10">
                            {articles.filter(a => a.status?.name === 'published').map(article => (
                                <div key={article.id} className="bg-white p-8 rounded-xl border hover:shadow-lg transition">
                                    <h4 className="text-xl font-semibold mb-2">{article.title}</h4>
                                    <p className="text-sm text-gray-500 mb-4">{article.category?.name}</p>

                                    <div className="flex flex-wrap gap-3">
                                        <Link
                                            href={`/articles/${article.id}`}
                                            className="text-sm px-4 py-2 border rounded-md"
                                        >
                                            View
                                        </Link>

                                        <button
                                            onClick={() => deleteArticle(article.id)}
                                            className="text-sm px-4 py-2 bg-red-600 text-white rounded-md"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>

        </AuthenticatedLayout>

    )
}


function StatCard({ title, value }) {

    const percent = Math.min(value * 10, 100)

    return (

        <div className="bg-white border rounded-xl p-6 flex flex-col items-center">

            <div className="relative w-20 h-20 mb-3">

                <svg className="w-20 h-20 transform -rotate-90">

                    <circle
                        cx="40"
                        cy="40"
                        r="34"
                        stroke="#e5e7eb"
                        strokeWidth="6"
                        fill="none"
                    />

                    <defs>

                        <linearGradient id="grad1">

                            <stop offset="0%" stopColor="#0F172A"/>
                            <stop offset="100%" stopColor="#3B82F6"/>

                        </linearGradient>

                    </defs>

                    <circle
                        cx="40"
                        cy="40"
                        r="34"
                        stroke="url(#grad1)"
                        strokeWidth="6"
                        fill="none"
                        strokeDasharray="214"
                        strokeDashoffset={214 - (214 * percent) / 100}
                        style={{transition:"stroke-dashoffset 1s ease"}}
                    />

                </svg>

                <div className="absolute inset-0 flex items-center justify-center font-semibold text-lg">

                    {value}

                </div>

            </div>

            <p className="text-sm text-gray-500">{title}</p>

        </div>

    )

}
