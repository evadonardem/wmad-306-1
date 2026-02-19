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
                {/* Modern DS Logo - Circuit Design */}
                <rect x="4" y="4" width="40" height="40" rx="8" fill="none" stroke="#d4af37" strokeWidth="2"/>
                <circle cx="12" cy="12" r="3" fill="#d4af37"/>
                <circle cx="24" cy="12" r="3" fill="#d4af37"/>
                <circle cx="36" cy="12" r="3" fill="#d4af37"/>
                <circle cx="12" cy="24" r="3" fill="#d4af37"/>
                <circle cx="24" cy="24" r="5" fill="#d4af37"/>
                <circle cx="36" cy="24" r="3" fill="#d4af37"/>
                <circle cx="12" cy="36" r="3" fill="#d4af37"/>
                <circle cx="24" cy="36" r="3" fill="#d4af37"/>
                <circle cx="36" cy="36" r="3" fill="#d4af37"/>
                {/* Connection lines - tech look */}
                <line x1="15" y1="12" x2="21" y2="12" stroke="#d4af37" strokeWidth="1.5"/>
                <line x1="27" y1="12" x2="33" y2="12" stroke="#d4af37" strokeWidth="1.5"/>
                <line x1="12" y1="15" x2="12" y2="21" stroke="#d4af37" strokeWidth="1.5"/>
                <line x1="36" y1="15" x2="36" y2="21" stroke="#d4af37" strokeWidth="1.5"/>
                <line x1="12" y1="27" x2="12" y2="33" stroke="#d4af37" strokeWidth="1.5"/>
                <line x1="24" y1="15" x2="24" y2="19" stroke="#d4af37" strokeWidth="1.5"/>
                <line x1="24" y1="29" x2="24" y2="33" stroke="#d4af37" strokeWidth="1.5"/>
            </svg>
            <div style={{
                fontSize: '1.2rem',
                fontWeight: 900,
                color: '#1a1a1a',
                letterSpacing: '1px',
                lineHeight: 1,
                background: 'linear-gradient(135deg, #d4af37 0%, #e6c550 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontFamily: 'Georgia, serif',
            }}>
                DS
            </div>

        </div>
    );
}
