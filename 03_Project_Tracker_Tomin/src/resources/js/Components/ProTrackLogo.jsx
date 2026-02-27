export default function ProTrackLogo({ className = '' }) {
    return (
        <div className={`flex items-center gap-2 ${className}`}>
            {/* Logo SVG */}
            <svg
                className="w-8 h-8"
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                {/* Background circle with gradient */}
                <defs>
                    <linearGradient id="protrackGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style={{ stopColor: '#3B82F6', stopOpacity: 1 }} />
                        <stop offset="100%" style={{ stopColor: '#8B5CF6', stopOpacity: 1 }} />
                    </linearGradient>
                </defs>

                {/* Circle background */}
                <circle cx="20" cy="20" r="18" fill="url(#protrackGradient)" opacity="0.1" />
                <circle cx="20" cy="20" r="15" fill="none" stroke="url(#protrackGradient)" strokeWidth="2" />

                {/* Checkmark path - represents completed tasks */}
                <path
                    d="M 12 20 L 17 25 L 28 14"
                    stroke="url(#protrackGradient)"
                    strokeWidth="3"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>

            {/* Logo text */}
            <span className="font-bold text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ProTrack
            </span>
        </div>
    );
}
