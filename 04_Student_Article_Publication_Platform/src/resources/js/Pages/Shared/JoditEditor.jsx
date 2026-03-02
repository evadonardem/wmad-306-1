import { useMemo, useRef } from 'react';
import JoditReact from 'jodit-react';

export default function JoditEditor({ value = '', onChange, placeholder = 'Start writing...' }) {
    const editor = useRef(null);

    const config = useMemo(() => ({
        readonly: false,
        placeholder,
    }), [placeholder]);

    return (
        <JoditReact
            ref={editor}
            value={value ?? ''}
            config={config}
            onBlur={(newContent) => onChange?.(newContent)}
            onChange={() => {}}
        />
    );
}
