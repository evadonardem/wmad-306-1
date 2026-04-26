import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function ApprovalPending() {
    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-slate-100">Writer Approval Pending</h2>}
        >
            <Head title="Approval Pending" />
            <div className="min-h-screen bg-transparent py-10">
                <div className="mx-auto max-w-3xl overflow-hidden rounded-2xl border border-amber-400/40 bg-slate-900/70 shadow-2xl shadow-slate-950/40 sm:px-0">
                    <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-5 text-white">
                        <p className="text-xs uppercase tracking-[0.2em] text-white/80">Writer Onboarding</p>
                        <h3 className="mt-1 text-xl font-black">Your account is waiting for admin approval</h3>
                    </div>
                    <div className="space-y-3 px-6 py-6 text-slate-300 sm:px-8">
                        <p>You can sign in and explore the platform while approval is pending.</p>
                        <p>Publishing new articles will be enabled automatically after an admin approves your writer role.</p>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
