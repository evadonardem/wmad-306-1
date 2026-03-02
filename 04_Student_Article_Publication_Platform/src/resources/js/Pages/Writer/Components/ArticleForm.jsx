import { useState } from 'react';
import JoditEditor from '../../Shared/JoditEditor';

export default function ArticleForm({ article }) {
    const [content, setContent] = useState(article?.content ?? '');

    return (
        <form>
            <input defaultValue={article?.title} placeholder="Article title" />
            <JoditEditor value={content} onChange={setContent} />
        </form>
    );
}
