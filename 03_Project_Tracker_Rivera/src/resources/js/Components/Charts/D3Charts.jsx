import * as d3 from 'd3';
import { useMemo, useState } from 'react';

const COLOR_CLASS = {
    low: 'text-green-500',
    medium: 'text-yellow-500',
    high: 'text-red-500',
    created: 'text-indigo-500',
    completed: 'text-emerald-500',
    line: 'text-indigo-500',
};

function svgPointFromClientEvent(e, viewBoxW, viewBoxH) {
    const svg = e.currentTarget.ownerSVGElement ?? e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * viewBoxW;
    const y = ((e.clientY - rect.top) / rect.height) * viewBoxH;
    return { x, y };
}

export function PieChart({ data, size = 260 }) {
    const radius = size / 2;
    const [hovered, setHovered] = useState(null);
    const [cursor, setCursor] = useState({ x: radius, y: radius });

    const arcs = useMemo(() => {
        const pie = d3
            .pie()
            .sort(null)
            .value((d) => d.value);

        return pie(data);
    }, [data]);

    const arcGen = useMemo(
        () => d3.arc().innerRadius(radius * 0.55).outerRadius(radius * 0.9),
        [radius],
    );

    const arcGenHover = useMemo(
        () => d3.arc().innerRadius(radius * 0.55).outerRadius(radius * 0.95),
        [radius],
    );

    const total = useMemo(
        () => data.reduce((sum, d) => sum + (d.value ?? 0), 0),
        [data],
    );

    const tooltip = hovered
        ? {
              key: hovered.key,
              value: hovered.value,
              pct: total > 0 ? Math.round((hovered.value / total) * 100) : 0,
          }
        : null;

    const tooltipPos = useMemo(() => {
        const x = Math.min(size - 206, Math.max(6, cursor.x + 12));
        const y = Math.min(size - 56, Math.max(6, cursor.y - 18));
        return { x, y };
    }, [cursor.x, cursor.y, size]);

    return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            <g transform={`translate(${radius}, ${radius})`}>
                {arcs.map((arc, i) => {
                    const key = arc.data.key;
                    const cls = COLOR_CLASS[key] ?? 'text-indigo-500';
                    const isHovered = hovered?.key === key;

                    const [cx, cy] = arcGen.centroid(arc);
                    const len = Math.hypot(cx, cy) || 1;
                    const popOut = 10;
                    const dx = (cx / len) * popOut;
                    const dy = (cy / len) * popOut;

                    return (
                        <path
                            key={`${key}-${i}`}
                            d={(isHovered ? arcGenHover : arcGen)(arc)}
                            fill="currentColor"
                            className={cls}
                            opacity={isHovered ? 1 : hovered ? 0.55 : 0.9}
                            stroke={isHovered ? 'currentColor' : 'transparent'}
                            strokeWidth={isHovered ? 2 : 0}
                            transform={isHovered ? `translate(${dx}, ${dy})` : undefined}
                            onMouseEnter={() => setHovered({ key, value: arc.data.value ?? 0 })}
                            onMouseMove={(e) => setCursor(svgPointFromClientEvent(e, size, size))}
                            onMouseLeave={() => setHovered(null)}
                            style={{ cursor: 'pointer', transition: 'transform 140ms ease, opacity 140ms ease' }}
                        />
                    );
                })}

                {tooltip ? (
                    <g
                        transform={`translate(${tooltipPos.x - radius}, ${tooltipPos.y - radius})`}
                        style={{ pointerEvents: 'none' }}
                    >
                        <rect
                            x={0}
                            y={0}
                            width={190}
                            height={44}
                            rx={10}
                            className="fill-white/90 stroke-gray-200 dark:fill-gray-950/90 dark:stroke-gray-700"
                        />
                        <text
                            x={95}
                            y={16}
                            textAnchor="middle"
                            className="fill-gray-900 dark:fill-gray-100"
                            style={{ fontSize: 11, fontWeight: 800 }}
                        >
                            {tooltip.key.toUpperCase()}
                        </text>
                        <text
                            x={95}
                            y={32}
                            textAnchor="middle"
                            className="fill-gray-600 dark:fill-gray-300"
                            style={{ fontSize: 11, fontWeight: 700 }}
                        >
                            {tooltip.value} ({tooltip.pct}%)
                        </text>
                    </g>
                ) : null}

                <text
                    textAnchor="middle"
                    dominantBaseline="central"
                    className="fill-gray-900 dark:fill-gray-100"
                    style={{ fontWeight: 800, fontSize: 22 }}
                >
                    {total}
                </text>
                <text
                    textAnchor="middle"
                    y={22}
                    className="fill-gray-600 dark:fill-gray-300"
                    style={{ fontSize: 12 }}
                >
                    tasks
                </text>
            </g>
        </svg>
    );
}

