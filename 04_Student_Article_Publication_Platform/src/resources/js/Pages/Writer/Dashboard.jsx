import WriterLayout from '@/Layouts/WriterLayout';
import { Link } from '@inertiajs/react';
import axios from 'axios';
import { useEffect, useMemo, useState } from 'react';
import DraftList from './Components/DraftList';
import SubmittedList from './Components/SubmittedList';
import { useTheme } from '@/Contexts/ThemeContext';

export default function Dashboard({
    articles = [],
    personalAnalytics = {},
    upcomingDeadlines = [],
    relatedArticles = [],
    notifications = [],
}) {
    const { colors } = useTheme();
    const [liveAnalytics, setLiveAnalytics] = useState(personalAnalytics ?? {});

    const draftCount = useMemo(() => {
        return articles.filter((article) => {
            const slug = article?.status?.slug ?? null;
            if (slug) return slug === 'draft';
            return !article.submitted_at && !article.published_at;
        }).length;
    }, [articles]);

    const acceptanceRateLabel = useMemo(() => {
        if (liveAnalytics.acceptanceRate == null) return 'N/A';
        return `${liveAnalytics.acceptanceRate}%`;
    }, [liveAnalytics.acceptanceRate]);

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
            <div className="w-full px-2 py-4 sm:px-3 lg:px-4">
                <header
                    className="relative overflow-hidden rounded-xl border p-5"
                    style={{ backgroundColor: colors.surface, borderColor: colors.border }}
                >
                    <div
                        className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full blur-3xl"
                        style={{ backgroundColor: colors.accent + '26' }}
                    />
                    <div
                        className="pointer-events-none absolute -left-12 -bottom-14 h-48 w-48 rounded-full blur-3xl"
                        style={{ backgroundColor: colors.primary + '1A' }}
                    />

                    <div className="relative flex flex-wrap items-start justify-between gap-4">
                        <div>
                            <h2 className="text-2xl font-semibold tracking-tight" style={{ color: colors.text }}>
                                Writer Dashboard
                            </h2>
                            <p className="mt-1 text-sm" style={{ color: colors.textSecondary }}>
                                Drafts, submissions, deadlines, and your writing stats.
                            </p>
                        </div>
                        <Link
                            href={route('writer.articles.create')}
                            className="inline-flex items-center rounded-md border px-4 py-2 text-sm font-semibold transition-opacity hover:opacity-90"
                            style={{
                                borderColor: colors.primary,
                                backgroundColor: colors.primary,
                                color: colors.background,
                            }}
                        >
                            New Article
                        </Link>
                    </div>

                    <div className="relative mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
                        <div
                            className="rounded-lg border p-3"
                            style={{ backgroundColor: colors.primary + '12', borderColor: colors.border }}
                        >
                            <div className="flex items-center gap-2">
                                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: colors.primary }} />
                                <span className="text-xs font-medium" style={{ color: colors.textSecondary }}>
                                    Drafts
                                </span>
                            </div>
                            <div className="mt-1 text-xl font-semibold" style={{ color: colors.text }}>
                                {draftCount}
                            </div>
                        </div>

                        <div
                            className="rounded-lg border p-3"
                            style={{ backgroundColor: colors.accent + '12', borderColor: colors.border }}
                        >
                            <div className="flex items-center gap-2">
                                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: colors.accent }} />
                                <span className="text-xs font-medium" style={{ color: colors.textSecondary }}>
                                    Submitted
                                </span>
                            </div>
                            <div className="mt-1 text-xl font-semibold" style={{ color: colors.text }}>
                                {liveAnalytics.submittedCount ?? 0}
                            </div>
                        </div>

                        <div
                            className="rounded-lg border p-3"
                            style={{ backgroundColor: colors.secondary + '12', borderColor: colors.border }}
                        >
                            <div className="flex items-center gap-2">
                                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: colors.secondary }} />
                                <span className="text-xs font-medium" style={{ color: colors.textSecondary }}>
                                    Published
                                </span>
                            </div>
                            <div className="mt-1 text-xl font-semibold" style={{ color: colors.text }}>
                                {liveAnalytics.publishedCount ?? 0}
                            </div>
                        </div>

                        <div
                            className="rounded-lg border p-3"
                            style={{ backgroundColor: colors.info + '12', borderColor: colors.border }}
                        >
                            <div className="flex items-center gap-2">
                                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: colors.info }} />
                                <span className="text-xs font-medium" style={{ color: colors.textSecondary }}>
                                    Acceptance
                                </span>
                            </div>
                            <div className="mt-1 text-xl font-semibold" style={{ color: colors.text }}>
                                {acceptanceRateLabel}
                            </div>
                        </div>
                    </div>
                </header>

                <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
                    <div className="space-y-6 lg:col-span-8 xl:col-span-9">
                        <section
                            className="rounded-xl border p-4"
                            style={{
                                backgroundColor: colors.surface,
                                borderColor: colors.border,
                                borderTopWidth: 3,
                                borderTopColor: colors.primary,
                            }}
                        >
                            <DraftList articles={articles} />
                        </section>

                        <section
                            className="rounded-xl border p-4"
                            style={{
                                backgroundColor: colors.surface,
                                borderColor: colors.border,
                                borderTopWidth: 3,
                                borderTopColor: colors.accent,
                            }}
                        >
                            <SubmittedList articles={articles} />
                        </section>

                        <section
                            className="rounded-xl border p-4"
                            style={{
                                backgroundColor: colors.surface,
                                borderColor: colors.border,
                                borderTopWidth: 3,
                                borderTopColor: colors.secondary,
                            }}
                        >
                            <h3 className="text-lg font-semibold" style={{ color: colors.text }}>
                                Submission Deadlines
                            </h3>
                            {upcomingDeadlines.length === 0 ? (
                                <p className="mt-2 text-sm" style={{ color: colors.textSecondary }}>
                                    No upcoming deadlines.
                                </p>
                            ) : (
                                <ul className="mt-2 space-y-1 text-sm" style={{ color: colors.text }}>
                                    {upcomingDeadlines.map((d) => (
                                        <li key={d.id} className="leading-6">
                                            <span className="font-semibold">{d.title}</span>
                                            <span>
                                                {' — '}
                                                {d.category?.name ? (
                                                    <>Category: {d.category.name} — </>
                                                ) : null}
                                                Due: {d.due_at
                                                    ? new Date(d.due_at).toLocaleString()
                                                    : 'N/A'}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </section>

                        <section
                            className="rounded-xl border p-4"
                            style={{
                                backgroundColor: colors.surface,
                                borderColor: colors.border,
                                borderTopWidth: 3,
                                borderTopColor: colors.info,
                            }}
                        >
                            <h3 className="text-lg font-semibold" style={{ color: colors.text }}>
                                Personal Analytics
                            </h3>
                            <ul className="mt-2 space-y-1 text-sm" style={{ color: colors.text }}>
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

                        <section
                            className="rounded-xl border p-4"
                            style={{
                                backgroundColor: colors.surface,
                                borderColor: colors.border,
                                borderTopWidth: 3,
                                borderTopColor: colors.warning,
                            }}
                        >
                            <h3 className="text-lg font-semibold" style={{ color: colors.text }}>
                                Reminders (In-App)
                            </h3>
                            {notifications.length === 0 ? (
                                <p className="mt-2 text-sm" style={{ color: colors.textSecondary }}>
                                    No notifications yet.
                                </p>
                            ) : (
                                <ul className="mt-2 space-y-1 text-sm" style={{ color: colors.text }}>
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

                    <aside className="space-y-6 lg:col-span-4 xl:col-span-3">
                        <section
                            className="rounded-xl border p-4"
                            style={{
                                backgroundColor: colors.surface,
                                borderColor: colors.border,
                                borderTopWidth: 3,
                                borderTopColor: colors.success,
                            }}
                        >
                            <h3 className="text-lg font-semibold" style={{ color: colors.text }}>
                                Related Articles
                            </h3>
                            {relatedArticles.length === 0 ? (
                                <p className="mt-2 text-sm" style={{ color: colors.textSecondary }}>
                                    No related articles to show.
                                </p>
                            ) : (
                                <ul className="mt-2 space-y-1 text-sm" style={{ color: colors.text }}>
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
