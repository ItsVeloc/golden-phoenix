'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';

export default function Nav() {
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      navRef.current?.classList.toggle('scrolled', window.scrollY > 60);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className="nav" id="mainNav" ref={navRef}>
      <Link href="/" className="nav-logo">
        <div className="nav-logo-text">Golden<br />Phoenix</div>
      </Link>
      <ul className="nav-links">
        <li><a href="#menu">Menus</a></li>
        {/* Hidden until pages exist:
        <li><a href="#events">What's On</a></li>
        <li><a href="#brunch">Weekend Brunch</a></li>
        <li><a href="#private">Private Dining & Events</a></li>
        <li><a href="#">Gift Vouchers</a></li>
        */}
      </ul>
      <Link href="/book" className="nav-book-btn">Book Now</Link>
    </nav>
  );
}
