import { useState } from 'react';
import JoditEditor from '../Shared/JoditEditor';

export default function JoditEditorSample() {
    const [value, setValue] = useState('');

    return (
        <div>
            <h2>Jodit Wrapper Sample</h2>
            <JoditEditor value={value} onChange={setValue} />
        </div>
    );
}
