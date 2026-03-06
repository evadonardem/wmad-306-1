import axios from 'axios';
import { router } from '@inertiajs/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import JoditEditor from '@/Components/JoditEditor';


function htmlToText(html) {
    if (!html) return '';
    try {
        const normalized = String(html)
            .replace(/<\s*br\s*\/?\s*>/gi, '\n')
            .replace(/<\s*\/p\s*>/gi, '\n')
            .replace(/<\s*\/div\s*>/gi, '\n')
            .replace(/<\s*\/li\s*>/gi, '\n');
        const doc = new DOMParser().parseFromString(normalized, 'text/html');
        return (doc.body?.textContent ?? '')
            .replace(/\r\n/g, '\n')
            .replace(/[ \t]+\n/g, '\n')
            .replace(/\n{3,}/g, '\n\n')
            .trim();
    } catch {
        return String(html)
            .replace(/<\s*br\s*\/?\s*>/gi, '\n')
            .replace(/<\s*\/p\s*>/gi, '\n')
            .replace(/<\s*\/div\s*>/gi, '\n')
            .replace(/<\s*\/li\s*>/gi, '\n')
            .replace(/<[^>]+>/g, ' ')
            .replace(/\r\n/g, '\n')
            .replace(/[ \t]+\n/g, '\n')
            .replace(/\n{3,}/g, '\n\n')
            .trim();
    }
}

function countWords(text) {
    if (!text) return 0;
    const parts = text.trim().split(/\s+/).filter(Boolean);
    return parts.length;
}

function estimateReadTimeMinutes(words, wpm = 200) {
    if (!words) return 0;
    return Math.max(1, Math.round(words / wpm));
}

function countSyllablesInWord(word) {
    const w = word.toLowerCase().replace(/[^a-z]/g, '');
    if (!w) return 0;
    if (w.length <= 3) return 1;

    // Very lightweight heuristic: vowel groups, minus silent trailing 'e'.
    const withoutTrailingE = w.replace(/e$/i, '');
    const groups = withoutTrailingE.match(/[aeiouy]+/g);
    const count = groups ? groups.length : 1;
    return Math.max(1, count);
}

function fleschReadingEase(text) {
    if (!text) return null;

    const sentences = (text.match(/[^.!?]+[.!?]+/g) ?? []).length || 1;
    const wordsArr = text.split(/\s+/).filter(Boolean);
    const words = wordsArr.length;
    if (words === 0) return null;

    const syllables = wordsArr.reduce((sum, w) => sum + countSyllablesInWord(w), 0);
    const score = 206.835 - 1.015 * (words / sentences) - 84.6 * (syllables / words);
    return Math.round(score * 10) / 10;
}

function clampNumber(value, min, max) {
    if (value == null) return null;
    return Math.min(max, Math.max(min, value));
}

function extractTopKeywords(text, limit = 8) {
    const lower = (text || '').toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, ' ');
    const tokens = lower.split(/\s+/).filter(Boolean);
    const stop = new Set([
        'the', 'a', 'an', 'and', 'or', 'but', 'to', 'of', 'in', 'on', 'for', 'with', 'at', 'by', 'from',
        'is', 'are', 'was', 'were', 'be', 'been', 'being', 'it', 'this', 'that', 'these', 'those',
        'as', 'not', 'can', 'could', 'should', 'would', 'will', 'just', 'we', 'you', 'they', 'he', 'she',
        'i', 'my', 'your', 'our', 'their',

        // Common lorem/placeholder words (keeps demo text from polluting suggestions)
        'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit', 'sed', 'do', 'eiusmod',
        'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore', 'magna', 'aliqua', 'enim', 'ad', 'minim',
        'veniam', 'quis', 'nostrud', 'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea',
        'commodo', 'consequat', 'duis', 'aute', 'irure', 'reprehenderit', 'voluptate', 'velit', 'esse',
        'cillum', 'eu', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint', 'occaecat', 'cupidatat',
        'proident', 'sunt', 'culpa', 'qui', 'officia', 'deserunt', 'mollit', 'anim', 'id', 'est',
    ]);

    const counts = new Map();
    for (const t of tokens) {
        if (t.length < 3) continue;
        if (stop.has(t)) continue;
        counts.set(t, (counts.get(t) ?? 0) + 1);
    }

    return [...counts.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, limit)
        .map(([word, count]) => ({ word, count }));
}

