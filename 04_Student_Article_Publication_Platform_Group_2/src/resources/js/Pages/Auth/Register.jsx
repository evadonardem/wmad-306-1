import { Head, Link, useForm } from '@inertiajs/react'
import { useEffect, useState } from 'react'

export default function Register() {
    const { data, setData, post, processing } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'student',
    })

    const [visible, setVisible] = useState(false)

    useEffect(() => {
        setVisible(true)
    }, [])

    const submit = (e) => {
        e.preventDefault()
        post(route('register'))
    }

    return (
        <div className="min-h-screen bg-[#F8F6F1] flex items-center justify-center px-6">
            <Head title="Register" />

            <div className={`w-full max-w-md bg-white rounded-2xl shadow-md border border-gray-200 p-10 transition duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>

                <h2 className="text-3xl font-serif text-center mb-8">
                    Create Account
                </h2>

                <form onSubmit={submit} className="space-y-6">

                    <input
                        type="text"
                        placeholder="Full Name"
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:border-[#0F172A] transition duration-200"
                        onChange={(e) => setData('name', e.target.value)}
                        required
                    />

                    <input
                        type="email"
                        placeholder="Email Address"
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:border-[#0F172A] transition duration-200"
                        onChange={(e) => setData('email', e.target.value)}
                        required
                    />

                    <div className="w-full">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Role
                        </label>
                        <select
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:border-[#0F172A] transition duration-200"
                            value={data.role}
                            onChange={(e) => setData('role', e.target.value)}
                        >
                            <option value="student">Student</option>
                            <option value="writer">Writer</option>
                            <option value="editor">Editor</option>
                        </select>
                    </div>

                    <input
                        type="password"
                        placeholder="Password"
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:border-[#0F172A] transition duration-200"
                        onChange={(e) => setData('password', e.target.value)}
                        required
                    />

                    <input
                        type="password"
                        placeholder="Confirm Password"
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:border-[#0F172A] transition duration-200"
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        required
                    />

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full bg-[#0F172A] text-white py-3 rounded-lg hover:bg-[#1E293B] transition duration-300"
                    >
                        {processing ? 'Creating account...' : 'Create Account'}
                    </button>

                    <div className="text-center">
                        <Link href="/login" className="text-[#C6A75E] hover:underline">
                            Already have an account?
                        </Link>
                    </div>

                </form>
            </div>
        </div>
    )
}
