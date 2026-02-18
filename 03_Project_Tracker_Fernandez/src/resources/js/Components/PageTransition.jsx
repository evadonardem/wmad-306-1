import { usePage } from '@inertiajs/react';
import { Box, Fade } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';

export default function PageTransition({ children }) {
    const page = usePage();
    const pageKey = useMemo(() => page.url, [page.url]);
    const [inProp, setInProp] = useState(false);

    useEffect(() => {
        setInProp(false);
        const id = requestAnimationFrame(() => setInProp(true));
        return () => cancelAnimationFrame(id);
    }, [pageKey]);

    return (
        <Fade in={inProp} timeout={420}>
            <Box>{children}</Box>
        </Fade>
    );
}
