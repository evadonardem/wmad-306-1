<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Welcome to Molly Oras</title>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Nunito:wght@400;600;700&display=swap');

            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }

            body {
                background: #fdfcf7; /* clean neutral base */
                color: #2e4a2e;      /* forest green text */
                font-family: 'Inter', sans-serif;
                line-height: 1.6;
                min-height: 100vh;
                position: relative;
                overflow-x: hidden;
            }

            /* Subtle leaf background pattern */
            body::before {
                content: '';
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-image: 
                    radial-gradient(circle at 20% 80%, rgba(46, 74, 46, 0.03) 0%, transparent 50%),
                    radial-gradient(circle at 80% 20%, rgba(109, 76, 65, 0.02) 0%, transparent 50%),
                    radial-gradient(circle at 40% 40%, rgba(46, 74, 46, 0.01) 0%, transparent 50%);
                pointer-events: none;
                z-index: -1;
            }

            .header {
                background: #e8f5e9; /* soft green tint */
                padding: 20px 0;
                box-shadow: 0 2px 10px rgba(46, 74, 46, 0.05);
            }

            .container {
                max-width: 1200px;
                margin: 0 auto;
                padding: 0 24px;
            }

            .hero-section {
                padding: 80px 0 60px;
                text-align: center;
            }

            h1 {
                font-family: 'Nunito', sans-serif;
                color: #2e4a2e;
                font-size: clamp(2.5rem, 6vw, 4rem);
                font-weight: 700;
                margin-bottom: 24px;
                letter-spacing: -0.02em;
                position: relative;
            }

            h1::after {
                content: '🌿';
                position: absolute;
                top: -10px;
                right: -40px;
                font-size: 0.6em;
                opacity: 0.7;
            }

            .subtitle {
                color: #6d4c41;
                font-size: 1.2rem;
                margin-bottom: 40px;
                font-weight: 500;
            }

            .description {
                color: #4a5a4a;
                font-size: 1.1rem;
                max-width: 600px;
                margin: 0 auto 40px;
                line-height: 1.8;
            }

            .cta {
                display: inline-flex;
                align-items: center;
                gap: 12px;
                background-color: #2e4a2e;
                color: #fff;
                border-radius: 6px;
                padding: 14px 28px;
                text-decoration: none;
                font-weight: 600;
                font-size: 1.1rem;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                transition: all 0.3s ease;
            }

            .cta:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(46, 74, 46, 0.3);
                background-color: #3d5a3d;
            }

            .cta::after {
                content: '→';
                transition: transform 0.2s ease;
            }

            .cta:hover::after {
                transform: translateX(4px);
            }

            .status-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                gap: 24px;
                margin-top: 60px;
            }

            .status-section {
                background: #e8f5e9; /* soft green tint */
                border-left: 4px solid #6d4c41; /* earthy accent */
                border-radius: 8px;
                padding: 24px;
                position: relative;
                box-shadow: 0 2px 8px rgba(46, 74, 46, 0.08);
                transition: transform 0.2s ease;
            }

            .status-section:hover {
                transform: translateY(-2px);
            }

            .status-label {
                font-size: 0.85rem;
                text-transform: uppercase;
                letter-spacing: 0.1em;
                color: #6d4c41;
                font-weight: 600;
                margin-bottom: 8px;
            }

            .status-value {
                font-size: 1.4rem;
                color: #2e4a2e;
                font-weight: 700;
                position: relative;
            }

            .nature-accent {
                position: absolute;
                top: -8px;
                right: -8px;
                width: 24px;
                height: 24px;
                opacity: 0.6;
            }

            .footer-note {
                text-align: center;
                margin-top: 60px;
                padding: 40px 0;
                color: #6d4c41;
                font-style: italic;
                border-top: 1px solid #e8f5e9;
            }

            /* Responsive adjustments */
            @media (max-width: 768px) {
                .hero-section {
                    padding: 40px 0;
                }
                
                h1::after {
                    position: static;
                    display: block;
                    margin-top: 10px;
                }

                .status-grid {
                    grid-template-columns: 1fr;
                    gap: 16px;
                }
            }

            /* Subtle animations */
            @keyframes gentleFloat {
                0%, 100% { transform: translateY(0px); }
                50% { transform: translateY(-3px); }
            }

            .hero-section {
                animation: gentleFloat 6s ease-in-out infinite;
            }
        </style>
    </head>
    <body>
        <header class="header">
            <div class="container">
                <div style="text-align: center; color: #6d4c41; font-weight: 500;">
                    🌱 Growing naturally on localhost
                </div>
            </div>
        </header>

        <main class="container">
            <section class="hero-section">
                <h1>Welcome to Molly Oras</h1>
                <div class="subtitle">Where growth meets technology</div>
                <p class="description">
                    Discover a platform that nurtures digital growth with the wisdom of nature. 
                    Your user ecosystem is ready to flourish with authentic connections and sustainable design.
                </p>
                <a class="cta" href="/users">Explore Community</a>
            </section>

            <div class="status-grid">
                <div class="status-section">
                    <div class="status-label">Status</div>
                    <div class="status-value">
                        Thriving
                        <div class="nature-accent">🌿</div>
                    </div>
                </div>
                <div class="status-section">
                    <div class="status-label">Theme</div>
                    <div class="status-value">
                        Nature
                        <div class="nature-accent">🍃</div>
                    </div>
                </div>
                <div class="status-section">
                    <div class="status-label">Next</div>
                    <div class="status-value">
                        Grow Profiles
                        <div class="nature-accent">🌱</div>
                    </div>
                </div>
            </div>

            <div class="footer-note">
                "In every walk with nature, one receives far more than they seek" - John Muir
            </div>
        </main>
    </body>
</html>
