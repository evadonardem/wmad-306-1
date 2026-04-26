export default function ApplicationLogo(props) {
    return (
        <svg
            {...props}
            viewBox="0 0 120 120"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
        >
            <defs>
                <linearGradient id="campusQuillBg" x1="15" y1="12" x2="104" y2="108" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#0EA5E9" />
                    <stop offset="1" stopColor="#1D4ED8" />
                </linearGradient>
                <linearGradient id="campusQuillFeather" x1="67" y1="34" x2="98" y2="64" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#F8FAFC" />
                    <stop offset="1" stopColor="#C7D2FE" />
                </linearGradient>
            </defs>

            <rect x="8" y="8" width="104" height="104" rx="26" fill="url(#campusQuillBg)" />
            <path
                d="M32 74V44a6 6 0 0 1 6-6h22a6 6 0 0 1 6 6v30"
                stroke="#E2E8F0"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M32 74h40v6a4 4 0 0 1-4 4H36a4 4 0 0 1-4-4v-6Z"
                fill="#E2E8F0"
            />
            <path
                d="M59 52h12M44 60h27"
                stroke="#1E3A8A"
                strokeWidth="4"
                strokeLinecap="round"
                strokeOpacity=".45"
            />
            <path
                d="M90.4 35.2c-2.8-.9-6.6.8-9.5 3.7L71 48.8l10.2 10.2 9.9-9.9c2.8-2.9 4.6-6.7 3.7-9.5-.7-2.1-2.3-3.7-4.4-4.4Z"
                fill="url(#campusQuillFeather)"
            />
            <path
                d="m67.8 52 6.2 6.2"
                stroke="#1E3A8A"
                strokeWidth="3"
                strokeLinecap="round"
                strokeOpacity=".5"
            />
            <path
                d="m66 64-2.5 8.6 8.6-2.4"
                fill="#F8FAFC"
            />
        </svg>
    );
}
