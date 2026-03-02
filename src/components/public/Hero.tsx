import Link from 'next/link';

export default function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero-bg">
        <div className="hero-bg-left">
          <img src="/images/hero.jpg" alt="Golden Phoenix restaurant" />
        </div>
        <div className="hero-bg-right">
          <img src="/images/interior.jpg" alt="Restaurant interior" />
        </div>
      </div>
      <div className="hero-content">
        <div className="hero-rule"></div>
        <h1>Golden Phoenix,<br />Stratford-upon-Avon</h1>
        <p className="hero-desc">
          Authentic Cantonese cuisine in the heart of Stratford-upon-Avon. Traditional flavours crafted with care at 22a Bell Court.
        </p>
        <Link href="/book" className="hero-cta">Make a Reservation</Link>
      </div>
    </section>
  );
}
