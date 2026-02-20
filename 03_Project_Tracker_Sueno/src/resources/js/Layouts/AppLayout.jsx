// resources/js/Layouts/AppLayout.jsx
import React from 'react';
import ThemeToggle from '../Components/ThemeToggle';

export default function AppLayout({ children }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #e8e8e8 0%, #e8e8e8 100%)',
      color: '#1a1a1a',
    }}>
      {/* IT-Themed Navigation Bar with Code/Tech Elements */}
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1.25rem 2rem',
        background: 'linear-gradient(90deg, #0a0e27 0%, linear-gradient(135deg, #e8e8e8 0%, #e8e8e8 100%) 100%)',
        boxShadow: '0 0 30px rgba(6, 182, 212, 0.15), 0 4px 6px -1px rgba(0, 0, 0, 0.3)',
        backdropFilter: 'blur(12px)',
        borderBottom: '2px solid rgba(212, 175, 55, 0.15)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1.5rem',
        }}>
          {/* Code Bracket Logo */}
          <div style={{
            fontSize: '1.8rem',
            fontWeight: 900,
            background: 'linear-gradient(135deg, #d4af37 0%, #e6c550 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: '#1a1a2e',
            fontFamily: '"JetBrains Mono", monospace',
            letterSpacing: '3px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}>
            {'<'} DS {'/>'}\n          </div>
          <nav style={{
            display: 'flex',
            gap: '2.5rem',
            marginLeft: '2rem',
            borderLeft: '2px solid rgba(212, 175, 55, 0.2)',
            paddingLeft: '2rem',
          }}>
            <a href="/dashboard" style={{
              color: '#1a1a1a',
              textDecoration: 'none',
              fontSize: '0.95rem',
              fontWeight: 600,
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
            }} onMouseEnter={(e) => {
              e.target.style.color = '#d4af37';
              e.target.style.background = 'rgba(212, 175, 55, 0.1)';
            }} onMouseLeave={(e) => {
              e.target.style.color = '#1a1a1a';
              e.target.style.background = 'transparent';
            }}>
              💻 Dashboard
            </a>
            <a href="/projects" style={{
              color: '#1a1a1a',
              textDecoration: 'none',
              fontSize: '0.95rem',
              fontWeight: 600,
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
            }} onMouseEnter={(e) => {
              e.target.style.color = '#d4af37';
              e.target.style.background = 'rgba(212, 175, 55, 0.1)';
            }} onMouseLeave={(e) => {
              e.target.style.color = '#1a1a1a';
              e.target.style.background = 'transparent';
            }}>
              {'<>'} Projects
            </a>
            <a href="/tasks" style={{
              color: '#1a1a1a',
              textDecoration: 'none',
              fontSize: '0.95rem',
              fontWeight: 600,
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
            }} onMouseEnter={(e) => {
              e.target.style.color = '#d4af37';
              e.target.style.background = 'rgba(212, 175, 55, 0.1)';
            }} onMouseLeave={(e) => {
              e.target.style.color = '#1a1a1a';
              e.target.style.background = 'transparent';
            }}>
              ⚡ Tasks
            </a>
          </nav>
        </div>
        <ThemeToggle />
      </header>

      {/* Main Content */}
      <main style={{
        flex: 1,
        maxWidth: '1400px',
        width: '100%',
        margin: '0 auto',
        padding: '3rem 2rem',
      }}>
        <div style={{
          background: 'linear-gradient(135deg, rgba(10, 14, 35, 0.8), rgba(26, 31, 53, 0.6))',
          borderRadius: '12px',
          border: '1px solid rgba(212, 175, 55, 0.1)',
          padding: '2rem',
          boxShadow: '0 0 20px rgba(6, 182, 212, 0.05)',
        }}>
          {children}
        </div>
      </main>

      {/* IT-Themed Footer */}
      <footer style={{
        background: 'linear-gradient(180deg, rgba(10, 14, 35, 0.9), #0a0e27)',
        color: '#1a1a1a',
        padding: '3rem 2rem',
        marginTop: '3rem',
        borderTop: '2px solid rgba(212, 175, 55, 0.15)',
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '2rem',
          marginBottom: '2rem',
        }}>
          <div>
            <div style={{
              fontSize: '1.2rem',
              fontWeight: 900,
              background: 'linear-gradient(135deg, #d4af37 0%, #e6c550 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: '#1a1a2e',
              marginBottom: '1rem',
              fontFamily: '"JetBrains Mono", monospace',
            }}>
              {'<'} DS {'/>'}
            </div>
            <p style={{ fontSize: '0.9rem', lineHeight: 1.6, margin: 0 }}>
              Advanced project and task management system with IT-focused architecture and performance optimization.
            </p>
          </div>
          <div>
            <h4 style={{ color: '#1a1a1a', marginBottom: '1rem', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Code size={16} /> Development</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '0.5rem' }}><a href="#" style={{ color: '#1a1a1a', textDecoration: 'none', transition: 'color 0.3s' }} onMouseEnter={(e) => e.target.style.color = '#d4af37'} onMouseLeave={(e) => e.target.style.color = '#1a1a1a'}>Source Code</a></li>
              <li style={{ marginBottom: '0.5rem' }}><a href="#" style={{ color: '#1a1a1a', textDecoration: 'none', transition: 'color 0.3s' }} onMouseEnter={(e) => e.target.style.color = '#d4af37'} onMouseLeave={(e) => e.target.style.color = '#1a1a1a'}>API Docs</a></li>
              <li><a href="#" style={{ color: '#1a1a1a', textDecoration: 'none', transition: 'color 0.3s' }} onMouseEnter={(e) => e.target.style.color = '#d4af37'} onMouseLeave={(e) => e.target.style.color = '#1a1a1a'}>Infrastructure</a></li>
            </ul>
          </div>
          <div>
            <h4 style={{ color: '#1a1a1a', marginBottom: '1rem', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Settings size={16} /> Utilities</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '0.5rem' }}><a href="#" style={{ color: '#1a1a1a', textDecoration: 'none', transition: 'color 0.3s' }} onMouseEnter={(e) => e.target.style.color = '#d4af37'} onMouseLeave={(e) => e.target.style.color = '#1a1a1a'}>GitHub Repos</a></li>
              <li style={{ marginBottom: '0.5rem' }}><a href="#" style={{ color: '#1a1a1a', textDecoration: 'none', transition: 'color 0.3s' }} onMouseEnter={(e) => e.target.style.color = '#d4af37'} onMouseLeave={(e) => e.target.style.color = '#1a1a1a'}>Tech Support</a></li>
              <li><a href="#" style={{ color: '#1a1a1a', textDecoration: 'none', transition: 'color 0.3s' }} onMouseEnter={(e) => e.target.style.color = '#d4af37'} onMouseLeave={(e) => e.target.style.color = '#1a1a1a'}>Developers</a></li>
            </ul>
          </div>
        </div>
        <div style={{
          borderTop: '1px solid rgba(6, 182, 212, 0.15)',
          paddingTop: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}>
          <p style={{ margin: 0, fontSize: '0.85rem' }}>
            © 2026 DS | Advanced IT Project Management System
          </p>
          <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.85rem' }}>
            <a href="#" style={{ color: '#1a1a1a', textDecoration: 'none', transition: 'color 0.3s' }} onMouseEnter={(e) => e.target.style.color = '#d4af37'} onMouseLeave={(e) => e.target.style.color = '#1a1a1a'}>Privacy Policy</a>
            <a href="#" style={{ color: '#1a1a1a', textDecoration: 'none', transition: 'color 0.3s' }} onMouseEnter={(e) => e.target.style.color = '#d4af37'} onMouseLeave={(e) => e.target.style.color = '#1a1a1a'}>Tech Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