export function BarChart({ data, width = 560, height = 220, padding = 30, xLabel = null, yLabel = null }) {
    const [hovered, setHovered] = useState(null);
    const [cursor, setCursor] = useState({ x: width / 2, y: padding });

    const padLeft = yLabel ? Math.max(padding, 44) : padding;
    const padBottom = xLabel ? Math.max(padding, 48) : padding;

    const maxValue = useMemo(
        () =>
            Math.max(
                1,
                ...data.flatMap((d) => [d.created ?? 0, d.completed ?? 0]),
            ),
        [data],
    );

    const x = useMemo(
        () =>
            d3
                .scaleBand()
                .domain(data.map((d) => d.label))
                .range([padLeft, width - padding])
                .paddingInner(0.35)
                .paddingOuter(0.2),
        [data, padLeft, padding, width],
    );

    const y = useMemo(
        () => d3.scaleLinear().domain([0, maxValue]).range([height - padBottom, padding]),
        [height, maxValue, padBottom, padding],
    );

    const barW = x.bandwidth();
    const half = barW / 2;

    const yTicks = useMemo(() => {
        const ticks = [0, maxValue];
        // Ensure uniqueness and stable ordering
        return Array.from(new Set(ticks)).sort((a, b) => a - b);
    }, [maxValue]);

    return (
        <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`}>
            {/* Axis lines */}
            <line
                x1={padLeft}
                x2={padLeft}
                y1={padding}
                y2={height - padBottom}
                stroke="currentColor"
                className="text-gray-200 dark:text-gray-700"
            />
            {data.map((d) => {
                const x0 = x(d.label) ?? 0;
                const createdH = height - padBottom - y(d.created ?? 0);
                const completedH = height - padBottom - y(d.completed ?? 0);
                const isHoveredLabel = hovered?.label === d.label;
                const hoverLift = 7;
                return (
                    <g
                        key={d.label}
                        onMouseMove={(e) => setCursor(svgPointFromClientEvent(e, width, height))}
                    >
                        <rect
                            x={x0}
                            y={y(d.created ?? 0) - (hovered?.label === d.label && hovered?.series === 'created' ? hoverLift : 0)}
                            width={half - 2}
                            height={createdH + (hovered?.label === d.label && hovered?.series === 'created' ? hoverLift : 0)}
                            rx="6"
                            fill="currentColor"
                            className={COLOR_CLASS.created}
                            opacity={hovered ? (isHoveredLabel ? (hovered?.series === 'created' ? 0.98 : 0.6) : 0.35) : 0.85}
                            stroke={hovered?.label === d.label && hovered?.series === 'created' ? 'currentColor' : 'transparent'}
                            strokeWidth={hovered?.label === d.label && hovered?.series === 'created' ? 2 : 0}
                            onMouseEnter={() =>
                                setHovered({
                                    label: d.label,
                                    series: 'created',
                                    created: d.created ?? 0,
                                    completed: d.completed ?? 0,
                                })
                            }
                            onMouseLeave={() => setHovered(null)}
                            style={{ cursor: 'pointer', transition: 'opacity 140ms ease' }}
                        />
                        <rect
                            x={x0 + half + 2}
                            y={y(d.completed ?? 0) - (hovered?.label === d.label && hovered?.series === 'completed' ? hoverLift : 0)}
                            width={half - 2}
                            height={completedH + (hovered?.label === d.label && hovered?.series === 'completed' ? hoverLift : 0)}
                            rx="6"
                            fill="currentColor"
                            className={COLOR_CLASS.completed}
                            opacity={hovered ? (isHoveredLabel ? (hovered?.series === 'completed' ? 0.98 : 0.6) : 0.35) : 0.85}
                            stroke={hovered?.label === d.label && hovered?.series === 'completed' ? 'currentColor' : 'transparent'}
                            strokeWidth={hovered?.label === d.label && hovered?.series === 'completed' ? 2 : 0}
                            onMouseEnter={() =>
                                setHovered({
                                    label: d.label,
                                    series: 'completed',
                                    created: d.created ?? 0,
                                    completed: d.completed ?? 0,
                                })
                            }
                            onMouseLeave={() => setHovered(null)}
                            style={{ cursor: 'pointer', transition: 'opacity 140ms ease' }}
                        />
                    </g>
                );
            })}

            {hovered ? (
                <g
                    transform={`translate(${Math.min(width - 260, Math.max(10, cursor.x + 12))}, ${Math.max(8, cursor.y - 18)})`}
                    style={{ pointerEvents: 'none' }}
                >
                    <rect
                        x={0}
                        y={0}
                        width={250}
                        height={44}
                        rx={10}
                        className="fill-white/90 stroke-gray-200 dark:fill-gray-950/90 dark:stroke-gray-700"
                    />
                    <text
                        x={125}
                        y={16}
                        textAnchor="middle"
                        className="fill-gray-900 dark:fill-gray-100"
                        style={{ fontSize: 11, fontWeight: 800 }}
                    >
                        {hovered.label}
                    </text>
                    <text
                        x={125}
                        y={32}
                        textAnchor="middle"
                        className="fill-gray-600 dark:fill-gray-300"
                        style={{ fontSize: 11, fontWeight: 700 }}
                    >
                        Created: {hovered.created} • Completed: {hovered.completed}
                    </text>
                </g>
            ) : null}

            {/* X tick labels */}
            {data.map((d) => {
                const x0 = x(d.label) ?? 0;
                const cx = x0 + barW / 2;
                return (
                    <text
                        key={`x-${d.label}`}
                        x={cx}
                        y={height - padBottom + 18}
                        textAnchor="middle"
                        className="fill-gray-500 dark:fill-gray-400"
                        style={{ fontSize: 10, fontWeight: 600 }}
                    >
                        {d.label}
                    </text>
                );
            })}

            {/* Y tick labels */}
            {yTicks.map((t) => (
                <g key={`y-${t}`}>
                    <line
                        x1={padLeft - 4}
                        x2={padLeft}
                        y1={y(t)}
                        y2={y(t)}
                        stroke="currentColor"
                        className="text-gray-200 dark:text-gray-700"
                    />
                    <text
                        x={padLeft - 8}
                        y={y(t) + 3}
                        textAnchor="end"
                        className="fill-gray-500 dark:fill-gray-400"
                        style={{ fontSize: 10, fontWeight: 600 }}
                    >
                        {t}
                    </text>
                </g>
            ))}

            <line
                x1={padLeft}
                x2={width - padding}
                y1={height - padBottom}
                y2={height - padBottom}
                stroke="currentColor"
                className="text-gray-200 dark:text-gray-700"
            />

            {/* Axis labels */}
            {xLabel ? (
                <text
                    x={width / 2}
                    y={height - 6}
                    textAnchor="middle"
                    className="fill-gray-600 dark:fill-gray-300"
                    style={{ fontSize: 11, fontWeight: 700 }}
                >
                    {xLabel}
                </text>
            ) : null}
            {yLabel ? (
                <text
                    transform={`translate(18, ${height / 2}) rotate(-90)`}
                    textAnchor="middle"
                    className="fill-gray-600 dark:fill-gray-300"
                    style={{ fontSize: 11, fontWeight: 700 }}
                >
                    {yLabel}
                </text>
            ) : null}
        </svg>
    );
}

export function LineChart({ data, width = 560, height = 220, padding = 30, xLabel = null, yLabel = null }) {
    const [hovered, setHovered] = useState(null);
    const [cursor, setCursor] = useState({ x: width / 2, y: padding });

    const padLeft = yLabel ? Math.max(padding, 44) : padding;
    const padBottom = xLabel ? Math.max(padding, 48) : padding;

    const x = useMemo(
        () =>
            d3
                .scalePoint()
                .domain(data.map((d) => d.title))
                .range([padLeft, width - padding]),
        [data, padLeft, padding, width],
    );

    const y = useMemo(
        () => d3.scaleLinear().domain([0, 100]).range([height - padBottom, padding]),
        [height, padBottom, padding],
    );

    const line = useMemo(
        () =>
            d3
                .line()
                .x((d) => x(d.title))
                .y((d) => y(d.pct))
                .curve(d3.curveMonotoneX),
        [x, y],
    );

    const path = useMemo(() => line(data), [data, line]);

    const xTicks = useMemo(() => {
        if (!data?.length) return [];
        if (data.length <= 5) return data.map((d) => d.title);
        const step = Math.ceil(data.length / 5);
        const picked = [];
        for (let i = 0; i < data.length; i += step) {
            picked.push(data[i]?.title);
        }
        const last = data[data.length - 1]?.title;
        if (last && picked[picked.length - 1] !== last) picked.push(last);
        return picked;
    }, [data]);

    const yTicks = useMemo(() => [0, 50, 100], []);

    return (
        <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`}>
            {/* Axis lines */}
            <line
                x1={padLeft}
                x2={padLeft}
                y1={padding}
                y2={height - padBottom}
                stroke="currentColor"
                className="text-gray-200 dark:text-gray-700"
            />

            {/* Y ticks */}
            {yTicks.map((t) => (
                <g key={`y-${t}`}>
                    <line
                        x1={padLeft - 4}
                        x2={padLeft}
                        y1={y(t)}
                        y2={y(t)}
                        stroke="currentColor"
                        className="text-gray-200 dark:text-gray-700"
                    />
                    <text
                        x={padLeft - 8}
                        y={y(t) + 3}
                        textAnchor="end"
                        className="fill-gray-500 dark:fill-gray-400"
                        style={{ fontSize: 10, fontWeight: 600 }}
                    >
                        {t}
                    </text>
                </g>
            ))}

            {hovered ? (
                <g
                    transform={`translate(${Math.min(width - 290, Math.max(10, cursor.x + 12))}, ${Math.max(8, cursor.y - 18)})`}
                    style={{ pointerEvents: 'none' }}
                >
                    <rect
                        x={0}
                        y={0}
                        width={280}
                        height={44}
                        rx={10}
                        className="fill-white/90 stroke-gray-200 dark:fill-gray-950/90 dark:stroke-gray-700"
                    />
                    <text
                        x={140}
                        y={16}
                        textAnchor="middle"
                        className="fill-gray-900 dark:fill-gray-100"
                        style={{ fontSize: 11, fontWeight: 800 }}
                    >
                        {hovered.title}
                    </text>
                    <text
                        x={140}
                        y={32}
                        textAnchor="middle"
                        className="fill-gray-600 dark:fill-gray-300"
                        style={{ fontSize: 11, fontWeight: 700 }}
                    >
                        {hovered.pct}% complete ({hovered.completed}/{hovered.total})
                    </text>
                </g>
            ) : null}

            <path
                d={path ?? ''}
                fill="none"
                stroke="currentColor"
                className={COLOR_CLASS.line}
                strokeWidth={hovered ? 4 : 3}
                opacity={hovered ? 1 : 0.9}
                style={{ transition: 'opacity 140ms ease, stroke-width 140ms ease' }}
            />
            {data.map((d) => (
                <circle
                    key={d.id}
                    cx={x(d.title)}
                    cy={y(d.pct)}
                    r={hovered?.title === d.title ? 9 : 5}
                    fill="currentColor"
                    className={COLOR_CLASS.line}
                    opacity={hovered ? (hovered?.title === d.title ? 1 : 0.45) : 0.9}
                    stroke={hovered?.title === d.title ? 'currentColor' : 'transparent'}
                    strokeWidth={hovered?.title === d.title ? 3 : 0}
                    onMouseEnter={() => setHovered({ title: d.title, pct: d.pct, completed: d.completed, total: d.total })}
                    onMouseMove={(e) => setCursor(svgPointFromClientEvent(e, width, height))}
                    onMouseLeave={() => setHovered(null)}
                    style={{ cursor: 'pointer', transition: 'opacity 140ms ease' }}
                />
            ))}

            {/* X tick labels (sparse to avoid overlap) */}
            {xTicks.map((t) => (
                <text
                    key={`x-${t}`}
                    x={x(t)}
                    y={height - padBottom + 18}
                    textAnchor="middle"
                    className="fill-gray-500 dark:fill-gray-400"
                    style={{ fontSize: 10, fontWeight: 600 }}
                >
                    {t}
                </text>
            ))}
            <line
                x1={padLeft}
                x2={width - padding}
                y1={height - padBottom}
                y2={height - padBottom}
                stroke="currentColor"
                className="text-gray-200 dark:text-gray-700"
            />

            {/* Axis labels */}
            {xLabel ? (
                <text
                    x={width / 2}
                    y={height - 6}
                    textAnchor="middle"
                    className="fill-gray-600 dark:fill-gray-300"
                    style={{ fontSize: 11, fontWeight: 700 }}
                >
                    {xLabel}
                </text>
            ) : null}
            {yLabel ? (
                <text
                    transform={`translate(18, ${height / 2}) rotate(-90)`}
                    textAnchor="middle"
                    className="fill-gray-600 dark:fill-gray-300"
                    style={{ fontSize: 11, fontWeight: 700 }}
                >
                    {yLabel}
                </text>
            ) : null}
        </svg>
    );
}
