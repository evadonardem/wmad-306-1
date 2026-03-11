import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head, Link, router } from '@inertiajs/react'

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    PointElement,
    LineElement,
    Tooltip,
    Legend
} from 'chart.js'

import { Doughnut, Bar, Line } from 'react-chartjs-2'

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    PointElement,
    LineElement,
    Tooltip,
    Legend
)

export default function Dashboard({ pending = [], needsRevision = [], published = [], stats = {}, activity = [] }) {

    const pendingSafe = pending ?? []
    const revisionSafe = needsRevision ?? []
    const publishedSafe = published ?? []
    const activitySafe = activity ?? []

    const deleteArticle = (id) => {
        if (confirm('Are you sure you want to delete this article?')) {
            router.delete(`/articles/${id}`, { preserveScroll: true })
        }
    }

    // group published articles by author/editor who published them
    let publishedBy = {};
    try {
        if (Array.isArray(publishedSafe)) {
            publishedBy = publishedSafe.reduce((acc, art) => {
                // Group published articles by the writer (falls back to editor if writer is missing)
                const key = art.writer?.name || art.editor?.name || 'Unknown';
                if (!acc[key]) acc[key] = [];
                acc[key].push(art);
                return acc;
            }, {});
        } else {
            console.error('expected publishedSafe to be array, got', publishedSafe);
        }
    } catch (err) {
        console.error('error grouping published articles', err);
        publishedBy = {};
    }

    const barOptions = {
        maintainAspectRatio:false,
        plugins:{legend:{display:false}}
    }

    /*
    --------------------------------
    PLATFORM ACTIVITY CHART
    --------------------------------
    */

    const activityChartData = {
        labels: activitySafe.map(a => a.month),
        datasets: [

            {
                label: "Articles Submitted",
                data: activitySafe.map(a => a.submitted),
                borderColor: "#2563EB",
                backgroundColor: "rgba(37,99,235,0.15)",
                fill: true,
                tension: 0.4
            },

            {
                label: "Articles Published",
                data: activitySafe.map(a => a.published),
                borderColor: "#16A34A",
                backgroundColor: "rgba(22,163,74,0.15)",
                fill: true,
                tension: 0.4
            },

            {
                label: "Comments Posted",
                data: activitySafe.map(a => a.comments),
                borderColor: "#EA580C",
                backgroundColor: "rgba(234,88,12,0.15)",
                fill: true,
                tension: 0.4
            }

        ]
    }

    const activityOptions = {
        maintainAspectRatio:false
    }

    return (

        <AuthenticatedLayout
            header={<h2 className="text-4xl font-serif">Editor Dashboard</h2>}
        >

            <Head title="Editor Dashboard" />

            <div className="max-w-7xl mx-auto px-12 pb-20">

                {/* STATISTICS */}

                <div className="grid md:grid-cols-4 gap-6 mb-14">

                    <StatCard
                        value={stats.pending_reviews ?? 0}
                        label="Pending Reviews"
                        color="#2563EB"
                    />

                    <StatCard
                        value={stats.needs_revision ?? 0}
                        label="Needs Revision"
                        color="#EA580C"
                    />

                    <StatCard
                        value={stats.published_articles ?? 0}
                        label="Published"
                        color="#16A34A"
                    />

                    <StatCard
                        value={stats.articles_reviewed ?? 0}
                        label="Reviewed by You"
                        color="#0F172A"
                    />

                </div>


                {/* PLATFORM ACTIVITY */}

                <div className="bg-white border rounded-xl p-8 mb-14">

                    <h3 className="text-xl font-serif mb-6">
                        Platform Activity
                    </h3>

                    <div style={{height:"260px"}}>

                        <Line
                            data={activityChartData}
                            options={activityOptions}
                        />

                    </div>

                </div>


                {/* ANALYTICS */}

                {/* charts removed per request */}


                {/* PENDING ARTICLES */}

                <h3 className="text-2xl font-serif mb-6">
                    Pending Articles
                </h3>

                <div className="grid md:grid-cols-3 gap-8 mb-14">

                    {pendingSafe.slice(0,6).map(article => (

                        <ArticleCard key={article.id} article={article} onDelete={deleteArticle}/>

                    ))}

                </div>


                {/* NEEDS REVISION */}

                <h3 className="text-2xl font-serif mb-6">
                    Needs Revision
                </h3>

                <div className="grid md:grid-cols-3 gap-8">

                    {revisionSafe.slice(0,6).map(article => (

                        <ArticleCard key={article.id} article={article} onDelete={deleteArticle}/>

                    ))}

                </div>


                {/* PUBLISHED ARTICLES */}

                <h3 className="text-2xl font-serif mb-6 mt-12">
                    Published Articles
                </h3>

                {Object.entries(publishedBy || {}).map(([publisher, arts]) => (
                    <div key={publisher} className="mb-10">
                        <h4 className="text-xl font-semibold mb-4">{publisher}</h4>
                        <div className="grid md:grid-cols-3 gap-8">
                            {arts.map(article => (
                                <ArticleCard key={article.id} article={article} onDelete={deleteArticle} />
                            ))}
                        </div>
                    </div>
                ))}

            </div>

        </AuthenticatedLayout>
    )
}


function ArticleCard({article, onDelete}){

    return(

        <div className="bg-white border border-gray-200 rounded-xl p-8 hover:shadow-lg transition">

            <h4 className="font-semibold mb-2">
                {article.title}
            </h4>

            <p className="text-sm text-gray-500 mb-4">
                {article.writer?.name}
            </p>

            <div className="flex gap-2">
                <Link
                    href={route('editor.articles.review', article.id)}
                    className="bg-[#0F172A] text-white px-4 py-2 rounded text-sm hover:bg-[#1E293B]"
                >
                    Review
                </Link>
                <button
                    onClick={() => onDelete(article.id)}
                    className="bg-red-600 text-white px-4 py-2 rounded text-sm hover:bg-red-700"
                >
                    Delete
                </button>
            </div>

        </div>

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
