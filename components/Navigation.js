'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMarket } from '../context/MarketContext';

export default function Navigation() {
  const { market, switchMarket } = useMarket();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === '/';

  // Hide public nav on internal tool pages
  const INTERNAL_ROUTES = ['/sequence', '/follow-up', '/projects', '/quote-builder', '/dispatch', '/ledger', '/team', '/intelligence', '/autopilot', '/admin', '/drafter', '/chat', '/marketing', '/inspect', '/overhead', '/vendor-rates', '/price-index', '/materials', '/portal'];
  const isInternalPage = INTERNAL_ROUTES.some(r => pathname === r || pathname?.startsWith(r + '/'));
  if (isInternalPage) return null;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const navLinks = [
    { name: 'Get Matched', path: '/assessment' },
    { name: 'Guides', path: '/guides' },
    { name: 'FAQ', path: '/faq' },
    { name: 'For Firms', path: '/contractor-application' },
    { name: 'For Builders', path: 'https://roof-builder.vercel.app/landing', external: true },
  ];

  return (
    <>
      {/* ═══════ FLOATING PILL NAV ═══════ */}
      <div style={{
        position: 'fixed',
        top: isScrolled ? 16 : 24,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1000,
        transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
      }}>
        <nav style={{
          background: 'rgba(18, 18, 18, 0.92)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          borderRadius: '60px',
          padding: '0 8px',
          height: '52px',
          display: 'flex',
          alignItems: 'center',
          gap: '0',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 4px 30px rgba(0,0,0,0.3), 0 1px 3px rgba(0,0,0,0.2)',
          transition: 'all 0.4s ease',
        }}>
          {/* Brand */}
          <Link href="/" style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: '0.95rem',
            fontWeight: 600,
            color: '#ffffff',
            textDecoration: 'none',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            padding: '0 20px 0 24px',
            whiteSpace: 'nowrap',
          }}>
            ROOF
          </Link>

          {/* Divider */}
          <div style={{
            width: '1px',
            height: '20px',
            background: 'rgba(255,255,255,0.12)',
            flexShrink: 0,
          }} />

          {/* Desktop Links */}
          <div className="desktop-nav" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0',
            padding: '0 4px',
          }}>
            {navLinks.map((link) => {
              const isActive = pathname === link.path;
              const isExternal = link.external;

              if (isExternal) {
                return (
                  <a
                    key={link.name}
                    href={link.path}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                      fontSize: '0.82rem',
                      fontWeight: 500,
                      color: '#a78bfa',
                      textDecoration: 'none',
                      padding: '8px 16px',
                      borderRadius: '40px',
                      transition: 'all 0.25s ease',
                      whiteSpace: 'nowrap',
                      background: 'rgba(139, 92, 246, 0.12)',
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = 'rgba(139, 92, 246, 0.25)';
                      e.target.style.color = '#c4b5fd';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'rgba(139, 92, 246, 0.12)';
                      e.target.style.color = '#a78bfa';
                    }}
                  >
                    {link.name} ↗
                  </a>
                );
              }

              return (
                <Link
                  key={link.name}
                  href={link.path}
                  style={{
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                    fontSize: '0.82rem',
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? '#ffffff' : 'rgba(255,255,255,0.5)',
                    textDecoration: isActive ? 'underline' : 'none',
                    textUnderlineOffset: '4px',
                    textDecorationThickness: '1.5px',
                    padding: '8px 16px',
                    borderRadius: '40px',
                    transition: 'all 0.25s ease',
                    whiteSpace: 'nowrap',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.target.style.color = 'rgba(255,255,255,0.85)';
                      e.target.style.background = 'rgba(255,255,255,0.06)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.target.style.color = 'rgba(255,255,255,0.5)';
                      e.target.style.background = 'transparent';
                    }
                  }}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Divider */}
          <div style={{
            width: '1px',
            height: '20px',
            background: 'rgba(255,255,255,0.12)',
            flexShrink: 0,
          }} />

          {/* Market Toggle */}
          <button
            onClick={() => switchMarket(market === 'SG' ? 'JB' : 'SG')}
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: 'none',
              padding: '6px 16px',
              borderRadius: '40px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.25s ease',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              fontSize: '0.78rem',
              margin: '0 8px 0 4px',
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
          >
            <span style={{ fontWeight: market === 'SG' ? '700' : '400', color: market === 'SG' ? '#fff' : 'rgba(255,255,255,0.35)' }}>SG</span>
            <span style={{ color: 'rgba(255,255,255,0.2)' }}>|</span>
            <span style={{ fontWeight: market !== 'SG' ? '700' : '400', color: market !== 'SG' ? '#fff' : 'rgba(255,255,255,0.35)' }}>MY</span>
          </button>
        </nav>
      </div>

      {/* ═══════ MOBILE HAMBURGER (outside pill on mobile) ═══════ */}
      <button
        onClick={toggleMenu}
        className="mobile-menu-btn"
        style={{
          display: 'none',
          position: 'fixed',
          top: 20,
          right: 20,
          zIndex: 1002,
          background: 'rgba(18, 18, 18, 0.92)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '50%',
          width: '48px',
          height: '48px',
          cursor: 'pointer',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '5px',
          padding: '0',
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
        }}
      >
        <span style={{ display: 'block', width: '18px', height: '2px', background: '#fff', transition: '0.3s', transform: isMenuOpen ? 'rotate(45deg) translate(4px, 5px)' : 'none' }}></span>
        <span style={{ display: 'block', width: '18px', height: '2px', background: '#fff', transition: '0.3s', opacity: isMenuOpen ? 0 : 1 }}></span>
        <span style={{ display: 'block', width: '18px', height: '2px', background: '#fff', transition: '0.3s', transform: isMenuOpen ? 'rotate(-45deg) translate(4px, -5px)' : 'none' }}></span>
      </button>

      {/* ═══════ MOBILE BRAND (outside pill on mobile) ═══════ */}
      <div className="mobile-brand" style={{
        display: 'none',
        position: 'fixed',
        top: 20,
        left: 20,
        zIndex: 1001,
      }}>
        <Link href="/" style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: '1.1rem',
          fontWeight: 600,
          color: isHome ? '#fff' : '#1a1a1a',
          textDecoration: 'none',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          background: 'rgba(18, 18, 18, 0.92)',
          backdropFilter: 'blur(20px)',
          padding: '12px 20px',
          borderRadius: '50px',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
        }}>
          ROOF
        </Link>
      </div>

      {/* ═══════ MOBILE OVERLAY ═══════ */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100vh',
        background: 'rgba(10, 10, 10, 0.97)',
        backdropFilter: 'blur(30px)',
        zIndex: 1000,
        display: isMenuOpen ? 'flex' : 'none',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '1.5rem',
        opacity: isMenuOpen ? 1 : 0,
        transition: 'opacity 0.3s ease',
        pointerEvents: isMenuOpen ? 'all' : 'none'
      }}>
        {navLinks.map((link) => (
          link.external ? (
            <a
              key={link.name}
              href={link.path}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsMenuOpen(false)}
              style={{
                fontSize: '1.4rem',
                color: '#a78bfa',
                textDecoration: 'none',
                fontWeight: 500,
                fontFamily: '-apple-system, sans-serif',
              }}
            >
              {link.name} ↗
            </a>
          ) : (
            <Link
              key={link.name}
              href={link.path}
              onClick={() => setIsMenuOpen(false)}
              style={{
                fontSize: '1.4rem',
                color: pathname === link.path ? '#ffffff' : 'rgba(255,255,255,0.5)',
                textDecoration: pathname === link.path ? 'underline' : 'none',
                textUnderlineOffset: '6px',
                fontWeight: pathname === link.path ? 600 : 400,
                fontFamily: '-apple-system, sans-serif',
              }}
            >
              {link.name}
            </Link>
          )
        ))}

        {/* Mobile Market Toggle */}
        <button
          onClick={() => {
            switchMarket(market === 'SG' ? 'JB' : 'SG');
            setIsMenuOpen(false);
          }}
          style={{
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
            padding: '12px 28px',
            borderRadius: '50px',
            fontSize: '1rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginTop: '1rem',
            color: '#fff'
          }}
        >
          <span style={{ fontWeight: market === 'SG' ? '700' : '400', opacity: market === 'SG' ? 1 : 0.4 }}>SG</span>
          <span style={{ opacity: 0.2 }}>|</span>
          <span style={{ fontWeight: market !== 'SG' ? '700' : '400', opacity: market !== 'SG' ? 1 : 0.4 }}>MY</span>
        </button>
      </div>

      {/* Spacer for non-home pages */}
      {!isHome && <div style={{ height: '90px' }} />}

      <style jsx>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
          .mobile-brand { display: block !important; }
        }
      `}</style>
    </>
  );
}
