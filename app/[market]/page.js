'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useMarket } from '../../context/MarketContext';

export default function HomePage() {
  console.log("SERVER: Rendering HomePage from page.js");
  const { market } = useMarket();
  const [showNotification, setShowNotification] = useState(false);
  const [isClient, setIsClient] = useState(false); // Fix for static generation

  useEffect(() => {
    // Mark as client-side rendered
    setIsClient(true);

    // Check if user has already closed the notification
    const hasClosedNotification = localStorage.getItem('hasClosedLaunchNotification');
    if (!hasClosedNotification) {
      setShowNotification(true);
    }
  }, []);

  const handleCloseNotification = () => {
    setShowNotification(false);
    localStorage.setItem('hasClosedLaunchNotification', 'true');
  };




  // Drag to Scroll Logic
  const sliderRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const startDragging = (e) => {
    isDragging.current = true;
    startX.current = e.pageX - sliderRef.current.offsetLeft;
    scrollLeft.current = sliderRef.current.scrollLeft;
    sliderRef.current.style.cursor = 'grabbing';
  };

  const stopDragging = () => {
    isDragging.current = false;
    if (sliderRef.current) {
      sliderRef.current.style.cursor = 'grab';
    }
  };

  const onDrag = (e) => {
    if (!isDragging.current) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX.current) * 2; // scroll-fast
    sliderRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const scrollCarousel = (direction) => {
    if (sliderRef.current) {
      const scrollAmount = 400; // Width of card + gap approx
      const targetScroll = sliderRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
      sliderRef.current.scrollTo({
        left: targetScroll,
        behavior: 'smooth'
      });
    }
  };

  return (
    <>
      {/* Pop-up Notification */}
      {showNotification && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '1rem'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #8b7355 0%, #a89181 100%)',
            padding: '3rem 2.5rem',
            borderRadius: '8px',
            maxWidth: '600px',
            width: '100%',
            position: 'relative',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
            color: 'white'
          }}>
            {/* Close Button */}
            <button
              onClick={handleCloseNotification}
              style={{
                position: 'absolute',
                top: '1.25rem',
                right: '1.25rem',
                background: 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: '1.4rem',
                color: 'white',
                transition: 'all 0.3s ease',
                fontWeight: 'bold'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
                e.currentTarget.style.transform = 'scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              ×
            </button>

            {/* Notification Content */}
            <div style={{
              textAlign: 'center',
              paddingRight: '1rem'
            }}>
              <h3 style={{
                fontSize: '1.75rem',
                marginBottom: '1.25rem',
                fontFamily: 'var(--font-display)',
                fontWeight: '400',
                color: 'white',
                letterSpacing: '0.02em'
              }}>
                Launching February 2026
              </h3>
              <p style={{
                fontSize: '1.05rem',
                lineHeight: '1.7',
                margin: '0 0 2rem 0',
                fontFamily: 'var(--font-body)',
                letterSpacing: '0.01em',
                color: 'white',
                opacity: 0.95
              }}>
                Be among the first 100 {market === 'SG' ? 'Singapore homeowners' : 'homeowners'} to get priority access to our top-rated network of interior designers!
              </p>
              <Link
                href="/assessment"
                onClick={handleCloseNotification}
                style={{
                  display: 'inline-block',
                  padding: '0.85rem 2.5rem',
                  background: 'white',
                  color: '#8b7355',
                  textDecoration: 'none',
                  borderRadius: '4px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  letterSpacing: '0.05em',
                  transition: 'all 0.3s ease',
                  fontFamily: 'var(--font-body)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                Get Started Now →
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Split Screen Layout: Fixed Left + Scrollable Right */}
      <div className="home-layout">
        {/* LEFT SIDE - Fixed for HOMEOWNERS */}
        <div className="home-left-panel">
          <div style={{ maxWidth: '600px' }}>
            <div style={{
              display: 'inline-block',
              marginBottom: '1rem',
              padding: '4px 12px',
              background: market === 'SG' ? '#FFF3E0' : '#E8F5E9',
              color: market === 'SG' ? '#EF6C00' : '#2E7D32',
              fontSize: '0.8rem',
              fontWeight: '700',
              borderRadius: '4px',
              letterSpacing: '0.05em'
            }}>
              {market === 'SG' ? '🇸🇬 SINGAPORE' : '🇲🇾 MALAYSIA'}
            </div>
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
              fontWeight: '400',
              marginBottom: '2rem',
              color: 'var(--primary-dark)',
              lineHeight: '1.2'
            }}>
              Stop Browsing. Start Matching.
            </h1>
            <p style={{
              fontSize: '1.2rem',
              lineHeight: '1.8',
              marginBottom: '2rem',
              color: 'var(--text)',
              fontFamily: 'var(--font-body)',
              fontWeight: '500'
            }}>
              Get matched with {market === 'SG' ? '5' : '3'} {market === 'SG' ? 'interior designers' : 'Malaysia renovation firms'} who fit your budget, style, and working preferences.
            </p>
            <p style={{
              fontSize: '1rem',
              lineHeight: '1.9',
              marginBottom: '3rem',
              opacity: '0.75',
              color: 'var(--text-light)',
              fontFamily: 'var(--font-body)'
            }}>
              No endless browsing. No guesswork. Just {market === 'SG' ? '5' : '3'} pre-qualified {market === 'SG' ? 'designers' : 'contractors'} matched to how you actually work — in 24 hours.
            </p>
            <Link href="/assessment" className="btn btn-primary" style={{
              fontSize: '0.95rem',
              padding: '0.5rem 0'
            }}>
              Get Your {market === 'SG' ? '5' : '3'} Matches →
            </Link>
            <p style={{
              fontSize: '0.85rem',
              marginTop: '1.5rem',
              opacity: '0.6',
              color: 'var(--text-light)',
              fontFamily: 'var(--font-body)',
              fontStyle: 'italic'
            }}>
              {market === 'SG'
                ? '100% Free • No Obligations • 2-Minute Assessment'
                : '100% Free • No Obligations • For Johor & KL Properties'}
            </p>
          </div>
        </div>

        {/* RIGHT SIDE - Scrollable Content */}
        <div className="home-right-panel">







          {/* Design Inspiration Gallery - Compact Carousel */}
          {isClient && (
            <section style={{
              padding: '4rem 3rem 6rem',
              minHeight: 'auto'
            }}>
              {/* Section Header */}
              <div style={{
                textAlign: 'center',
                marginBottom: '3rem',
                paddingTop: '2rem'
              }}>
                <h2 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
                  fontWeight: '400',
                  marginBottom: '0.5rem',
                  color: 'white',
                  lineHeight: '1.2'
                }}>
                  Curated Design Movements
                </h2>

                {/* Decorative Line */}
                <div style={{
                  width: '60px',
                  height: '2px',
                  background: 'white',
                  margin: '1.5rem auto 1rem',
                  opacity: 0.6
                }}></div>

                <p style={{
                  fontSize: '0.95rem',
                  opacity: '0.75',
                  fontFamily: 'var(--font-body)',
                  letterSpacing: '0.03em',
                  marginBottom: '0.75rem'
                }}>
                  Find designers who specialize in these styles
                </p>
              </div>

              {/* Horizontal Scrolling Carousel Container */}
              <div style={{ position: 'relative' }}>

                {/* Left Arrow */}
                <button
                  onClick={() => scrollCarousel('left')}
                  style={{
                    position: 'absolute',
                    left: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    zIndex: 2,
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(5px)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    fontSize: '1.2rem',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
                    e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                    e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                  }}
                >
                  ←
                </button>

                {/* Right Arrow */}
                <button
                  onClick={() => scrollCarousel('right')}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    zIndex: 2,
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(5px)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    fontSize: '1.2rem',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
                    e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                    e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                  }}
                >
                  →
                </button>

                <div
                  ref={sliderRef}
                  onMouseDown={startDragging}
                  onMouseLeave={stopDragging}
                  onMouseUp={stopDragging}
                  onMouseMove={onDrag}
                  style={{
                    overflowX: 'auto',
                    overflowY: 'hidden',
                    WebkitOverflowScrolling: 'touch',
                    scrollBehavior: 'smooth',
                    paddingBottom: '2rem',
                    cursor: 'grab',
                    scrollbarWidth: 'none', // Hide scrollbar Firefox
                    msOverflowStyle: 'none' // Hide scrollbar IE/Edge
                  }}>
                  {/* Hide scrollbar Chrome/Safari */}
                  <style jsx>{`
                  div::-webkit-scrollbar {
                    display: none;
                  }
                `}</style>
                  <div style={{
                    display: 'flex',
                    gap: '1.5rem',
                    paddingLeft: '1rem',
                    paddingRight: '1rem'
                  }}>

                    {/* Singapore Market */}
                    {market === 'SG' && (
                      <>
                        {/* SG Card 1 - Straits Colonial */}
                        <div style={{
                          minWidth: '350px',
                          background: 'rgba(255, 255, 255, 0.05)',
                          borderRadius: '8px',
                          overflow: 'hidden',
                          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                          cursor: 'pointer'
                        }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-8px)';
                            e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.3)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'none';
                          }}>
                          <div style={{
                            position: 'relative',
                            overflow: 'hidden',
                            aspectRatio: '4/3'
                          }}>
                            <img
                              src="/sg-straits-colonial.png"
                              alt="Straits Colonial"
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                display: 'block'
                              }}
                            />
                          </div>
                          <div style={{ padding: '1.5rem' }}>
                            <h3 style={{
                              fontFamily: 'var(--font-display)',
                              fontSize: '1.25rem',
                              fontWeight: '400',
                              marginBottom: '0.5rem',
                              color: 'white'
                            }}>
                              Straits Colonial
                            </h3>
                            <p style={{
                              fontSize: '0.875rem',
                              lineHeight: '1.6',
                              opacity: '0.75',
                              fontFamily: 'var(--font-body)',
                              color: 'white'
                            }}>
                              Timeless Black & White heritage with grand timber beams and breezy tropical elegance.
                            </p>
                          </div>
                        </div>

                        {/* SG Card 2 - Modern Nanyang */}
                        <div style={{
                          minWidth: '350px',
                          background: 'rgba(255, 255, 255, 0.05)',
                          borderRadius: '8px',
                          overflow: 'hidden',
                          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                          cursor: 'pointer'
                        }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-8px)';
                            e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.3)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'none';
                          }}>
                          <div style={{
                            position: 'relative',
                            overflow: 'hidden',
                            aspectRatio: '4/3'
                          }}>
                            <img
                              src="/sg-modern-nanyang.png"
                              alt="Modern Nanyang"
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                display: 'block'
                              }}
                            />
                          </div>
                          <div style={{ padding: '1.5rem' }}>
                            <h3 style={{
                              fontFamily: 'var(--font-display)',
                              fontSize: '1.25rem',
                              fontWeight: '400',
                              marginBottom: '0.5rem',
                              color: 'white'
                            }}>
                              Modern Nanyang
                            </h3>
                            <p style={{
                              fontSize: '0.875rem',
                              lineHeight: '1.6',
                              opacity: '0.75',
                              fontFamily: 'var(--font-body)',
                              color: 'white'
                            }}>
                              A vibrant contemporary revival of Peranakan culture with bold colors and geometric flair.
                            </p>
                          </div>
                        </div>

                        {/* SG Card 3 - Garden City Biophilic */}
                        <div style={{
                          minWidth: '350px',
                          background: 'rgba(255, 255, 255, 0.05)',
                          borderRadius: '8px',
                          overflow: 'hidden',
                          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                          cursor: 'pointer'
                        }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-8px)';
                            e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.3)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'none';
                          }}>
                          <div style={{
                            position: 'relative',
                            overflow: 'hidden',
                            aspectRatio: '4/3'
                          }}>
                            <img
                              src="/sg-garden-city.png"
                              alt="Garden City Biophilic"
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                display: 'block'
                              }}
                            />
                          </div>
                          <div style={{ padding: '1.5rem' }}>
                            <h3 style={{
                              fontFamily: 'var(--font-display)',
                              fontSize: '1.25rem',
                              fontWeight: '400',
                              marginBottom: '0.5rem',
                              color: 'white'
                            }}>
                              Garden City Biophilic
                            </h3>
                            <p style={{
                              fontSize: '0.875rem',
                              lineHeight: '1.6',
                              opacity: '0.75',
                              fontFamily: 'var(--font-body)',
                              color: 'white'
                            }}>
                              Living in harmony with nature—lush indoor greenery blurring the lines between home and garden.
                            </p>
                          </div>
                        </div>

                        {/* SG Card 4 - Conservation Shophouse */}
                        <div style={{
                          minWidth: '350px',
                          background: 'rgba(255, 255, 255, 0.05)',
                          borderRadius: '8px',
                          overflow: 'hidden',
                          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                          cursor: 'pointer'
                        }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-8px)';
                            e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.3)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'none';
                          }}>
                          <div style={{
                            position: 'relative',
                            overflow: 'hidden',
                            aspectRatio: '4/3'
                          }}>
                            <img
                              src="/sg-conservation-shophouse.png"
                              alt="Conservation Shophouse"
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                display: 'block'
                              }}
                            />
                          </div>
                          <div style={{ padding: '1.5rem' }}>
                            <h3 style={{
                              fontFamily: 'var(--font-display)',
                              fontSize: '1.25rem',
                              fontWeight: '400',
                              marginBottom: '0.5rem',
                              color: 'white'
                            }}>
                              Conservation Shophouse
                            </h3>
                            <p style={{
                              fontSize: '0.875rem',
                              lineHeight: '1.6',
                              opacity: '0.75',
                              fontFamily: 'var(--font-body)',
                              color: 'white'
                            }}>
                              Iconic double-volume airwells and exposed brick, merging historic charm with modern loft living.
                            </p>
                          </div>
                        </div>

                        {/* SG Card 5 - Parisian Modern */}
                        <div style={{
                          minWidth: '350px',
                          background: 'rgba(255, 255, 255, 0.05)',
                          borderRadius: '8px',
                          overflow: 'hidden',
                          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                          cursor: 'pointer'
                        }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-8px)';
                            e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.3)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'none';
                          }}>
                          <div style={{
                            position: 'relative',
                            overflow: 'hidden',
                            aspectRatio: '4/3'
                          }}>
                            <img
                              src="/sg-parisian-modern.png"
                              alt="Parisian Modern"
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                display: 'block'
                              }}
                            />
                          </div>
                          <div style={{ padding: '1.5rem' }}>
                            <h3 style={{
                              fontFamily: 'var(--font-display)',
                              fontSize: '1.25rem',
                              fontWeight: '400',
                              marginBottom: '0.5rem',
                              color: 'white'
                            }}>
                              Parisian Modern
                            </h3>
                            <p style={{
                              fontSize: '0.875rem',
                              lineHeight: '1.6',
                              opacity: '0.75',
                              fontFamily: 'var(--font-body)',
                              color: 'white'
                            }}>
                              A romantic blend of classic wall mouldings, herringbone floors, and mid-century elegance.
                            </p>
                          </div>
                        </div>

                        {/* SG Card 6 - Scandinavian */}
                        <div style={{
                          minWidth: '350px',
                          background: 'rgba(255, 255, 255, 0.05)',
                          borderRadius: '8px',
                          overflow: 'hidden',
                          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                          cursor: 'pointer'
                        }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-8px)';
                            e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.3)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'none';
                          }}>
                          <div style={{
                            position: 'relative',
                            overflow: 'hidden',
                            aspectRatio: '4/3'
                          }}>
                            <img
                              src="/sg-scandinavian.png"
                              alt="Scandinavian"
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                display: 'block'
                              }}
                            />
                          </div>
                          <div style={{ padding: '1.5rem' }}>
                            <h3 style={{
                              fontFamily: 'var(--font-display)',
                              fontSize: '1.25rem',
                              fontWeight: '400',
                              marginBottom: '0.5rem',
                              color: 'white'
                            }}>
                              Scandinavian
                            </h3>
                            <p style={{
                              fontSize: '0.875rem',
                              lineHeight: '1.6',
                              opacity: '0.75',
                              fontFamily: 'var(--font-body)',
                              color: 'white'
                            }}>
                              The Singapore staple—airy, functional, and cozy with light oak and clean minimalist lines.
                            </p>
                          </div>
                        </div>
                      </>
                    )}

                    {/* Malaysia Market */}
                    {market !== 'SG' && (
                      <>
                        {/* MY Card 1 - Tropical Modernism (uses SG project1.png) */}
                        <div style={{
                          minWidth: '350px',
                          background: 'rgba(255, 255, 255, 0.05)',
                          borderRadius: '8px',
                          overflow: 'hidden',
                          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                          cursor: 'pointer'
                        }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-8px)';
                            e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.3)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'none';
                          }}>
                          <div style={{
                            position: 'relative',
                            overflow: 'hidden',
                            aspectRatio: '4/3'
                          }}>
                            <img
                              src="/tropical-modernism.png"
                              alt="Tropical Modernism"
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                display: 'block'
                              }}
                            />
                          </div>
                          <div style={{ padding: '1.5rem' }}>
                            <h3 style={{
                              fontFamily: 'var(--font-display)',
                              fontSize: '1.25rem',
                              fontWeight: '400',
                              marginBottom: '0.5rem',
                              color: 'white'
                            }}>
                              Tropical Modernism
                            </h3>
                            <p style={{
                              fontSize: '0.875rem',
                              lineHeight: '1.6',
                              opacity: '0.75',
                              fontFamily: 'var(--font-body)',
                              color: 'white'
                            }}>
                              Seamless indoor-outdoor living with ventilation blocks and lush greenery.
                            </p>
                          </div>
                        </div>

                        {/* MY Card 2 - Straits Eclectic (uses SG project2.png) */}
                        <div style={{
                          minWidth: '350px',
                          background: 'rgba(255, 255, 255, 0.05)',
                          borderRadius: '8px',
                          overflow: 'hidden',
                          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                          cursor: 'pointer'
                        }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-8px)';
                            e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.3)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'none';
                          }}>
                          <div style={{
                            position: 'relative',
                            overflow: 'hidden',
                            aspectRatio: '4/3'
                          }}>
                            <img
                              src="/straits-eclectic.png"
                              alt="Straits Eclectic"
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                display: 'block'
                              }}
                            />
                          </div>
                          <div style={{ padding: '1.5rem' }}>
                            <h3 style={{
                              fontFamily: 'var(--font-display)',
                              fontSize: '1.25rem',
                              fontWeight: '400',
                              marginBottom: '0.5rem',
                              color: 'white'
                            }}>
                              Straits Eclectic
                            </h3>
                            <p style={{
                              fontSize: '0.875rem',
                              lineHeight: '1.6',
                              opacity: '0.75',
                              fontFamily: 'var(--font-body)',
                              color: 'white'
                            }}>
                              A sophisticated fusion of Peranakan tiles, ornate timber, and colonial elegance.
                            </p>
                          </div>
                        </div>

                        {/* MY Card 3 - Modern Nusantara (uses SG project3.png) */}
                        <div style={{
                          minWidth: '350px',
                          background: 'rgba(255, 255, 255, 0.05)',
                          borderRadius: '8px',
                          overflow: 'hidden',
                          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                          cursor: 'pointer'
                        }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-8px)';
                            e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.3)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'none';
                          }}>
                          <div style={{
                            position: 'relative',
                            overflow: 'hidden',
                            aspectRatio: '4/3'
                          }}>
                            <img
                              src="/modern-nusantara.png"
                              alt="Modern Nusantara"
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                display: 'block'
                              }}
                            />
                          </div>
                          <div style={{ padding: '1.5rem' }}>
                            <h3 style={{
                              fontFamily: 'var(--font-display)',
                              fontSize: '1.25rem',
                              fontWeight: '400',
                              marginBottom: '0.5rem',
                              color: 'white'
                            }}>
                              Modern Nusantara
                            </h3>
                            <p style={{
                              fontSize: '0.875rem',
                              lineHeight: '1.6',
                              opacity: '0.75',
                              fontFamily: 'var(--font-body)',
                              color: 'white'
                            }}>
                              Contemporary spaces grounded by local timber, rattan, and artisanal textures.
                            </p>
                          </div>
                        </div>

                        {/* MY Card 4 - Terracotta Modern */}
                        <div style={{
                          minWidth: '350px',
                          background: 'rgba(255, 255, 255, 0.05)',
                          borderRadius: '8px',
                          overflow: 'hidden',
                          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                          cursor: 'pointer'
                        }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-8px)';
                            e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.3)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'none';
                          }}>
                          <div style={{
                            position: 'relative',
                            overflow: 'hidden',
                            aspectRatio: '4/3'
                          }}>
                            <img
                              src="/terracotta-modern.png"
                              alt="Terracotta Modern"
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                display: 'block'
                              }}
                            />
                          </div>
                          <div style={{ padding: '1.5rem' }}>
                            <h3 style={{
                              fontFamily: 'var(--font-display)',
                              fontSize: '1.25rem',
                              fontWeight: '400',
                              marginBottom: '0.5rem',
                              color: 'white'
                            }}>
                              Terracotta Modern
                            </h3>
                            <p style={{
                              fontSize: '0.875rem',
                              lineHeight: '1.6',
                              opacity: '0.75',
                              fontFamily: 'var(--font-body)',
                              color: 'white'
                            }}>
                              Earthy, textured warmth with pink lime plaster and organic, expansive forms.
                            </p>
                          </div>
                        </div>

                        {/* MY Card 5 - Luxury Retail */}
                        <div style={{
                          minWidth: '350px',
                          background: 'rgba(255, 255, 255, 0.05)',
                          borderRadius: '8px',
                          overflow: 'hidden',
                          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                          cursor: 'pointer'
                        }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-8px)';
                            e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.3)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'none';
                          }}>
                          <div style={{
                            position: 'relative',
                            overflow: 'hidden',
                            aspectRatio: '4/3'
                          }}>
                            <img
                              src="/luxury-retail.png"
                              alt="Luxury Retail"
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                display: 'block'
                              }}
                            />
                          </div>
                          <div style={{ padding: '1.5rem' }}>
                            <h3 style={{
                              fontFamily: 'var(--font-display)',
                              fontSize: '1.25rem',
                              fontWeight: '400',
                              marginBottom: '0.5rem',
                              color: 'white'
                            }}>
                              Luxury Retail
                            </h3>
                            <p style={{
                              fontSize: '0.875rem',
                              lineHeight: '1.6',
                              opacity: '0.75',
                              fontFamily: 'var(--font-body)',
                              color: 'white'
                            }}>
                              High-end commercial spaces featuring dramatic feature walls and refined metallic accents.
                            </p>
                          </div>
                        </div>

                        {/* MY Card 6 - Contemporary Zen (uses SG coastal-hdb.png) */}
                        <div style={{
                          minWidth: '350px',
                          background: 'rgba(255, 255, 255, 0.05)',
                          borderRadius: '8px',
                          overflow: 'hidden',
                          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                          cursor: 'pointer'
                        }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-8px)';
                            e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.3)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'none';
                          }}>
                          <div style={{
                            position: 'relative',
                            overflow: 'hidden',
                            aspectRatio: '4/3'
                          }}>
                            <img
                              src="/contemporary-zen.png"
                              alt="Contemporary Zen"
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                display: 'block'
                              }}
                            />
                          </div>
                          <div style={{ padding: '1.5rem' }}>
                            <h3 style={{
                              fontFamily: 'var(--font-display)',
                              fontSize: '1.25rem',
                              fontWeight: '400',
                              marginBottom: '0.5rem',
                              color: 'white'
                            }}>
                              Contemporary Zen
                            </h3>
                            <p style={{
                              fontSize: '0.875rem',
                              lineHeight: '1.6',
                              opacity: '0.75',
                              fontFamily: 'var(--font-body)',
                              color: 'white'
                            }}>
                              Serene, clutter-free sanctuaries designed for restoration and calm.
                            </p>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Scroll Hint */}
              <div style={{
                textAlign: 'center',
                marginTop: '1.5rem',
                opacity: '0.5',
                fontSize: '0.8rem',
                fontFamily: 'var(--font-body)',
                color: 'white'
              }}>
                ← Swipe to explore more styles →
              </div>

              {/* Bottom CTA */}
              <div style={{
                textAlign: 'center',
                marginTop: '3rem'
              }}>
                <Link href="/assessment" style={{
                  display: 'inline-block',
                  color: 'white',
                  textDecoration: 'none',
                  borderBottom: '1.5px solid white',
                  paddingBottom: '3px',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  transition: 'all 0.3s ease',
                  fontFamily: 'var(--font-body)'
                }}>
                  Get Matched →
                </Link>
              </div>
            </section>
          )}


          {/* Trust Signals Section */}
          <section style={{
            padding: '5rem 0',
            background: '#f5f5f5',
            color: '#1a1a1a'
          }}>
            <div className="container">
              <h2 className="section-title" style={{ color: '#1a1a1a' }}>Our Commitment to Quality</h2>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '3rem',
                maxWidth: '1000px',
                margin: '0 auto',
                textAlign: 'center'
              }}>
                <div>
                  <div style={{
                    fontSize: '3rem',
                    marginBottom: '1rem',
                    color: 'var(--accent)'
                  }}>✓</div>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '0.75rem', color: '#1a1a1a' }}>{market === 'SG' ? 'BCA Registered' : 'CIDB Registered'}</h3>
                  <p style={{ fontSize: '0.95rem', color: 'var(--text-light)', lineHeight: '1.7' }}>
                    {market === 'SG'
                      ? 'All partner firms verified with Building & Construction Authority'
                      : 'All partner firms verified with Construction Industry Development Board'}
                  </p>
                </div>

                <div>
                  <div style={{
                    fontSize: '3rem',
                    marginBottom: '1rem',
                    color: 'var(--accent)'
                  }}>✓</div>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '0.75rem', color: '#1a1a1a' }}>{market === 'SG' ? 'HDB Licensed' : 'SSM Registered'}</h3>
                  <p style={{ fontSize: '0.95rem', color: 'var(--text-light)', lineHeight: '1.7' }}>
                    {market === 'SG'
                      ? 'Contractors hold valid HDB renovation licenses'
                      : 'Legitimately registered businesses with Suruhanjaya Syarikat Malaysia'}
                  </p>
                </div>

                <div>
                  <div style={{
                    fontSize: '3rem',
                    marginBottom: '1rem',
                    color: 'var(--accent)'
                  }}>✓</div>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '0.75rem', color: '#1a1a1a' }}>8+ Years Experience</h3>
                  <p style={{ fontSize: '0.95rem', color: 'var(--text-light)', lineHeight: '1.7' }}>
                    Average industry experience across our network
                  </p>
                </div>

                <div>
                  <div style={{
                    fontSize: '3rem',
                    marginBottom: '1rem',
                    color: 'var(--accent)'
                  }}>✓</div>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '0.75rem', color: '#1a1a1a' }}>120+ Verified Firms</h3>
                  <p style={{ fontSize: '0.95rem', color: 'var(--text-light)', lineHeight: '1.7' }}>
                    Carefully curated network of trusted design professionals
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section style={{ padding: '5rem 0', background: 'white' }}>
            <div className="container">
              <h2 className="section-title">How It Works</h2>

              <div style={{
                display: 'flex',
                justifyContent: 'center',
                flexWrap: 'wrap',
                gap: '1.5rem',
                maxWidth: '1000px',
                margin: '0 auto'
              }}>
                <div style={{ flex: '1 1 220px', maxWidth: '280px', textAlign: 'center' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '0.5rem', fontWeight: 600, color: 'var(--accent)', lineHeight: 1 }}>1</div>
                  <h3 style={{
                    fontSize: '1.25rem',
                    marginBottom: '0.75rem',
                    color: 'var(--primary-dark)'
                  }}>Submit Your Requirements</h3>
                  <p style={{ color: 'var(--text-light)', fontSize: '0.85rem' }}>
                    Tell us about your property, budget, scope, and working style preferences
                  </p>
                </div>

                <div style={{ flex: '1 1 220px', maxWidth: '280px', textAlign: 'center' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '0.5rem', fontWeight: 600, color: 'var(--accent)', lineHeight: 1 }}>2</div>
                  <h3 style={{
                    fontSize: '1.25rem',
                    marginBottom: '0.75rem',
                    color: 'var(--primary-dark)'
                  }}>We Match You with {market === 'SG' ? '5' : '3'} Firms</h3>
                  <p style={{ color: 'var(--text-light)', fontSize: '0.85rem' }}>
                    Our team personally reviews your preferences and connects you with exactly {market === 'SG' ? '5' : '3'} pre-qualified designers
                  </p>
                  <p style={{
                    fontSize: '0.8rem',
                    color: 'var(--accent)',
                    marginTop: '0.5rem',
                    fontStyle: 'italic',
                    lineHeight: 1.5
                  }}>
                    Why {market === 'SG' ? '5' : '3'}? Not too few (limited choice), not too many (decision paralysis). Just right.
                  </p>
                </div>

                <div style={{ flex: '1 1 220px', maxWidth: '280px', textAlign: 'center' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '0.5rem', fontWeight: 600, color: 'var(--accent)', lineHeight: 1 }}>3</div>
                  <h3 style={{
                    fontSize: '1.25rem',
                    marginBottom: '0.75rem',
                    color: 'var(--primary-dark)'
                  }}>Direct Contact</h3>
                  <p style={{ color: 'var(--text-light)', fontSize: '0.85rem' }}>
                    Matched firms reach out directly to discuss your project
                  </p>
                </div>
              </div>

              {/* Process Transparency */}
              <div style={{
                maxWidth: '700px',
                margin: '5rem auto 0',
                padding: '3rem',
                background: 'var(--bg-cream)',
                borderLeft: '4px solid var(--accent)'
              }}>
                <h3 style={{
                  fontSize: '1.5rem',
                  marginBottom: '1.5rem',
                  color: 'var(--primary-dark)',
                  fontFamily: 'var(--font-display)'
                }}>How We Vet Our Partners</h3>
                <ul style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: 0,
                  fontSize: '0.95rem',
                  color: 'var(--text)',
                  lineHeight: '2'
                }}>
                  <li style={{ marginBottom: '0.75rem' }}>✓ {market === 'SG' ? 'Verify BCA registration and HDB licensing status' : 'Verify CIDB registration and SSM status'}</li>
                  <li style={{ marginBottom: '0.75rem' }}>✓ {market === 'SG' ? 'Check ACRA business registration details' : 'Check SSM business registration details'}</li>
                  <li style={{ marginBottom: '0.75rem' }}>✓ Review portfolio and completed project history</li>
                  <li style={{ marginBottom: '0.75rem' }}>✓ {market === 'SG' ? 'Interview firm principals about working style' : 'Interview firm directors about working style'}</li>
                  <li style={{ marginBottom: '0.75rem' }}>✓ No commission-based affiliations (we don't take a cut)</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Founding Member Benefits Section - Moved to Position 3 */}
          <section style={{
            padding: '5rem 0',
            background: 'linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%)',
            color: 'white',
            textAlign: 'center'
          }}>
            <div className="container" style={{ maxWidth: '800px' }}>
              <h2 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2rem, 4vw, 3rem)',
                marginBottom: '1.5rem',
                color: 'white'
              }}>Founding Member Benefits</h2>

              <p style={{
                fontSize: '1.1rem',
                marginBottom: '3rem',
                opacity: '0.85',
                lineHeight: '1.8'
              }}>
                Join the first 100 homeowners and get exclusive perks:
              </p>

              <div style={{
                display: 'grid',
                gap: '1.5rem',
                textAlign: 'left',
                maxWidth: '600px',
                margin: '0 auto 3rem'
              }}>
                {[
                  { title: 'Priority Matching in 12 Hours', desc: '(vs standard 24 hours)' },
                  { title: 'Free Consultation Call', desc: 'Personal walkthrough with our team' },
                  { title: 'Extended Comparison Period', desc: 'Full 2 weeks to evaluate firms, not rushed' }
                ].map((benefit, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '1.5rem',
                    padding: '1.5rem',
                    background: 'rgba(255,255,255,0.05)',
                    borderLeft: '3px solid var(--accent)'
                  }}>
                    <div>
                      <h4 style={{
                        fontSize: '1.1rem',
                        marginBottom: '0.25rem',
                        fontWeight: '500',
                        color: 'white'
                      }}>{benefit.title}</h4>
                      <p style={{
                        fontSize: '0.9rem',
                        opacity: '0.85',
                        margin: 0,
                        fontStyle: 'italic',
                        color: 'white'
                      }}>{benefit.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Link href="/assessment" style={{
                display: 'inline-block',
                padding: '1.2rem 3rem',
                background: 'var(--accent)',
                color: 'white',
                textDecoration: 'none',
                fontSize: '1rem',
                fontWeight: '500',
                letterSpacing: '0.05em',
                transition: 'all 0.3s ease',
                border: 'none'
              }}>
                Claim Your Founding Member Spot →
              </Link>
            </div>
          </section>

          {/* Trust Stats Section */}
          <section style={{
            padding: '4rem 0',
            background: 'linear-gradient(135deg, var(--primary-dark) 0%, #4a4a4a 100%)',
            color: 'white'
          }}>
            <div className="container">
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '2rem',
                textAlign: 'center'
              }}>
                <div style={{ padding: '1.5rem' }}>
                  <div style={{
                    fontSize: '2.5rem',
                    fontWeight: '300',
                    marginBottom: '0.5rem',
                    fontFamily: 'Playfair Display, Georgia, serif'
                  }}>Launching</div>
                  <div style={{
                    textTransform: 'uppercase',
                    letterSpacing: '0.15em',
                    fontSize: '0.85rem',
                    opacity: 0.9
                  }}>New Service</div>
                </div>
                <div style={{ padding: '1.5rem' }}>
                  <div style={{
                    fontSize: '2.5rem',
                    fontWeight: '300',
                    marginBottom: '0.5rem',
                    fontFamily: 'Playfair Display, Georgia, serif'
                  }}>Quality First</div>
                  <div style={{
                    textTransform: 'uppercase',
                    letterSpacing: '0.15em',
                    fontSize: '0.85rem',
                    opacity: 0.9
                  }}>Limited Partners</div>
                </div>
                <div style={{ padding: '1.5rem' }}>
                  <div style={{
                    fontSize: '3.5rem',
                    fontWeight: '300',
                    marginBottom: '0.5rem',
                    fontFamily: 'Playfair Display, Georgia, serif'
                  }}>24hrs</div>
                  <div style={{
                    textTransform: 'uppercase',
                    letterSpacing: '0.15em',
                    fontSize: '0.85rem',
                    opacity: 0.9
                  }}>Response Time</div>
                </div>
                <div style={{ padding: '1.5rem' }}>
                  <div style={{
                    fontSize: '3.5rem',
                    fontWeight: '300',
                    marginBottom: '0.5rem',
                    fontFamily: 'Playfair Display, Georgia, serif'
                  }}>$0</div>
                  <div style={{
                    textTransform: 'uppercase',
                    letterSpacing: '0.15em',
                    fontSize: '0.85rem',
                    opacity: 0.9
                  }}>Free for Homeowners</div>
                </div>
              </div>
            </div>
          </section>

          {/* Why Choose Us */}
          <section style={{ padding: '6rem 0', background: 'white' }}>
            <div className="container">
              <h2 className="section-title">Why Choose roof</h2>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '3rem',
                maxWidth: '1200px',
                margin: '0 auto'
              }}>
                <div style={{
                  padding: '2.5rem',
                  background: 'var(--bg-light)',
                  borderRadius: '0',
                  border: '1px solid var(--border)'
                }}>
                  <div style={{
                    fontSize: '2.5rem',
                    marginBottom: '1.5rem',
                    fontWeight: 600,
                    color: 'var(--accent)',
                    textAlign: 'center'
                  }}>⊕</div>
                  <h3 style={{ marginBottom: '1rem', textAlign: 'center' }}>Curated Matching</h3>
                  <p style={{ color: 'var(--text-light)', lineHeight: 1.8, textAlign: 'center' }}>
                    We match based on style compatibility, budget range, and working preferences—not just availability
                  </p>
                </div>

                <div style={{
                  padding: '2.5rem',
                  background: 'var(--bg-light)',
                  borderRadius: '0',
                  border: '1px solid var(--border)'
                }}>
                  <div style={{
                    fontSize: '2.5rem',
                    marginBottom: '1.5rem',
                    fontWeight: 600,
                    color: 'var(--accent)',
                    textAlign: 'center'
                  }}>✓</div>
                  <h3 style={{ marginBottom: '1rem', textAlign: 'center' }}>Pre-Screened Network</h3>
                  <p style={{ color: 'var(--text-light)', lineHeight: 1.8, textAlign: 'center' }}>
                    All firms in our network are verified for licensing, portfolio quality, and professional conduct
                  </p>
                </div>

                <div style={{
                  padding: '2.5rem',
                  background: 'var(--bg-light)',
                  borderRadius: '0',
                  border: '1px solid var(--border)'
                }}>
                  <div style={{
                    fontSize: '2.5rem',
                    marginBottom: '1.5rem',
                    fontWeight: 600,
                    color: 'var(--accent)',
                    textAlign: 'center'
                  }}>◈</div>
                  <h3 style={{ marginBottom: '1rem', textAlign: 'center' }}>Transparent Process</h3>
                  <p style={{ color: 'var(--text-light)', lineHeight: 1.8, textAlign: 'center' }}>
                    Clear expectations, honest limitations, and straightforward communication throughout
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* What We Don't Do Section - Moved to Last Position */}
          <section style={{
            padding: '5rem 0',
            background: '#F9F8F4',
            textAlign: 'center'
          }}>
            <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
              <h2 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2rem, 3vw, 2.5rem)',
                marginBottom: '3rem',
                color: '#1a1a1a'
              }}>What We Don't Do</h2>

              <div style={{
                width: '60px',
                height: '2px',
                background: '#cec2ab',
                margin: '-1.5rem auto 3rem'
              }}></div>

              <ul style={{
                listStyle: 'none',
                padding: 0,
                margin: 0,
                textAlign: 'left',
                fontFamily: 'var(--font-body)',
                fontSize: '1.1rem',
                color: '#555',
                lineHeight: '2.2'
              }}>
                {[
                  "No firm browsing or comparison shopping",
                  "No public ratings or reviews",
                  "No guarantees about outcomes or contract closing",
                  "No escrow or handling of renovation payments"
                ].map((item, index) => (
                  <li key={index} style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center' }}>
                    <span style={{ color: '#cec2ab', marginRight: '1rem', fontSize: '1.5rem' }}>•</span>
                    {item}
                  </li>
                ))}
              </ul>

              <p style={{
                marginTop: '3rem',
                fontWeight: '600',
                color: '#cec2ab',
                fontSize: '1.2rem',
                fontFamily: 'var(--font-body)'
              }}>
                → We are an introduction service only
              </p>
            </div>
          </section>

        </div >
      </div >

      {/* WhatsApp Floating Button */}
      < a
        href="https://wa.me/6591234567?text=Hi%2C%20I%27d%20like%20to%20get%20matched%20with%20interior%20designers"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          width: '60px',
          height: '60px',
          background: '#25D366',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(37, 211, 102, 0.4)',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          zIndex: 1000,
          textDecoration: 'none'
        }
        }
      >
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M16 0C7.164 0 0 7.164 0 16c0 2.824.736 5.488 2.036 7.82L0 32l8.36-2.192A15.93 15.93 0 0016 32c8.836 0 16-7.164 16-16S24.836 0 16 0zm0 29.2c-2.508 0-4.936-.696-7.016-2.012l-.504-.3-5.22 1.368 1.392-5.092-.328-.52A13.14 13.14 0 012.8 16c0-7.288 5.932-13.2 13.2-13.2S29.2 8.712 29.2 16 23.288 29.2 16 29.2z"
            fill="white"
          />
          <path
            d="M22.824 18.98c-.4-.2-2.368-1.168-2.736-1.3-.368-.132-.636-.2-.904.2-.268.4-1.036 1.3-1.268 1.568-.232.268-.468.3-.868.1-.4-.2-1.688-.62-3.212-1.976-1.188-1.056-1.992-2.36-2.224-2.76-.232-.4-.024-.616.176-.816.18-.18.4-.468.6-.704.2-.232.268-.4.4-.668.132-.268.068-.5-.032-.7-.1-.2-.904-2.176-1.236-2.98-.324-.78-.652-.676-.904-.688-.232-.012-.5-.016-.768-.016-.268 0-.7.1-1.068.5-.368.4-1.404 1.372-1.404 3.348s1.436 3.884 1.636 4.152c.2.268 2.824 4.312 6.84 6.048.956.416 1.704.664 2.288.848.96.304 1.836.26 2.528.156.772-.116 2.368-.968 2.7-1.904.332-.936.332-1.74.232-1.904-.1-.164-.368-.264-.768-.464z"
            fill="white"
          />
        </svg>
      </a >
    </>
  );
}
