export default function ApplicationLogo(props) {
    return (
        <div
            {...props}
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '100%',
                textAlign: 'center',
            }}
        >
            <svg
                width="48"
                height="48"
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ marginBottom: '4px' }}
            >
                <path
                    d="M24 4C24 4 10 14 10 28C10 34 14 40 24 44C34 40 38 34 38 28C38 14 24 4 24 4Z"
                    fill="#4caf50"
                    stroke="#2e7d32"
                    strokeWidth="2"
                />
                <path
                    d="M24 12V36"
                    stroke="#2e7d32"
                    strokeWidth="2"
                    strokeLinecap="round"
                />
                <path
                    d="M24 20C20 18 16 20 16 24"
                    stroke="#2e7d32"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    fill="none"
                />
                <path
                    d="M24 26C28 24 32 26 32 30"
                    stroke="#2e7d32"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    fill="none"
                />
            </svg>
            <div style={{
                fontSize: '0.85rem',
                fontWeight: 700,
                color: '#2e7d32',
                letterSpacing: '2px',
                lineHeight: 1,
            }}>
                PROJECT TRACKER
            </div>
        </div>
    );
}
