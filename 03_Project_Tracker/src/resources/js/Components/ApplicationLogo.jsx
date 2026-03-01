export default function ApplicationLogo(props) {
    return (
        <div className="flex items-center gap-2">
            <svg
                {...props}
                className={`${props.className || 'h-10 w-10'}`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            <span className={`${props.textClassName || 'text-2xl font-bold text-blue-900'}`}>
                TaskFlow
            </span>
        </div>
    );
}
