<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Welcome</title>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap');

            body {
                margin: 0;
                font-family: 'Space Grotesk', system-ui, sans-serif;
                background: radial-gradient(circle at top left, #1d4ed8 0%, #0f172a 45%, #020617 100%);
                color: #e2e8f0;
                min-height: 100vh;
            }
            .wrap {
                min-height: 100vh;
                display: grid;
                align-items: center;
                justify-content: center;
                padding: 48px 24px 64px;
                position: relative;
                overflow: hidden;
            }
            .glow {
                position: absolute;
                width: 420px;
                height: 420px;
                border-radius: 999px;
                filter: blur(120px);
                opacity: 0.6;
                animation: float 10s ease-in-out infinite;
            }
            .glow.one {
                top: -160px;
                right: -120px;
                background: #38bdf8;
            }
            .glow.two {
                bottom: -200px;
                left: -140px;
                background: #22c55e;
                animation-delay: 2s;
            }
            .hero {
                width: min(980px, 100%);
                background: linear-gradient(135deg, rgba(15, 23, 42, 0.85), rgba(2, 6, 23, 0.95));
                border: 1px solid rgba(148, 163, 184, 0.2);
                border-radius: 28px;
                padding: 40px;
                box-shadow: 0 30px 80px rgba(15, 23, 42, 0.55);
                position: relative;
                z-index: 1;
                backdrop-filter: blur(12px);
            }
            .tag {
                display: inline-flex;
                gap: 10px;
                align-items: center;
                padding: 6px 14px;
                border-radius: 999px;
                background: rgba(56, 189, 248, 0.15);
                color: #bae6fd;
                font-size: 12px;
                letter-spacing: 0.25em;
                text-transform: uppercase;
                font-weight: 600;
            }
            h1 {
                margin: 18px 0 16px;
                font-size: clamp(32px, 5vw, 54px);
                font-weight: 700;
                line-height: 1.1;
                color: #f8fafc;
            }
            p {
                margin: 0 0 20px;
                line-height: 1.7;
                color: #cbd5f5;
                font-size: 16px;
            }
            .cta {
                display: inline-flex;
                align-items: center;
                gap: 10px;
                padding: 12px 18px;
                border-radius: 12px;
                background: linear-gradient(135deg, #38bdf8, #22c55e);
                color: #0f172a;
                font-weight: 600;
                text-decoration: none;
                transition: transform 0.2s ease, box-shadow 0.2s ease;
            }
            .cta:hover {
                transform: translateY(-2px);
                box-shadow: 0 18px 40px rgba(34, 197, 94, 0.25);
            }
            .grid {
                margin-top: 28px;
                display: grid;
                gap: 16px;
                grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
            }
            .tile {
                padding: 16px;
                border-radius: 16px;
                border: 1px solid rgba(148, 163, 184, 0.16);
                background: rgba(15, 23, 42, 0.6);
            }
            .tile span {
                display: block;
                font-size: 12px;
                text-transform: uppercase;
                letter-spacing: 0.12em;
                color: #94a3b8;
                margin-bottom: 8px;
            }
            .tile strong {
                font-size: 20px;
                color: #e2e8f0;
            }
            @keyframes float {
                0%, 100% {
                    transform: translateY(0px);
                }
                50% {
                    transform: translateY(16px);
                }
            }
        </style>
    </head>
    <body>
        <div class="wrap">
            <div class="glow one"></div>
            <div class="glow two"></div>

            <section class="hero">
                <div class="tag">Live on localhost</div>
                <h1>Welcome to Sueno&apos;s Laravel Space</h1>
                <p>
                    This landing page keeps the focus on clarity and momentum. Your Users directory is styled
                    with a bold, modern look and ready for real data.
                </p>
                <a class="cta" href="/users">Explore Users</a>

                <div class="grid">
                    <div class="tile">
                        <span>Status</span>
                        <strong>Running</strong>
                    </div>
                    <div class="tile">
                        <span>Theme</span>
                        <strong>Midnight Neon</strong>
                    </div>
                    <div class="tile">
                        <span>Next</span>
                        <strong>Build Profiles</strong>
                    </div>
                </div>
            </section>
            </div>
        </div>
    </body>
</html>
