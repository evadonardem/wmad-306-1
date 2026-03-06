import { useCallback, useMemo, useRef } from 'react';
import JoditReact from 'jodit-react';

export default function JoditEditor({ value = '', onChange, placeholder = 'Start writing...', height }) {
    const editor = useRef(null);
    const rafRef = useRef(null);
    const latestValueRef = useRef(value ?? '');

    const config = useMemo(() => ({
        readonly: false,
        placeholder,
        ...(height ? { height } : {}),
    }), [placeholder, height]);

    const emitChange = useCallback((newContent) => {
        latestValueRef.current = newContent;

        if (rafRef.current != null) return;

        rafRef.current = requestAnimationFrame(() => {
            rafRef.current = null;
            onChange?.(latestValueRef.current);
        });
    }, [onChange]);

    return (
        <JoditReact
            ref={editor}
            value={value ?? ''}
            config={config}
            onBlur={(newContent) => onChange?.(newContent)}
            onChange={(newContent) => emitChange(newContent)}
        />
    );
}
