import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head, useForm, usePage, router } from '@inertiajs/react'
import { useState, useEffect } from 'react'

export default function Show({ article, relatedArticles = [] }) {

    const { auth } = usePage().props
    const user = auth.user

    const isStudent = user?.roles?.some(role => role.name === "student")
    const isWriter = user?.roles?.some(role => role.name === "writer")
    const isEditor = user?.roles?.some(role => role.name === "editor")
    const isOwner = user?.id === article.writer_id
    const isDraftOrNeedsRevision = ['draft', 'needs_revision'].includes(article.status?.name)

    const [isFavorited, setIsFavorited] = useState(false)
    const [shareOpen, setShareOpen] = useState(false)

    const { data, setData, post, reset } = useForm({
        content: ""
    })

    useEffect(() => {
        if (user && isStudent) {
            fetch(route('articles.is-favorited', article.id))
                .then(res => res.json())
                .then(data => setIsFavorited(data.favorited))
        }
    }, [article.id, user])

    const [replyTo, setReplyTo] = useState(null)

    const submitComment = (e) => {
        e.preventDefault()
        const payload = { content: data.content }

        if (replyTo) {
            payload.content = `@${replyTo} ${payload.content}`
        }

        post(route('student.articles.comment', article.id), {
            data: payload,
            onSuccess: () => {
                reset()
                setReplyTo(null)
            }
        })
    }

    const toggleFavorite = () => {
        router.post(route('articles.favorite', article.id), {}, {
            onSuccess: () => setIsFavorited(!isFavorited)
        })
    }

    const handleShare = (platform) => {
        const url = window.location.href
        const title = article.title

        let shareUrl = ''

        switch (platform) {
            case 'facebook':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
                break
            case 'twitter':
                shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`
                break
            case 'linkedin':
                shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
                break
            case 'copy':
                navigator.clipboard.writeText(url)
                alert('Link copied to clipboard!')
                setShareOpen(false)
                return
        }

        if (shareUrl) {
            window.open(shareUrl, '_blank', 'width=600,height=400')
        }
    }

    const readingTime = Math.ceil((article.content?.split(' ').length || 0) / 200)

    return (

        <AuthenticatedLayout
            header={<h2 className="text-4xl font-serif">Article</h2>}
        >

            <Head title={article.title} />

            <div className="max-w-4xl mx-auto px-12 pb-20">

                {/* ARTICLE HEADER */}

                <div className="mb-8">

                    <h1 className="text-3xl font-serif mb-4">
                        {article.title}
                    </h1>

                    <div className="flex items-center justify-between mb-6">

                        <div className="flex gap-4 text-sm text-gray-600">
                            <span>{article.writer?.name}</span>
                            <span>•</span>
                            <span className="text-blue-600 font-medium px-2 py-1 rounded text-xs" style={{
                                backgroundColor: article.category?.color || '#3B82F6',
                                color: 'white',
                            }}>
                                {article.category?.icon} {article.category?.name}
                            </span>
                            <span>•</span>
                            <span>{readingTime} min read</span>
                            <span>•</span>
                            <span>{article.views_count || 0} views</span>
                        </div>

                        <div className="flex gap-2">
                            {isStudent && (
                                <button
                                    onClick={toggleFavorite}
                                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                                        isFavorited
                                            ? 'bg-red-100 text-red-600'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                                >
                                    {isFavorited ? '❤️ Saved' : '🤍 Save'}
                                </button>
                            )}

                            {isWriter && isOwner && isDraftOrNeedsRevision && (
                                <>
                                    <Link
                                        href={`/articles/${article.id}/edit`}
                                        className="px-3 py-2 bg-[#0F172A] text-white rounded-md text-sm font-medium hover:bg-[#1E293B]"
                                    >
                                        Edit Draft
                                    </Link>

                                    <button
                                        onClick={() => {
                                            if (confirm('Submit this article for review?')) {
                                                router.post(route('writer.articles.submit', article.id), {}, { preserveScroll: true })
                                            }
                                        }}
                                        className="px-3 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700"
                                    >
                                        Submit for Review
                                    </button>
                                </>
                            )}

                            <div className="relative">
                                <button
                                    onClick={() => setShareOpen(!shareOpen)}
                                    className="px-3 py-2 bg-gray-100 text-gray-600 rounded-md text-sm font-medium hover:bg-gray-200"
                                >
                                    📤 Share
                                </button>

                                {shareOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white border-2 border-gray-400 rounded-lg shadow-xl z-10">
                                        <button
                                            onClick={() => handleShare('facebook')}
                                            className="w-full text-left px-4 py-3 hover:bg-blue-50 flex items-center gap-2 text-black font-semibold border-b border-gray-200"
                                        >
                                            📘 Facebook
                                        </button>
                                        <button
                                            onClick={() => handleShare('twitter')}
                                            className="w-full text-left px-4 py-3 hover:bg-blue-50 flex items-center gap-2 text-black font-semibold border-b border-gray-200"
                                        >
                                            𝕏 Twitter
                                        </button>
                                        <button
                                            onClick={() => handleShare('linkedin')}
                                            className="w-full text-left px-4 py-3 hover:bg-blue-50 flex items-center gap-2 text-black font-semibold border-b border-gray-200"
                                        >
                                            💼 LinkedIn
                                        </button>
                                        <button
                                            onClick={() => handleShare('copy')}
                                            className="w-full text-left px-4 py-3 hover:bg-blue-50 flex items-center gap-2 text-black font-semibold"
                                        >
                                            🔗 Copy Link
                                        </button>
                                    </div>
                                )}
                            </div>

                        </div>

                    </div>

                </div>

                {/* ARTICLE CARD */}

                <div className="bg-white border border-gray-200 rounded-xl p-10 overflow-hidden mb-12">

                    <div
                        className="prose prose-lg max-w-none break-words"
                        dangerouslySetInnerHTML={{ __html: article.content }}
                    />

                </div>

                {/* RELATED ARTICLES */}

                {relatedArticles && relatedArticles.length > 0 && (
                    <div className="mb-12">
                        <h3 className="text-2xl font-serif mb-6">Related Articles</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {relatedArticles.map(related => (
                                <div key={related.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition cursor-pointer">
                                    <a href={route('articles.show', related.id)}>
                                        <h4 className="font-semibold line-clamp-2 mb-2">{related.title}</h4>
                                        <p className="text-sm text-gray-600 mb-2">{related.writer?.name}</p>
                                        <div className="inline-block text-xs font-medium px-2 py-1 rounded" style={{
                                            backgroundColor: related.category?.color || '#3B82F6',
                                            color: 'white',
                                        }}>
                                            {related.category?.name}
                                        </div>
                                    </a>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* COMMENTS SECTION */}

                <div className="bg-white border border-gray-200 rounded-xl p-8">

                    <h3 className="text-2xl font-serif mb-6">
                        Student Comments ({article.comments?.length || 0})
                    </h3>

                    {/* EXISTING COMMENTS */}

                    {article.comments?.length > 0 ? (

                        <div className="space-y-6 mb-10">

                            {article.comments.filter(c => c.status === 'approved').map(comment => (

                                <div key={comment.id} className="border-b pb-4">

                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-sm font-semibold text-gray-900 mb-1">
                                                {comment.student?.name}
                                                {comment.is_pinned && <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">📌 Pinned</span>}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {new Date(comment.created_at).toLocaleDateString()}
                                            </p>
                                        </div>

                                        {(isWriter || isEditor) && (
                                            <button
                                                onClick={() => setReplyTo(comment.student?.name)}
                                                className="text-xs bg-blue-100 text-blue-600 hover:bg-blue-200 px-2 py-1 rounded"
                                            >
                                                ↩️ Reply
                                            </button>
                                        )}
                                    </div>

                                    <p className="text-gray-800 mt-2">
                                        {comment.content}
                                    </p>

                                </div>

                            ))}

                        </div>

                    ) : (

                        <p className="text-gray-500 mb-8">
                            No comments yet. Be the first to comment!
                        </p>

                    )}

                    {/* COMMENT FORM (STUDENTS ONLY) */}

                    {user && (

                        <form onSubmit={submitComment} className="border-t pt-6">

                            {replyTo && (
                                <div className="flex items-center justify-between mb-4 p-3 bg-blue-50 border border-blue-100 rounded">
                                    <span className="text-sm text-blue-700">Replying to @{replyTo}</span>
                                    <button
                                        type="button"
                                        onClick={() => setReplyTo(null)}
                                        className="text-xs text-blue-600 hover:underline"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            )}

                            <textarea
                                className="w-full border border-gray-300 rounded-lg p-4 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                rows="4"
                                placeholder="Write a thoughtful comment..."
                                value={data.content}
                                onChange={(e) => setData("content", e.target.value)}
                                required
                            />

                            <button
                                type="submit"
                                className="bg-[#0F172A] text-white px-6 py-3 rounded-md hover:bg-[#1E293B] font-medium"
                            >
                                Post Comment
                            </button>

                        </form>

                    )}

                </div>

            </div>

        </AuthenticatedLayout>

    )

}
