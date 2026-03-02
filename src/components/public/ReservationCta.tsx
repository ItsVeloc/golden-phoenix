import Link from 'next/link';

export default function ReservationCta() {
  return (
    <div className="reservation-section" id="book">
      <h2 className="reveal">Make a Reservation</h2>
      <p className="reveal">
        Our restaurant is open daily for lunch and dinner. Come and see why Golden Phoenix is one of the most exciting places to eat in Stratford-upon-Avon.
      </p>
      <Link href="/book" className="btn-outline reveal">Book Now</Link>
    </div>
  );
}
