import Link from 'next/link';

const MAPS_URL = 'https://www.google.com/maps/search/?api=1&query=Golden+Phoenix+22a+Bell+Court+Stratford-upon-Avon+CV37+6EX';
const MAPS_EMBED = 'https://www.google.com/maps?q=Golden+Phoenix+22a+Bell+Court+Stratford-upon-Avon+CV37+6EX&output=embed';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid footer-grid-compact">
        {/* Location */}
        <div>
          <h4 className="footer-heading">Location</h4>
          <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className="footer-map-link">
            <div className="footer-map">
              <iframe
                src={MAPS_EMBED}
                className="footer-map-iframe"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Golden Phoenix location"
              />
            </div>
          </a>
          <p className="footer-address">
            <a href={MAPS_URL} target="_blank" rel="noopener noreferrer">
              22a Bell Court<br />
              Stratford-upon-Avon<br />
              CV37 6EX
            </a>
            <br />
            <a href="tel:+441789638731">01789 638 731</a><br />
            <a href="mailto:goldenphoenix22@yahoo.com">goldenphoenix22@yahoo.com</a>
          </p>
        </div>

        {/* Opening Hours */}
        <div>
          <h4 className="footer-heading">Opening Hours</h4>
          <dl className="footer-hours">
            <dt>Lunch</dt>
            <dd>Monday – Sunday</dd>
            <dd>12:00pm – 3:00pm</dd>
            <dt>Dinner</dt>
            <dd>Monday – Sunday</dd>
            <dd>5:00pm – 10:30pm</dd>
          </dl>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="footer-heading">Quick Links</h4>
          <ul className="footer-links">
            <li><a href="#top">Restaurant</a></li>
            <li><a href="#menu">Menus</a></li>
            <li><Link href="/book">Book a Table</Link></li>
          </ul>
        </div>

        {/* Newsletter — hidden until functional
        <div>
          <h4 className="footer-heading">Newsletter Signup</h4>
          <p className="newsletter-desc">Be the first to hear about special events and seasonal menus.</p>
          <div className="newsletter-row">
            <input type="text" className="newsletter-input" placeholder="First name *" />
            <input type="text" className="newsletter-input" placeholder="Last name *" />
          </div>
          <input type="email" className="newsletter-email" placeholder="Enter your email *" />
          <button className="newsletter-btn">Subscribe</button>
        </div>
        */}

        {/* Information — hidden until pages exist
        <div>
          <h4 className="footer-heading">Information</h4>
          <ul className="footer-links">
            <li><a href="#">Allergen Info</a></li>
            <li><a href="#">Terms & Conditions</a></li>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Cookie Policy</a></li>
          </ul>
        </div>
        */}
      </div>

      <div className="footer-bottom">
        <span>&copy; 2026 Golden Phoenix Stratford. All rights reserved.</span>
      </div>
    </footer>
  );
}
