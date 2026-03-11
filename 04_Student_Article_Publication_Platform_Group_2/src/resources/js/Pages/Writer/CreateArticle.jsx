import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head, useForm } from '@inertiajs/react'
import JoditEditor from "jodit-react"
import { useRef } from "react"

export default function CreateArticle({ categories = [] }) {

    const editor = useRef(null)

    const { data, setData, post, processing } = useForm({
        title: "",
        content: "",
        category_id: "",
        submit: false
    })

    const submit = (e) => {
        e.preventDefault()

        // Ensure we send draft status; state updates are async so post in next tick.
        setData('submit', false)
        setTimeout(() => {
            post(route("writer.articles.store"), { preserveScroll: true })
        }, 0)
    }

    const submitForReview = (e) => {
        e.preventDefault()

        setData('submit', true)
        setTimeout(() => {
            post(route("writer.articles.store"), { preserveScroll: true })
        }, 0)
    }

    return (

        <AuthenticatedLayout
            header={<h2 className="text-3xl font-serif">Create Article</h2>}
        >

            <Head title="Create Article" />

            <div className="max-w-5xl mx-auto px-12 py-12">

                <form onSubmit={submit} className="space-y-6">

                    <input
                        type="text"
                        placeholder="Article Title"
                        className="w-full border rounded-lg px-4 py-3"
                        value={data.title}
                        onChange={(e) => setData("title", e.target.value)}
                    />

                    <select
                        className="w-full border rounded-lg px-4 py-3"
                        value={data.category_id}
                        onChange={(e) => setData("category_id", e.target.value)}
                    >

                        <option value="">Select Category</option>

                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}

                    </select>

                    <JoditEditor
                        ref={editor}
                        value={data.content}
                        onBlur={(newContent) => setData("content", newContent)}
                    />

                    <div className="flex gap-3">
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-[#0F172A] text-white px-8 py-3 rounded-md"
                        >
                            Save Article
                        </button>

                        <button
                            onClick={submitForReview}
                            disabled={processing}
                            className="bg-green-600 text-white px-6 py-3 rounded-md"
                        >
                            Submit for Review
                        </button>
                    </div>

                </form>

            </div>

        </AuthenticatedLayout>
    )
}
