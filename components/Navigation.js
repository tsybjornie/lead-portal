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

  // Toggle solid nav on scroll or if not home
  useEffect(() => {
    const handleScroll = () => {
      // Threshold: 90vh for home (past hero), or 0 for pages
      // User said: "Once hero section is fully passed"
      const threshold = isHome ? window.innerHeight * 0.9 : 10;
      setIsScrolled(window.scrollY > threshold);
    };

    // If not home, always considered "scrolled" style (solid) or just solid base?
    // User: "Base state (hero visible): Transparent". Internal pages don't have hero usually.
    // We will default internal pages to Solid White immediately for readability.
    if (!isHome) {
      setIsScrolled(true);
    } else {
      window.addEventListener('scroll', handleScroll);
      handleScroll(); // Check initial
    }

    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHome]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Styles
  const navStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    zIndex: 1000,
    transition: 'background-color 0.3s ease, border-bottom 0.3s ease',
    backgroundColor: isScrolled ? 'rgba(255, 255, 255, 1)' : 'transparent',
    borderBottom: isScrolled ? '1px solid #f0f0f0' : 'none',
  };

  const textStyle = {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
    color: '#1a1a1a', // Always dark for visibility on cream background
    textDecoration: 'none',
    fontWeight: 500,
    fontSize: '0.95rem',
    opacity: isScrolled ? 1 : 0.8,
    transition: 'color 0.3s ease, opacity 0.2s ease-in-out',
    cursor: 'pointer'
  };

  const navLinks = [
    { name: 'Get Matched', path: '/assessment' },
    { name: 'Guides & References', path: '/guides' },
    { name: 'FAQ', path: '/faq' },
    { name: 'For Firms', path: '/contractor-application' },
  ];

  return (
    <>
      <nav className="nav-container" style={navStyle}>
        <div className="container" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '90px', // Generous padding
          transition: 'height 0.3s ease'
        }}>

          {/* LEFT: Logo Wordmark */}
          <Link href="/" style={{
            fontFamily: 'Playfair Display, serif', // Keeping Brand Font
            fontSize: '1.5rem',
            color: '#1a1a1a', // Always dark
            textDecoration: 'none',
            fontWeight: 400,
            letterSpacing: '0.02em',
            zIndex: 1001,
            position: 'relative',
            transition: 'color 0.3s ease'
          }}>
            roof
          </Link>

          {/* RIGHT: Desktop Links */}
          <div className="desktop-nav" style={{ display: 'flex', gap: '40px', alignItems: 'center' }}>
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.path}
                style={{ ...textStyle, color: '#cccccc' }} // Override with light grey
                onMouseEnter={(e) => e.target.style.opacity = '1'}
                onMouseLeave={(e) => e.target.style.opacity = '1'}
              >
                {link.name}
              </Link>
            ))}



            {/* Desktop Market Toggle (Text Based) */}
            <button
              onClick={() => switchMarket(market === 'SG' ? 'JB' : 'SG')}
              style={{
                background: isScrolled ? 'rgba(0,0,0,0.05)' : 'rgba(0,0,0,0.05)',
                border: isScrolled ? '1px solid #777' : '1px solid rgba(255,255,255,0.2)',
                padding: '8px 16px',
                borderRadius: '50px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s ease',
                color: '#cccccc', // Light grey
                backdropFilter: 'blur(4px)',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                fontSize: '0.85rem'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'scale(1.02)'}
              onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
            >
              <span style={{ fontWeight: market === 'SG' ? '700' : '400', opacity: market === 'SG' ? 1 : 0.5 }}>SG</span>
              <span style={{ opacity: 0.3 }}>|</span>
              <span style={{ fontWeight: market !== 'SG' ? '700' : '400', opacity: market !== 'SG' ? 1 : 0.5 }}>MY</span>
            </button>
          </div>

          {/* Hamburger Mobile */}
          <button
            onClick={toggleMenu}
            className="mobile-menu-btn"
            style={{
              display: 'none',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              flexDirection: 'column',
              gap: '6px',
              zIndex: 1002,
              padding: '10px'
            }}
          >
            <span style={{ display: 'block', width: '24px', height: '2px', background: '#1a1a1a', transition: '0.3s', transform: isMenuOpen ? 'rotate(45deg) translate(5px, 6px)' : 'none' }}></span>
            <span style={{ display: 'block', width: '24px', height: '2px', background: '#1a1a1a', transition: '0.3s', opacity: isMenuOpen ? 0 : 1 }}></span>
            <span style={{ display: 'block', width: '24px', height: '2px', background: '#1a1a1a', transition: '0.3s', transform: isMenuOpen ? 'rotate(-45deg) translate(5px, -6px)' : 'none' }}></span>

          </button>
        </div>
      </nav>

      {/* MOBILE OVERLAY */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100vh',
        background: 'white',
        zIndex: 1000,
        display: isMenuOpen ? 'flex' : 'none',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '2rem',
        opacity: isMenuOpen ? 1 : 0,
        transition: 'opacity 0.3s ease',
        pointerEvents: isMenuOpen ? 'all' : 'none'
      }}>
        {navLinks.map((link) => (
          <Link
            key={link.name}
            href={link.path}
            onClick={() => setIsMenuOpen(false)}
            style={{
              fontSize: '1.5rem',
              color: '#1a1a1a',
              textDecoration: 'none',
              fontWeight: 500,
              fontFamily: 'sans-serif'
            }}
          >
            {link.name}
          </Link>
        ))}

        {/* Mobile Market Toggle */}
        <button
          onClick={() => {
            switchMarket(market === 'SG' ? 'JB' : 'SG');
            setIsMenuOpen(false);
          }}
          style={{
            background: 'none',
            border: '2px solid #eee',
            padding: '12px 24px',
            borderRadius: '50px',
            fontSize: '1.1rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginTop: '1rem',
            color: '#1a1a1a'
          }}
        >
          <span style={{ fontWeight: market === 'SG' ? '700' : '400', opacity: market === 'SG' ? 1 : 0.5 }}>SG</span>
          <span style={{ opacity: 0.3 }}>|</span>
          <span style={{ fontWeight: market !== 'SG' ? '700' : '400', opacity: market !== 'SG' ? 1 : 0.5 }}>MY</span>
        </button>
      </div>

      {/* Spacer for non-home pages to prevent content hiding behind fixed nav */}
      {!isHome && <div style={{ height: '90px' }} />}

      <style jsx>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </>
  );
}
