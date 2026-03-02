export default function MenuFullBleed() {
  return (
    <div className="menu-fullbleed reveal" id="menu">
      <div className="menu-fullbleed-bg">
        <img src="/images/menu_hero.jpg" alt="Our dishes" />
      </div>
      <div className="menu-fullbleed-content">
        <h2>Menus</h2>
        <p>
          From our celebrated Peking duck &mdash; air-dried for 24 hours and lacquered to perfection &mdash; to aromatic Cantonese roasts and fiery Sichuan classics. Download a menu below.
        </p>
        <div className="menu-download-cards">
          <div className="menu-download-card">
            <svg viewBox="0 0 24 24"><path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm-1 1.5L18.5 9H13V3.5zM6 20V4h5v7h7v9H6z" /></svg>
            <span className="card-title">Main Menu</span>
            <span className="card-desc">Full menu with appetisers, mains, noodles, rice, drinks &amp; desserts</span>
            <a href="/media/F21-Menu1.pdf" download className="card-btn">
              <svg viewBox="0 0 24 24"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" /></svg>
              Download PDF
            </a>
          </div>
          <div className="menu-download-card">
            <svg viewBox="0 0 24 24"><path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm-1 1.5L18.5 9H13V3.5zM6 20V4h5v7h7v9H6z" /></svg>
            <span className="card-title">Cantonese Menu</span>
            <span className="card-desc">Authentic Cantonese dishes with bilingual Chinese &amp; English descriptions</span>
            <a href="/media/F23-Menu1Cantonese.pdf" download className="card-btn">
              <svg viewBox="0 0 24 24"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" /></svg>
              Download PDF
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
