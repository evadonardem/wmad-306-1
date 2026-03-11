import { Head, Link, useForm } from '@inertiajs/react'
import { useEffect, useState } from 'react'

export default function Login({ status }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
    })

    const [visible, setVisible] = useState(false)

    useEffect(() => {
        setVisible(true)
    }, [])

    const submit = (e) => {
        e.preventDefault()
        post(route('login'), {
            onFinish: () => reset('password'),
        })
    }

    return (
        <div className="min-h-screen bg-[#F8F6F1] flex items-center justify-center px-6">
            <Head title="Log in" />

            <div className={`w-full max-w-md bg-white rounded-2xl shadow-md border border-gray-200 p-10 transition duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>

                <h2 className="text-3xl font-serif text-center mb-8">
                    Welcome Back
                </h2>

                <form onSubmit={submit} className="space-y-6">

                    <input
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:border-[#0F172A] transition duration-200"
                        placeholder="Email Address"
                        required
                    />

                    <input
                        type="password"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:border-[#0F172A] transition duration-200"
                        placeholder="Password"
                        required
                    />

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full bg-[#0F172A] text-white py-3 rounded-lg hover:bg-[#1E293B] transition duration-300"
                    >
                        {processing ? 'Signing in...' : 'Sign In'}
                    </button>

                    <div className="text-center">
                        <Link href="/register" className="text-[#C6A75E] hover:underline">
                            Create account
                        </Link>
                    </div>

                </form>
            </div>
        </div>
    )
}