function buildLineDiff(aText, bText, maxLines = 800) {
    const a = (aText || '').split(/\r?\n/).slice(0, maxLines);
    const b = (bText || '').split(/\r?\n/).slice(0, maxLines);

    // LCS-based diff (OK for draft sizes; capped by maxLines)
    const n = a.length;
    const m = b.length;
    const dp = Array.from({ length: n + 1 }, () => Array(m + 1).fill(0));

    for (let i = 1; i <= n; i++) {
        for (let j = 1; j <= m; j++) {
            dp[i][j] = a[i - 1] === b[j - 1] ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1]);
        }
    }

    const out = [];
    let i = n;
    let j = m;
    while (i > 0 || j > 0) {
        if (i > 0 && j > 0 && a[i - 1] === b[j - 1]) {
            out.push({ type: 'unchanged', line: a[i - 1] });
            i--;
            j--;
        } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
            out.push({ type: 'added', line: b[j - 1] });
            j--;
        } else {
            out.push({ type: 'removed', line: a[i - 1] });
            i--;
        }
    }

    return out.reverse();
}

function toComparableLines(text) {
    const t = (text || '').replace(/\s+/g, ' ').trim();
    if (!t) return '';
    // Break into sentence-like lines so "added/removed lines" is readable.
    return t.replace(/([.!?])\s+/g, '$1\n').trim();
}

