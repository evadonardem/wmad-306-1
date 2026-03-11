import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head, router } from '@inertiajs/react'
import { useState } from 'react'

export default function Review({ article }) {

    const [comments, setComments] = useState("")
    const [rejectReason, setRejectReason] = useState("")
    const [showRejectForm, setShowRejectForm] = useState(null)

    const requestRevision = () => {
        router.post(route('editor.articles.requestRevision', article.id), {
            comments
        })
    }

    const publish = () => {
        router.post(route('editor.articles.publish', article.id))
    }

    const handleFlagComment = (commentId) => {
        router.post(route('editor.comments.flag', commentId))
    }

    const handleApproveComment = (commentId) => {
        router.post(route('editor.comments.approve', commentId))
    }

    const handleRejectComment = (commentId) => {
        router.post(route('editor.comments.reject', commentId), {
            reason: rejectReason
        }, {
            onSuccess: () => {
                setShowRejectForm(null)
                setRejectReason("")
            }
        })
    }

    const handlePinComment = (commentId) => {
        router.post(route('editor.comments.pin', commentId))
    }

    const approvedComments = article.comments?.filter(c => c.status === 'approved') || []
    const flaggedComments = article.comments?.filter(c => c.status === 'flagged') || []

    return (

        <AuthenticatedLayout
            header={<h2 className="text-4xl font-serif">Editor Review</h2>}
        >

            <Head title="Review Article" />

            <div className="max-w-7xl mx-auto px-12 pb-20">

                <div className="grid grid-cols-3 gap-10">

                    {/* ARTICLE SECTION */}

                    <div className="col-span-2">

                        {/* ARTICLE HEADER */}

                        <div className="mb-8">

                            <h1 className="text-3xl font-serif mb-2">
                                {article.title}
                            </h1>

                            <p className="text-gray-500 text-sm">
                                {article.writer?.name} • {article.category?.name}
                            </p>

                        </div>

                        {/* ARTICLE CARD */}

                        <div className="bg-white border border-gray-200 rounded-xl p-10 overflow-hidden mb-10">

                            <div
                                className="prose prose-lg max-w-none break-words"
                                dangerouslySetInnerHTML={{ __html: article.content }}
                            />

                        </div>

                        {/* COMMENTS MODERATION */}

                        <div className="bg-white border border-gray-200 rounded-xl p-6">

                            <h3 className="text-xl font-semibold mb-6">
                                Comment Moderation ({article.comments?.length || 0})
                            </h3>

                            {approvedComments.length > 0 && (
                                <div className="mb-8">
                                    <h4 className="font-semibold text-sm text-gray-700 mb-3">Approved Comments</h4>
                                    <div className="space-y-3">
                                        {approvedComments.map(comment => (
                                            <div key={comment.id} className="border rounded-lg p-4 bg-green-50">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <p className="font-semibold text-sm">{comment.student?.name}</p>
                                                        <p className="text-xs text-gray-500">{new Date(comment.created_at).toLocaleDateString()}</p>
                                                    </div>
                                                    {comment.is_pinned && <span className="text-sm font-medium bg-yellow-100 text-yellow-800 px-2 py-1 rounded">📌 Pinned</span>}
                                                </div>
                                                <p className="text-gray-800 mb-3">{comment.content}</p>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleFlagComment(comment.id)}
                                                        className="text-xs bg-red-100 text-red-600 hover:bg-red-200 px-2 py-1 rounded"
                                                    >
                                                        🚩 Flag
                                                    </button>
                                                    <button
                                                        onClick={() => handlePinComment(comment.id)}
                                                        className="text-xs bg-yellow-100 text-yellow-600 hover:bg-yellow-200 px-2 py-1 rounded"
                                                    >
                                                        {comment.is_pinned ? '📌 Unpin' : '📌 Pin'}
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {flaggedComments.length > 0 && (
                                <div>
                                    <h4 className="font-semibold text-sm text-gray-700 mb-3">Flagged Comments (Review)</h4>
                                    <div className="space-y-3">
                                        {flaggedComments.map(comment => (
                                            <div key={comment.id} className="border rounded-lg p-4 bg-yellow-50">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <p className="font-semibold text-sm">{comment.student?.name}</p>
                                                        <p className="text-xs text-gray-500">{new Date(comment.created_at).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                                <p className="text-gray-800 mb-3">{comment.content}</p>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleApproveComment(comment.id)}
                                                        className="text-xs bg-green-100 text-green-600 hover:bg-green-200 px-2 py-1 rounded"
                                                    >
                                                        ✓ Approve
                                                    </button>
                                                    <button
                                                        onClick={() => setShowRejectForm(comment.id)}
                                                        className="text-xs bg-red-100 text-red-600 hover:bg-red-200 px-2 py-1 rounded"
                                                    >
                                                        ✕ Reject
                                                    </button>
                                                </div>

                                                {showRejectForm === comment.id && (
                                                    <div className="mt-3 p-3 bg-white border border-red-200 rounded">
                                                        <textarea
                                                            value={rejectReason}
                                                            onChange={(e) => setRejectReason(e.target.value)}
                                                            placeholder="Reason for rejection..."
                                                            className="w-full border rounded p-2 text-sm mb-2"
                                                            rows="2"
                                                        />
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => handleRejectComment(comment.id)}
                                                                className="text-xs bg-red-600 text-white hover:bg-red-700 px-3 py-1 rounded"
                                                            >
                                                                Confirm Reject
                                                            </button>
                                                            <button
                                                                onClick={() => {
                                                                    setShowRejectForm(null)
                                                                    setRejectReason("")
                                                                }}
                                                                className="text-xs bg-gray-300 text-gray-700 hover:bg-gray-400 px-3 py-1 rounded"
                                                            >
                                                                Cancel
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {approvedComments.length === 0 && flaggedComments.length === 0 && (
                                <p className="text-gray-500 text-sm">No comments yet</p>
                            )}

                        </div>

                    </div>


                    {/* EDITOR PANEL */}

                    <div className="bg-white border border-gray-200 rounded-xl p-6 h-fit sticky top-10">

                        <h3 className="text-lg font-semibold mb-4">
                            Editorial Actions
                        </h3>

                        <textarea
                            value={comments}
                            onChange={(e)=>setComments(e.target.value)}
                            placeholder="Explain what needs revision..."
                            className="w-full border border-gray-300 rounded-md p-3 mb-6"
                            rows="6"
                        />

                        <div className="flex flex-col gap-3">

                            <button
                                onClick={requestRevision}
                                className="bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-md transition"
                            >
                                Request Revision
                            </button>

                            <button
                                onClick={publish}
                                className="bg-green-600 hover:bg-green-700 text-white py-3 rounded-md transition"
                            >
                                Publish Article
                            </button>

                        </div>

                    </div>

                </div>

            </div>

        </AuthenticatedLayout>

    )
}
