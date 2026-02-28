import { Fab } from '@mui/material';
import { useEffect, useRef, useState } from 'react';

export default function DraggableFab({
    icon,
    label,
    onClick,
    hintText,
    hintIntervalMs = 10000,
    hintOpenMs = 2400,
    rollIntervalMs,
    expandedWidth = 264,
}) {
    const MARGIN = 20;
    const SIZE = 68;

    const [pos, setPos] = useState({ x: 0, y: 0 });
    const [ready, setReady] = useState(false);
    const [hintOpen, setHintOpen] = useState(false);
    const [roll, setRoll] = useState(0);
    const [viewport, setViewport] = useState({ w: 0, h: 0 });
    const draggingRef = useRef(false);
    const startRef = useRef({ x: 0, y: 0, px: 0, py: 0 });
    const ignoreClickRef = useRef(false);

    const computeLayoutForX = (x) => {
        const vw = viewport.w || (typeof window !== 'undefined' ? window.innerWidth : 0);
        if (!vw) return { dir: 'right', w: expandedWidth };

        // Prefer expanding away from the nearest edge:
        // - If the button is on the left half → expand right
        // - If on the right half → expand left
        const centerX = x + SIZE / 2;
        const preferredDir = centerX < vw / 2 ? 'right' : 'left';

        const maxRight = vw - MARGIN - x;
        const maxLeft = x - MARGIN + SIZE;
        const rightW = Math.max(SIZE, Math.min(expandedWidth, maxRight));
        const leftW = Math.max(SIZE, Math.min(expandedWidth, maxLeft));

        const preferredW = preferredDir === 'right' ? rightW : leftW;
        const otherDir = preferredDir === 'right' ? 'left' : 'right';
        const otherW = preferredDir === 'right' ? leftW : rightW;

        // If preferred direction can't even fit the circle, fall back.
        if (preferredW <= SIZE && otherW > preferredW) return { dir: otherDir, w: otherW };
        return { dir: preferredDir, w: preferredW };
    };

    const clampPos = (next, open) => {
        const vw = viewport.w || (typeof window !== 'undefined' ? window.innerWidth : 0);
        const vh = viewport.h || (typeof window !== 'undefined' ? window.innerHeight : 0);
        if (!vw || !vh) return next;

        let minX = MARGIN;
        let maxX = Math.max(MARGIN, vw - SIZE - MARGIN);

        if (open) {
            const layout = computeLayoutForX(next.x);
            if (layout.dir === 'right') {
                maxX = Math.max(MARGIN, vw - layout.w - MARGIN);
            } else {
                minX = MARGIN + (layout.w - SIZE);
                maxX = Math.max(minX, vw - SIZE - MARGIN);
            }
        }

        const maxY = Math.max(MARGIN, vh - SIZE - MARGIN);

        return {
            x: Math.min(maxX, Math.max(minX, next.x)),
            y: Math.min(maxY, Math.max(MARGIN, next.y)),
        };
    };

    useEffect(() => {
        setViewport({ w: window.innerWidth, h: window.innerHeight });
        const x = window.innerWidth - SIZE - MARGIN;
        const y = window.innerHeight - SIZE - MARGIN;
        setPos(clampPos({ x, y }, false));
        setReady(true);
    }, []);

    useEffect(() => {
        if (!ready) return;

        const onResize = () => {
            setViewport({ w: window.innerWidth, h: window.innerHeight });
            setPos((p) => clampPos(p, Boolean(hintText && hintOpen)));
        };
        window.addEventListener('resize', onResize);
        window.addEventListener('orientationchange', onResize);
        return () => {
            window.removeEventListener('resize', onResize);
            window.removeEventListener('orientationchange', onResize);
        };
    }, [ready, hintOpen, hintText]);

    useEffect(() => {
        if (!ready) return;
        if (!hintText) return;

        const intervalId = window.setInterval(() => {
            setHintOpen(true);
            window.setTimeout(() => setHintOpen(false), hintOpenMs);
        }, hintIntervalMs);

        return () => window.clearInterval(intervalId);
    }, [ready, hintText, hintIntervalMs, hintOpenMs]);

    useEffect(() => {
        if (!ready) return;
        if (hintText) return;
        if (!rollIntervalMs) return;

        const intervalId = window.setInterval(() => {
            setRoll((r) => r + 1);
        }, rollIntervalMs);

        return () => window.clearInterval(intervalId);
    }, [ready, hintText, rollIntervalMs]);

    useEffect(() => {
        if (!ready) return;
        if (!hintText) return;
        // Smooth rolling both in and out.
        setRoll((r) => r + 1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hintOpen]);

    const onPointerDown = (e) => {
        draggingRef.current = true;
        ignoreClickRef.current = false;
        startRef.current = {
            x: pos.x,
            y: pos.y,
            px: e.clientX,
            py: e.clientY,
        };
        e.currentTarget.setPointerCapture(e.pointerId);
    };

    const onPointerMove = (e) => {
        if (!draggingRef.current) return;
        const dx = e.clientX - startRef.current.px;
        const dy = e.clientY - startRef.current.py;

        if (Math.abs(dx) + Math.abs(dy) > 4) ignoreClickRef.current = true;

        setPos(
            clampPos(
                {
                x: startRef.current.x + dx,
                y: startRef.current.y + dy,
                },
                Boolean(hintText && hintOpen),
            ),
        );
    };

    const onPointerUp = (e) => {
        if (!draggingRef.current) return;
        draggingRef.current = false;
        try {
            e.currentTarget.releasePointerCapture(e.pointerId);
        } catch {
            // ignore
        }

        // allow a click to fire naturally unless we've dragged
        window.setTimeout(() => {
            ignoreClickRef.current = false;
        }, 0);
    };

    const onFabClick = (e) => {
        if (ignoreClickRef.current) {
            e.preventDefault();
            e.stopPropagation();
            return;
        }
        onClick?.();
    };

    if (!ready) return null;

    const isOpen = Boolean(hintText && hintOpen);
    const layout = isOpen ? computeLayoutForX(pos.x) : { dir: 'right', w: SIZE };
    const currentWidth = isOpen ? layout.w : SIZE;
    const left = isOpen && layout.dir === 'left' ? pos.x - (layout.w - SIZE) : pos.x;

    return (
        <Fab
            color="inherit"
            aria-label={label}
            title={label}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onClick={onFabClick}
            style={{
                position: 'fixed',
                left,
                top: pos.y,
                zIndex: 1300,
                width: currentWidth,
            }}
            className="taskmo-btn taskmo-btn-primary rounded-full animate-taskmo-float"
            sx={{
                width: currentWidth,
                height: SIZE,
                minHeight: SIZE,
                minWidth: currentWidth,
                transition: 'width 520ms ease-in-out',
                borderRadius: `${SIZE / 2}px`,
                padding: 0,
            }}
        >
            <span
                className={`inline-flex h-full w-full items-center ${
                    isOpen ? `gap-3 px-4 ${layout.dir === 'left' ? 'flex-row-reverse' : ''}` : 'gap-0 justify-center px-0'
                }`}
            >
                <span
                    className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full leading-none"
                    style={{
                        transform: `rotate(${roll * 360}deg)`,
                        transition: 'transform 650ms ease-in-out',
                    }}
                >
                    {icon}
                </span>

                {hintText ? (
                    <span
                        className={`whitespace-nowrap text-sm font-semibold text-white transition-all duration-500 ease-in-out ${
                            isOpen ? 'opacity-100' : 'w-0 overflow-hidden opacity-0'
                        }`}
                    >
                        {hintText}
                    </span>
                ) : null}
            </span>
        </Fab>
    );
}
