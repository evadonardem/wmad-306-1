export default function ApplicationLogo(props) {
    return (
        <svg
            {...props}
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="Project Tracker logo"
        >
            <defs>
                <linearGradient id="g" x1="0" x2="1">
                    <stop offset="0%" stopColor="#1976d2" />
                    <stop offset="100%" stopColor="#42a5f5" />
                </linearGradient>
            </defs>
            <rect x="6" y="20" width="44" height="60" rx="6" fill="url(#g)" />
            <rect x="50" y="20" width="44" height="60" rx="6" fill="#fff" opacity="0.06" />
            <path d="M22 48c0-3.3 2.7-6 6-6h6v24h-6c-3.3 0-6-2.7-6-6v-12z" fill="#fff"/>
            <path d="M56 44v4h10v28h6V44h10v-4H56z" fill="#fff"/>
        </svg>
    );
}
