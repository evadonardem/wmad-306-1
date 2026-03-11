import { Link } from '@inertiajs/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenNib, faBookOpen, faUsers, faTrophy } from '@fortawesome/free-solid-svg-icons'

export default function Welcome({ auth, latestArticles = [], topWriters = [] }) {

    return (
        <div className="min-h-screen bg-[#F8F6F1] text-[#0F172A] antialiased">

            {/* NAVBAR */}

            <nav className="flex justify-between items-center px-12 py-8 max-w-7xl mx-auto">

                <h1 className="text-2xl font-semibold tracking-wide">
                    PublishHub
                </h1>

                <div className="space-x-8 text-sm font-medium">

                    {auth?.user ? (

                        <Link
                            href="/dashboard"
                            className="hover:text-[#C6A75E]"
                        >
                            Dashboard
                        </Link>

                    ) : (

                        <>
                            <Link
                                href="/login"
                                className="hover:text-[#C6A75E]"
                            >
                                Log In
                            </Link>

                            <Link
                                href="/register"
                                className="bg-[#0F172A] text-white px-6 py-2.5 rounded-md hover:bg-[#1E293B]"
                            >
                                Get Started
                            </Link>
                        </>

                    )}

                </div>

            </nav>


            {/* HERO */}

            <section className="px-12 pt-28 pb-36 text-center max-w-4xl mx-auto">

                <h2 className="text-5xl md:text-6xl font-serif leading-tight mb-8">
                    Publish Your Ideas. <br className="hidden md:block" />
                    Share Your Voice.
                </h2>

                <p className="text-lg md:text-xl text-gray-700 mb-12 leading-relaxed">
                    A structured editorial platform for student writers, editors, and readers.
                    Draft, review, revise, and publish with clarity and purpose.
                </p>

                {!auth?.user && (

                    <div className="flex justify-center gap-6 flex-wrap">

                        <Link
                            href="/register"
                            className="bg-[#0F172A] text-white px-8 py-3 rounded-md text-lg hover:bg-[#1E293B]"
                        >
                            Start Publishing
                        </Link>

                        <Link
                            href="/login"
                            className="border border-[#0F172A] px-8 py-3 rounded-md text-lg hover:bg-[#0F172A] hover:text-white"
                        >
                            Log In
                        </Link>

                    </div>

                )}

            </section>


            <div className="border-t border-gray-200 max-w-6xl mx-auto"></div>


            {/* FEATURES */}

            <section className="grid md:grid-cols-3 gap-12 px-12 py-24 max-w-6xl mx-auto">

                <div className="bg-white p-10 rounded-xl border border-gray-200 text-center hover:-translate-y-2 hover:shadow-lg transition">

                    <FontAwesomeIcon
                        icon={faPenNib}
                        className="text-3xl mb-6 text-[#C6A75E]"
                    />

                    <h3 className="text-xl font-semibold mb-4">
                        Write & Submit
                    </h3>

                    <p className="text-gray-600 leading-relaxed">
                        Create structured drafts, revise content, and submit articles
                        through a guided editorial workflow.
                    </p>

                </div>


                <div className="bg-white p-10 rounded-xl border border-gray-200 text-center hover:-translate-y-2 hover:shadow-lg transition">

                    <FontAwesomeIcon
                        icon={faUsers}
                        className="text-3xl mb-6 text-[#C6A75E]"
                    />

                    <h3 className="text-xl font-semibold mb-4">
                        Editorial Review
                    </h3>

                    <p className="text-gray-600 leading-relaxed">
                        Editors evaluate submissions, request revisions,
                        and approve content with clear status transitions.
                    </p>

                </div>


                <div className="bg-white p-10 rounded-xl border border-gray-200 text-center hover:-translate-y-2 hover:shadow-lg transition">

                    <FontAwesomeIcon
                        icon={faBookOpen}
                        className="text-3xl mb-6 text-[#C6A75E]"
                    />

                    <h3 className="text-xl font-semibold mb-4">
                        Publish & Showcase
                    </h3>

                    <p className="text-gray-600 leading-relaxed">
                        Approved articles are published and organized
                        for academic and creative communities.
                    </p>

                </div>

            </section>


            {/* LATEST ARTICLES */}

            <section className="px-12 py-24 max-w-6xl mx-auto">

                <h3 className="text-3xl font-serif mb-10 text-center">
                    Latest Published Articles
                </h3>

                <div className="grid md:grid-cols-3 gap-8">

                    {latestArticles.length === 0 && (

                        <div className="col-span-3 text-center text-gray-500">
                            No published articles yet.
                        </div>

                    )}

                    {latestArticles.map(article => (

                        <div
                            key={article.id}
                            className="bg-white border border-gray-200 rounded-xl p-8 hover:shadow-lg transition"
                        >

                            <h4 className="text-lg font-semibold mb-2">
                                {article.title}
                            </h4>

                            <p className="text-sm text-gray-500 mb-2">
                                {article.writer?.name}
                            </p>

                            <p className="text-sm text-gray-400 mb-4">
                                {article.category?.name}
                            </p>

                            <Link
                                href={`/articles/${article.id}`}
                                className="text-sm text-[#0F172A] font-medium hover:text-[#C6A75E]"
                            >
                                Read Article →
                            </Link>

                        </div>

                    ))}

                </div>

            </section>


            {/* TOP WRITERS */}

            <section className="px-12 pb-32 max-w-5xl mx-auto">

                <h3 className="text-3xl font-serif mb-10 text-center">
                    Top Writers
                </h3>

                <div className="bg-white border border-gray-200 rounded-xl p-8">

                    {topWriters.length === 0 && (

                        <p className="text-gray-500 text-center">
                            No writers ranked yet.
                        </p>

                    )}

                    {topWriters.map((writer, index) => (

                        <div
                            key={writer.id}
                            className="flex justify-between items-center py-4 border-b last:border-none"
                        >

                            <div className="flex items-center gap-4">

                                <FontAwesomeIcon
                                    icon={faTrophy}
                                    className="text-[#C6A75E]"
                                />

                                <span className="font-medium">
                                    #{index + 1} {writer.name}
                                </span>

                            </div>

                            <span className="text-sm text-gray-500">
                                {writer.published_count} articles
                            </span>

                        </div>

                    ))}

                </div>

            </section>

        </div>
    )
}