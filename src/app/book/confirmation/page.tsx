'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Link from 'next/link';
import Nav from '@/components/public/Nav';
import Footer from '@/components/public/Footer';

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  return (
    <div className="booking-page">
      <div className="booking-container">
        <div className="confirmation-icon">
          <svg viewBox="0 0 24 24" width="64" height="64" fill="none" stroke="var(--red)" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M8 12l3 3 5-5" />
          </svg>
        </div>
        <h1 className="booking-title">Reservation Confirmed</h1>
        <p className="confirmation-text">
          Thank you for your reservation. A confirmation email has been sent with your booking details.
        </p>
        {id && (
          <p className="confirmation-ref">
            Booking Reference: <strong>#{id}</strong>
          </p>
        )}
        <p className="confirmation-text">
          If you need to cancel or amend your reservation, please call us on{' '}
          <a href="tel:+441789638731">01789 638 731</a>.
        </p>
        <Link href="/" className="btn-outline" style={{ marginTop: '32px' }}>
          Return Home
        </Link>
      </div>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <>
      <Nav />
      <Suspense fallback={<div className="booking-page"><div className="booking-container"><p>Loading...</p></div></div>}>
        <ConfirmationContent />
      </Suspense>
      <Footer />
    </>
  );
}