export default function ArticleForm({ article, categories = [], initialDraftVersions = [] }) {
    const isEdit = Boolean(article?.id);

    const [title, setTitle] = useState(article?.title ?? '');
    const [categoryId, setCategoryId] = useState(article?.category_id ?? article?.category?.id ?? '');
    const [content, setContent] = useState(article?.content ?? '');

    const [dirty, setDirty] = useState(false);
    const [lastSavedAt, setLastSavedAt] = useState(null);
    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);

    const [versions, setVersions] = useState(
        [...(initialDraftVersions ?? [])].sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
    );
    const [selectedVersionIndex, setSelectedVersionIndex] = useState(
        (initialDraftVersions?.length ?? 0) > 0 ? (initialDraftVersions.length - 1) : 0
    );

    const [categorySuggestions, setCategorySuggestions] = useState([]);
    const [categorySuggesting, setCategorySuggesting] = useState(false);
    const [plagiarism, setPlagiarism] = useState(null);
    const [plagiarismRunning, setPlagiarismRunning] = useState(false);

    const createInFlightRef = useRef(false);
    const autosaveTimerRef = useRef(null);
    const snapshotTimerRef = useRef(null);
    const lastSnapshotKeyRef = useRef('');

    const plainText = useMemo(() => htmlToText(content), [content]);
    const wordCount = useMemo(() => countWords(plainText), [plainText]);
    const readTimeMinutes = useMemo(() => estimateReadTimeMinutes(wordCount), [wordCount]);
    const readability = useMemo(() => fleschReadingEase(plainText), [plainText]);
    const readabilityDisplay = useMemo(() => clampNumber(readability, 0, 100), [readability]);
    const topKeywords = useMemo(() => extractTopKeywords(plainText, 8), [plainText]);
    const primaryKeyword = topKeywords[0]?.word ?? null;

    const seoTips = useMemo(() => {
        const tips = [];
        const len = title.trim().length;
        if (len === 0) {
            tips.push('Add a title.');
            return tips;
        }
        if (len < 40) tips.push('Title is short; consider 50–60 characters.');
        if (len > 70) tips.push('Title is long; consider staying under ~60–70 characters.');
        if (/\b(all caps|100%|guaranteed)\b/i.test(title)) tips.push('Avoid spammy words or claims.');
        if (primaryKeyword && !title.toLowerCase().includes(primaryKeyword.toLowerCase())) {
            tips.push(`Consider including the primary keyword: "${primaryKeyword}".`);
        }
        return tips;
    }, [title, primaryKeyword]);

    const selectedVersion = useMemo(() => {
        if (!versions.length) return null;
        const idx = Math.min(Math.max(selectedVersionIndex, 0), versions.length - 1);
        return versions[idx];
    }, [versions, selectedVersionIndex]);

    const diffLines = useMemo(() => {
        if (!selectedVersion) return null;
        const from = toComparableLines(htmlToText(selectedVersion.content || ''));
        const to = toComparableLines(plainText);
        return buildLineDiff(from, to);
    }, [selectedVersion, plainText]);

    useEffect(() => {
        if (!isEdit) return;
        setDirty(true);
        setSaveError(null);
    }, [title, content, categoryId, isEdit]);

    async function runAutosave() {
        if (!isEdit) return;
        if (!title.trim() || !content.trim()) return;

        setSaving(true);
        setSaveError(null);

        try {
            const res = await axios.patch(
                route('writer.articles.update', article.id),
                { title, content, category_id: categoryId || null },
                { headers: { Accept: 'application/json' } }
            );
            setLastSavedAt(res.data?.savedAt ?? new Date().toISOString());
            setDirty(false);
            return true;
        } catch (e) {
            setSaveError(e?.response?.data?.message ?? 'Autosave failed');
            return false;
        } finally {
            setSaving(false);
        }
    }

    async function submitForReview() {
        if (!isEdit) return;
        if (saving || submitting) return;

        setSubmitError(null);
        setSubmitting(true);

        try {
            const confirmed = window.confirm('Submit this article for editorial review?');
            if (!confirmed) {
                setSubmitting(false);
                return;
            }

            // Ensure the latest content is persisted before submitting.
            if (dirty) {
                const ok = await runAutosave();
                if (!ok) {
                    setSubmitError('Please resolve save errors before submitting.');
                    setSubmitting(false);
                    return;
                }
            }

            await axios.post(
                route('writer.articles.submit', article.id),
                {},
                { headers: { Accept: 'application/json' } }
            );

            setSubmitting(false);
            setSubmitError(null);
            router.visit(route('writer.dashboard'));
        } catch (e) {
            const status = e?.response?.status;
            if (status === 403) {
                setSubmitError('You do not have permission to submit this article.');
            } else {
                setSubmitError(e?.response?.data?.message ?? 'Submit failed.');
            }
            setSubmitting(false);
        }
    }

    async function saveSnapshot() {
        if (!isEdit) return;
        if (!title.trim() || !content.trim()) return;

        const key = JSON.stringify({ title, content, categoryId });
        if (key === lastSnapshotKeyRef.current) return;
        lastSnapshotKeyRef.current = key;

        const res = await axios.post(
            route('writer.articles.draftVersions.store', article.id),
            { title, content },
            { headers: { Accept: 'application/json' } }
        );

        if (res.data?.version) {
            const next = [...versions, { ...res.data.version, content }].sort(
                (a, b) => new Date(a.created_at) - new Date(b.created_at)
            );
            setVersions(next);
            setSelectedVersionIndex(next.length - 1);
        }
    }

    useEffect(() => {
        if (!isEdit) return;
        if (!dirty) return;

        if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current);
        autosaveTimerRef.current = setTimeout(() => {
            runAutosave();
        }, 10_000);

        return () => {
            if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current);
        };
    }, [dirty, isEdit, title, content, categoryId]);

    useEffect(() => {
        if (!isEdit) return;
        if (!dirty) return;

        if (snapshotTimerRef.current) clearTimeout(snapshotTimerRef.current);
        snapshotTimerRef.current = setTimeout(() => {
            saveSnapshot().catch(() => {});
        }, 60_000);

        return () => {
            if (snapshotTimerRef.current) clearTimeout(snapshotTimerRef.current);
        };
    }, [dirty, isEdit, title, content, categoryId]);

    useEffect(() => {
        // Create-page helper: once the user has meaningful input, create a draft and redirect to edit.
        if (isEdit) return;
        if (createInFlightRef.current) return;

        const canCreate = title.trim().length >= 5 && plainText.length >= 30;
        if (!canCreate) return;

        const t = setTimeout(() => {
            createInFlightRef.current = true;
            router.post(
                route('writer.articles.store'),
                { title, content, category_id: categoryId || null },
                {
                    preserveScroll: true,
                    onFinish: () => {
                        createInFlightRef.current = false;
                    },
                }
            );
        }, 1500);

        return () => clearTimeout(t);
    }, [isEdit, title, plainText, content, categoryId]);

    async function suggestCategories() {
        setCategorySuggesting(true);
        try {
            const res = await axios.post(
                route('writer.analysis.categorySuggestions'),
                { title: title || null, content: content || null },
                { headers: { Accept: 'application/json' } }
            );
            setCategorySuggestions(res.data?.suggestions ?? []);
        } finally {
            setCategorySuggesting(false);
        }
    }

    async function runPlagiarismCheck() {
        setPlagiarismRunning(true);
        try {
            const res = await axios.post(
                route('writer.analysis.plagiarism'),
                { content, exclude_article_id: article?.id ?? null },
                { headers: { Accept: 'application/json' } }
            );
            setPlagiarism(res.data);
        } finally {
            setPlagiarismRunning(false);
        }
    }

    const plagiarismLabel = useMemo(() => {
        if (plagiarism?.label) return plagiarism.label;
        const score = plagiarism?.score ?? null;
        if (score == null) return null;
        // Back-end now returns percent (0-100). Keep fallback thresholds for older payloads.
        if (score >= 35) return 'High similarity';
        if (score >= 20) return 'Medium similarity';
        if (score > 0) return 'Low similarity';
        return 'No similarity detected';
    }, [plagiarism]);

    const submitDisabledReason = useMemo(() => {
        if (!isEdit) return 'Draft must be created first.';
        if (saving) return 'Currently saving.';
        if (submitting) return 'Currently submitting.';
        if (!title.trim()) return 'Add a title before submitting.';
        if (!plainText.trim()) return 'Add some content before submitting.';

        const statusSlug = article?.status?.slug ?? null;
        if (statusSlug === 'submitted') return 'This article is already submitted.';
        if (statusSlug === 'published') return 'This article is already published.';

        return null;
    }, [isEdit, saving, submitting, title, plainText, article?.status?.slug]);

    const submitDisabled = submitDisabledReason != null;

    return (
        <div className="mx-auto max-w-7xl px-4 py-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
                <form
                    className="space-y-4 lg:col-span-3"
                    onSubmit={(e) => e.preventDefault()}
                >
                    <div className="rounded-md border border-gray-200 bg-white p-4">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <label className="block">
                                <span className="text-sm font-medium text-gray-700">Title</span>
                                <input
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Article title"
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                                />
                            </label>

                            <label className="block">
                                <span className="text-sm font-medium text-gray-700">Category</span>
                                <select
                                    value={categoryId || ''}
                                    onChange={(e) => setCategoryId(e.target.value)}
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                                >
                                    <option value="">(none)</option>
                                    {categories.map((c) => (
                                        <option key={c.id} value={c.id}>
                                            {c.name}
                                        </option>
                                    ))}
                                </select>
                            </label>
                        </div>

                        <div className="mt-4">
                            <div className="text-sm font-medium text-gray-700">Save status</div>
                            <div className="mt-1 text-sm text-gray-700">
                                {isEdit ? (
                                    <span>
                                        {saving ? 'Saving…' : dirty ? 'Unsaved changes (autosaves in ~10s)' : 'Saved'}
                                        {lastSavedAt ? ` — Last saved: ${new Date(lastSavedAt).toLocaleTimeString()}` : ''}
                                        {saveError ? ` — Error: ${saveError}` : ''}
                                    </span>
                                ) : (
                                    <span>Draft will auto-create once you type enough.</span>
                                )}
                            </div>

                            {isEdit ? (
                                <div className="mt-3 flex flex-wrap gap-2">
                                    <button
                                        type="button"
                                        onClick={() => runAutosave()}
                                        disabled={saving}
                                        className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        Save now
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => saveSnapshot()}
                                        disabled={saving}
                                        className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        Save version snapshot
                                    </button>
                                    <button
                                        type="button"
                                        onClick={submitForReview}
                                        disabled={submitDisabled}
                                        title={submitDisabledReason ?? ''}
                                        className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {submitting ? 'Submitting…' : 'Submit'}
                                    </button>
                                </div>
                            ) : null}

                            {submitDisabledReason && !submitError ? (
                                <div className="mt-2 text-xs text-gray-600">Submit disabled: {submitDisabledReason}</div>
                            ) : null}

                            {submitError ? (
                                <div className="mt-2 text-sm text-red-700">{submitError}</div>
                            ) : null}
                        </div>
                    </div>

                    <div className="rounded-md border border-gray-200 bg-white p-4">
                        <div className="text-sm font-medium text-gray-700">Content</div>
                        <div className="mt-2">
                            <JoditEditor value={content} onChange={setContent} height="70vh" />
                        </div>
                    </div>

                    {isEdit ? (
                        <div className="rounded-md border border-gray-200 bg-white p-4">
                            <div className="flex items-baseline justify-between gap-3">
                                <h3 className="text-lg font-semibold">Version history</h3>
                                <div className="text-sm text-gray-600">{versions.length} snapshot(s)</div>
                            </div>

                            {versions.length === 0 ? (
                                <p className="mt-2 text-sm text-gray-600">No snapshots yet. Use “Save version snapshot”.</p>
                            ) : (
                                <>
                                    <div className="mt-3">
                                        <input
                                            type="range"
                                            min={0}
                                            max={Math.max(0, versions.length - 1)}
                                            value={Math.min(selectedVersionIndex, Math.max(0, versions.length - 1))}
                                            onChange={(e) => setSelectedVersionIndex(Number(e.target.value))}
                                            className="w-full"
                                        />
                                        <div className="mt-1 text-sm text-gray-700">
                                            Selected: {selectedVersion?.created_at ? new Date(selectedVersion.created_at).toLocaleString() : 'N/A'}
                                        </div>
                                        <div className="mt-2">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    if (!selectedVersion) return;
                                                    setTitle(selectedVersion.title || '');
                                                    setContent(selectedVersion.content || '');
                                                }}
                                                className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium"
                                            >
                                                Restore selected version
                                            </button>
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                        <h4 className="text-sm font-medium text-gray-700">Diff (selected → current)</h4>
                                        {!diffLines ? (
                                            <p className="mt-2 text-sm text-gray-600">No version selected.</p>
                                        ) : (
                                            <pre className="mt-2 max-h-80 overflow-auto rounded-md border border-gray-200 bg-gray-50 p-3 text-xs leading-5 text-gray-800 whitespace-pre-wrap">
                                                {diffLines.slice(0, 600).map((d, idx) => {
                                                    const prefix = d.type === 'added' ? '+ ' : d.type === 'removed' ? '- ' : '  ';
                                                    return (
                                                        <div key={idx}>
                                                            {prefix}
                                                            {d.line}
                                                        </div>
                                                    );
                                                })}
                                            </pre>
                                        )}
                                        {diffLines && diffLines.length > 600 ? (
                                            <p className="mt-2 text-sm text-gray-600">Diff truncated for readability.</p>
                                        ) : null}
                                    </div>
                                </>
                            )}
                        </div>
                    ) : null}
                </form>

                <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
                    <section className="rounded-md border border-gray-200 bg-white p-4">
                        <h3 className="text-lg font-semibold">Real-Time Writing Analytics</h3>
                        <ul className="mt-2 space-y-1 text-sm text-gray-700">
                            <li>Word count: {wordCount}</li>
                            <li>Read time: ~{readTimeMinutes} min</li>
                            <li>
                                Readability (Flesch): {readabilityDisplay == null ? 'N/A' : readabilityDisplay}
                                {readability != null && readabilityDisplay !== readability ? (
                                    <span className="text-xs text-gray-500"> (raw: {readability})</span>
                                ) : null}
                            </li>
                        </ul>
                    </section>

                    <section className="rounded-md border border-gray-200 bg-white p-4">
                        <h3 className="text-lg font-semibold">SEO Title Checker</h3>
                        {seoTips.length === 0 ? (
                            <p className="mt-2 text-sm text-gray-700">Looks OK.</p>
                        ) : (
                            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-700">
                                {seoTips.map((t) => (
                                    <li key={t}>{t}</li>
                                ))}
                            </ul>
                        )}
                    </section>

                    <section className="rounded-md border border-gray-200 bg-white p-4">
                        <h3 className="text-lg font-semibold">Top Keywords (Extra)</h3>
                        {topKeywords.length === 0 ? (
                            <p className="mt-2 text-sm text-gray-600">Not enough text yet.</p>
                        ) : (
                            <ul className="mt-2 space-y-1 text-sm text-gray-700">
                                {topKeywords.map((k) => (
                                    <li key={k.word}>
                                        {k.word} ({k.count})
                                    </li>
                                ))}
                            </ul>
                        )}
                    </section>

                    <section className="rounded-md border border-gray-200 bg-white p-4">
                        <h3 className="text-lg font-semibold">Smart Category Suggestions</h3>
                        <p className="mt-1 text-sm text-gray-600">Uses your title + content to rank categories.</p>
                        <div className="mt-2">
                            <button
                                type="button"
                                onClick={suggestCategories}
                                disabled={categorySuggesting || !plainText}
                                className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium"
                            >
                                {categorySuggesting ? 'Suggesting…' : 'Suggest categories'}
                            </button>
                        </div>

                        {categorySuggestions.length === 0 ? (
                            <p className="mt-2 text-sm text-gray-600">No suggestions yet.</p>
                        ) : (
                            <ul className="mt-2 space-y-1 text-sm text-gray-700">
                                {categorySuggestions.map((s) => (
                                    <li key={s.id} className="flex items-center justify-between gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setCategoryId(String(s.id))}
                                            className="text-left font-medium hover:underline"
                                        >
                                            {s.name}
                                        </button>
                                        <span className="text-xs text-gray-500">score {s.score}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </section>

                    <section className="rounded-md border border-gray-200 bg-white p-4">
                        <h3 className="text-lg font-semibold">Plagiarism Check</h3>
                        <p className="mt-1 text-sm text-gray-600">Compares against published articles in the DB.</p>
                        <div className="mt-2">
                            <button
                                type="button"
                                onClick={runPlagiarismCheck}
                                disabled={plagiarismRunning || !plainText}
                                className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium"
                            >
                                {plagiarismRunning ? 'Checking…' : 'Run check'}
                            </button>
                        </div>

                        {plagiarism ? (
                            <div className="mt-3 text-sm text-gray-700">
                                <div>
                                    <span className="font-medium">Indicator:</span> {plagiarismLabel}
                                    <span className="text-gray-600"> (score: {plagiarism.score}%)</span>
                                </div>
                                {typeof plagiarism.checkedAgainstCount === 'number' ? (
                                    <div className="mt-1 text-xs text-gray-500">
                                        Checked against {plagiarism.checkedAgainstCount} published article(s)
                                    </div>
                                ) : null}

                                {Array.isArray(plagiarism.matches) && plagiarism.matches.length > 0 ? (
                                    <div className="mt-2">
                                        <div className="text-sm font-medium text-gray-700">Top matches</div>
                                        <ul className="mt-2 space-y-2 text-sm text-gray-700">
                                            {plagiarism.matches.map((m) => (
                                                <li key={m.article_id} className="rounded-md border border-gray-200 p-2">
                                                    <div className="flex items-baseline justify-between gap-3">
                                                        <span className="truncate font-medium">{m.title}</span>
                                                        <span className="shrink-0 text-xs text-gray-500">{m.score}%</span>
                                                    </div>

                                                    {Array.isArray(m.overlapPhrases) && m.overlapPhrases.length > 0 ? (
                                                        <div className="mt-2">
                                                            <div className="text-[11px] font-semibold text-gray-600">Overlaps</div>
                                                            <div className="mt-1 flex flex-wrap gap-1">
                                                                {m.overlapPhrases.map((p) => (
                                                                    <span key={p} className="rounded border border-gray-200 bg-gray-50 px-2 py-0.5 text-[11px]">
                                                                        {p}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    ) : null}

                                                    {m.snippet ? (
                                                        <div className="mt-2">
                                                            <div className="text-[11px] font-semibold text-gray-600">Evidence</div>
                                                            <div className="mt-1 whitespace-pre-wrap rounded border border-gray-200 bg-gray-50 p-2 text-xs text-gray-800">
                                                                {m.snippet}
                                                            </div>
                                                        </div>
                                                    ) : null}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ) : (
                                    <p className="mt-2 text-sm text-gray-600">
                                        {plagiarism.checkedAgainstCount === 0
                                            ? 'No published articles to compare against.'
                                            : 'No overlaps found in the checked corpus.'}
                                    </p>
                                )}
                            </div>
                        ) : (
                            <p className="mt-2 text-sm text-gray-600">Not checked yet.</p>
                        )}
                    </section>
                </aside>
            </div>
        </div>
    );
}


