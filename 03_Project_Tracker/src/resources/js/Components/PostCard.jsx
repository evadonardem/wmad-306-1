import { useState } from 'react';

export default function PostCard({ author, avatar, timestamp, content, image, likes = 0, comments = 0 }) {
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(likes);

    const handleLike = () => {
        setLiked(!liked);
        setLikeCount(liked ? likeCount - 1 : likeCount + 1);
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4">
            {/* Header */}
            <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                        {avatar}
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900">{author}</h3>
                        <p className="text-xs text-gray-500">{timestamp}</p>
                    </div>
                </div>
                <button className="text-gray-500 hover:text-gray-700">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10.5 1.5H9.5V10H.5v1h9v9h1v-9h9v-1h-9z"></path>
                    </svg>
                </button>
            </div>

            {/* Content */}
            <div className="px-4 py-2">
                <p className="text-gray-900 text-sm">{content}</p>
            </div>

            {/* Image */}
            {image && (
                <div className="mt-3">
                    <img src={image} alt="Post" className="w-full" />
                </div>
            )}

            {/* Stats */}
            <div className="px-4 py-2 text-xs text-gray-500 border-t border-gray-100 flex justify-between">
                <span>{likeCount} likes</span>
                <span>{comments} comments</span>
            </div>

            {/* Actions */}
            <div className="px-4 py-2 border-t border-gray-100 flex gap-2">
                <button
                    onClick={handleLike}
                    className={`flex-1 py-2 text-sm font-semibold rounded hover:bg-gray-100 transition ${
                        liked ? 'text-blue-600' : 'text-gray-500'
                    }`}
                >
                    👍 Like
                </button>
                <button className="flex-1 py-2 text-sm font-semibold text-gray-500 rounded hover:bg-gray-100 transition">
                    💬 Comment
                </button>
                <button className="flex-1 py-2 text-sm font-semibold text-gray-500 rounded hover:bg-gray-100 transition">
                    📤 Share
                </button>
            </div>
        </div>
    );
}
