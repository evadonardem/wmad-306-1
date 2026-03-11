import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head, router } from '@inertiajs/react'
import { useState, useRef } from 'react'
import JoditEditor from 'jodit-react'

export default function Edit({ article }) {

    const editor = useRef(null)
    const [content, setContent] = useState(article.content)

    const getEditorContent = () => {
        return editor.current?.value || content
    }

    const save = () => {
        const latest = getEditorContent()
        setContent(latest)

        router.post(route('writer.articles.revise', article.id), {
            content: latest
        }, { preserveScroll: true })
    }

    const submitForReview = () => {
        const latest = getEditorContent()
        setContent(latest)

        // Ensure the latest editor value is persisted before submitting.
        router.post(route('writer.articles.revise', article.id), {
            content: latest
        }, {
            preserveScroll: true,
            onSuccess: () => {
                router.post(route('writer.articles.submit', article.id), {}, { preserveScroll: true })
            }
        })
    }

    const latestRevision = article.revisions && article.revisions.length ? article.revisions[0] : null

    return (

        <AuthenticatedLayout
            header={<h2 className="text-4xl font-serif">Edit Article</h2>}
        >

            <Head title="Edit Article" />

            <div className="max-w-4xl mx-auto px-12 pb-20">

                <div className="mb-8">

                    <h3 className="text-2xl font-serif mb-2">
                        {article.title}
                    </h3>

                    <p className="text-gray-600">
                        Revise your article before submitting again.
                    </p>

                    {latestRevision && (
                        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
                            <p className="text-sm font-semibold mb-2">Editor requested revisions:</p>
                            <p className="text-sm text-gray-700 whitespace-pre-line">{latestRevision.comments}</p>
                            <p className="text-xs text-gray-500 mt-2">by {latestRevision.editor?.name || 'Editor'} on {new Date(latestRevision.created_at).toLocaleString()}</p>
                        </div>
                    )}

                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-8">

                    <JoditEditor
                        ref={editor}
                        value={content}
                        onBlur={(newContent)=>setContent(newContent)}
                        onChange={(newContent)=>setContent(newContent)}
                    />

                    <div className="mt-6 flex gap-4">

                        <button
                            onClick={save}
                            className="bg-[#0F172A] text-white px-6 py-3 rounded-md hover:bg-[#1E293B] transition"
                        >
                            Save Changes
                        </button>

                        <button
                            onClick={() => {
                                if (confirm('Submit this article for review?')) {
                                    router.post(route('writer.articles.submit', article.id), {}, { preserveScroll: true })
                                }
                            }}
                            className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition"
                        >
                            Submit for Review
                        </button>

                        <button
                            onClick={() => history.back()}
                            className="border border-gray-300 px-6 py-3 rounded-md hover:bg-gray-100 transition"
                        >
                            Cancel
                        </button>

                    </div>

                </div>

            </div>

        </AuthenticatedLayout>

    )
}
