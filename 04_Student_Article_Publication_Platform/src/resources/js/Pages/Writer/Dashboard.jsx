import WriterLayout from "../Shared/Layouts/WriterLayout";
import { Link } from '@inertiajs/react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import DraftList from './Components/DraftList';
import SubmittedList from './Components/SubmittedList';

export default function Dashboard({
    articles = [],
    personalAnalytics = {},
    upcomingDeadlines = [],
    relatedArticles = [],
    notifications = [],
}) {
    const [liveAnalytics, setLiveAnalytics] = useState(personalAnalytics ?? {});

    useEffect(() => {
        setLiveAnalytics(personalAnalytics ?? {});
    }, [personalAnalytics]);

    useEffect(() => {
        let cancelled = false;

        async function refresh() {
            try {
                const res = await axios.get(route('writer.dashboard.personalAnalytics'), {
                    headers: { Accept: 'application/json' },
                });
                if (cancelled) return;
                if (res?.data?.personalAnalytics) {
                    setLiveAnalytics(res.data.personalAnalytics);
                }
            } catch {
                // Ignore transient errors; keep last known values.
            }
        }

        // Poll for near-real-time updates.
        const id = setInterval(refresh, 5_000);
        refresh();

        return () => {
            cancelled = true;
            clearInterval(id);
        };
    }, []);

    return (
        <WriterLayout>
            <div className="mx-auto max-w-6xl px-4 py-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h2 className="text-2xl font-semibold tracking-tight">Writer Dashboard</h2>
                        <p className="text-sm text-gray-600">
                            Drafts, submissions, deadlines, and your writing stats.
                        </p>
                    </div>
                    <Link
                        href={route('writer.articles.create')}
                        className="inline-flex items-center rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium"
                    >
                        New Article
                    </Link>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <div className="space-y-6 lg:col-span-2">
                        <section className="rounded-md border border-gray-200 bg-white p-4">
                            <DraftList articles={articles} />
                        </section>

                        <section className="rounded-md border border-gray-200 bg-white p-4">
                            <SubmittedList articles={articles} />
                        </section>

                        <section className="rounded-md border border-gray-200 bg-white p-4">
                            <h3 className="text-lg font-semibold">Submission Deadlines</h3>
                            {upcomingDeadlines.length === 0 ? (
                                <p className="mt-2 text-sm text-gray-600">No upcoming deadlines.</p>
                            ) : (
                                <ul className="mt-2 space-y-1 text-sm text-gray-700">
                                    {upcomingDeadlines.map((d) => (
                                        <li key={d.id} className="leading-6">
                                            <span className="font-semibold">{d.title}</span>
                                            <span>
                                                {' — '}
                                                {d.category?.name ? (
                                                    <>
                                                        Category: {d.category.name} —{' '}
                                                    </>
                                                ) : null}
                                                Due: {d.due_at ? new Date(d.due_at).toLocaleString() : 'N/A'}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </section>

                        <section className="rounded-md border border-gray-200 bg-white p-4">
                            <h3 className="text-lg font-semibold">Personal Analytics</h3>
                            <ul className="mt-2 space-y-1 text-sm text-gray-700">
                                <li>Submitted: {liveAnalytics.submittedCount ?? 0}</li>
                                <li>Published: {liveAnalytics.publishedCount ?? 0}</li>
                                <li>
                                    Acceptance Rate:{' '}
                                    {liveAnalytics.acceptanceRate == null
                                        ? 'N/A'
                                        : liveAnalytics.acceptanceRate + '%'}
                                </li>
                                <li>
                                    Avg Editor Feedback Time:{' '}
                                    {liveAnalytics.avgEditorFeedbackHours == null
                                        ? 'N/A'
                                        : liveAnalytics.avgEditorFeedbackHours + ' hours'}
                                </li>
                            </ul>
                        </section>

                        <section className="rounded-md border border-gray-200 bg-white p-4">
                            <h3 className="text-lg font-semibold">Reminders (In-App)</h3>
                            {notifications.length === 0 ? (
                                <p className="mt-2 text-sm text-gray-600">No notifications yet.</p>
                            ) : (
                                <ul className="mt-2 space-y-1 text-sm text-gray-700">
                                    {notifications.map((n) => (
                                        <li key={n.id} className="leading-6">
                                            {n.data?.message ?? n.type}
                                            {n.data?.title ? ' — ' + n.data.title : ''}
                                            {n.created_at ? ' (' + new Date(n.created_at).toLocaleString() + ')' : ''}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </section>
                    </div>

                    <aside className="space-y-6">
                        <section className="rounded-md border border-gray-200 bg-white p-4">
                            <h3 className="text-lg font-semibold">Related Articles</h3>
                            {relatedArticles.length === 0 ? (
                                <p className="mt-2 text-sm text-gray-600">No related articles to show.</p>
                            ) : (
                                <ul className="mt-2 space-y-1 text-sm text-gray-700">
                                    {relatedArticles.map((a) => (
                                        <li key={a.id} className="leading-6">
                                            {a.title}
                                            {a.author?.name ? ' — ' + a.author.name : ''}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </section>
                    </aside>
                </div>
            </div>
        </WriterLayout>
    );
}
