import { useState } from 'react';
import { usePage } from '@inertiajs/react';

export default function CreatePost() {
    const user = usePage().props.auth.user;
    const [content, setContent] = useState('');

    const handlePost = () => {
        if (content.trim()) {
            // Here you would typically make an API call to save the post
            console.log('Post:', content);
            setContent('');
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                    {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                    <input
                        type="text"
                        placeholder="What's on your mind?"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="w-full bg-gray-100 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            <div className="mt-3 flex gap-2">
                <button className="flex-1 py-2 text-gray-500 rounded hover:bg-gray-100 transition text-sm">
                    📷 Photo
                </button>
                <button className="flex-1 py-2 text-gray-500 rounded hover:bg-gray-100 transition text-sm">
                    😊 Feeling
                </button>
                <button className="flex-1 py-2 text-gray-500 rounded hover:bg-gray-100 transition text-sm">
                    📍 Location
                </button>
            </div>

            {content && (
                <div className="mt-3 flex gap-2">
                    <button
                        onClick={() => setContent('')}
                        className="flex-1 py-2 bg-gray-200 text-gray-700 rounded font-semibold hover:bg-gray-300 transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handlePost}
                        className="flex-1 py-2 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700 transition"
                    >
                        Post
                    </button>
                </div>
            )}
        </div>
    );
}
