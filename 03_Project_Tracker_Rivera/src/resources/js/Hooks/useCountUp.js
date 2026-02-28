import { useEffect, useMemo, useState } from 'react';

export default function useCountUp(target, durationMs = 900) {
    const safeTarget = useMemo(() => (Number.isFinite(+target) ? +target : 0), [target]);
    const [value, setValue] = useState(0);

    useEffect(() => {
        let raf = 0;
        const start = performance.now();
        const from = 0;
        const to = safeTarget;

        const tick = (now) => {
            const t = Math.min(1, (now - start) / durationMs);
            const next = Math.round(from + (to - from) * t);
            setValue(next);
            if (t < 1) raf = requestAnimationFrame(tick);
        };

        setValue(0);
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [safeTarget, durationMs]);

    return value;
}
