import Nav from '@/components/public/Nav';
import ScrollReveal from '@/components/public/ScrollReveal';
import Hero from '@/components/public/Hero';
import IntroText from '@/components/public/IntroText';
import ImageTrio from '@/components/public/ImageTrio';
import QuoteBarSection from '@/components/public/QuoteBarSection';
import MenuFullBleed from '@/components/public/MenuFullBleed';
import AltBlock from '@/components/public/AltBlock';
import ReservationCta from '@/components/public/ReservationCta';
import Footer from '@/components/public/Footer';
import SocialSidebar from '@/components/public/SocialSidebar';
import MobileBar from '@/components/public/MobileBar';

export default function Home() {
  return (
    <>
      <Nav />
      <SocialSidebar />
      <Hero />
      <IntroText />
      <ImageTrio />
      {/* QuoteBarSection — hidden until real review is provided
      <QuoteBarSection />
      */}
      <MenuFullBleed />

      {/* Hidden until content/pages exist:
      - Weekend Banquet Menu
      - What's On
      - Private Dining & Events
      - Gift Experiences
      */}

      <ReservationCta />
      <Footer />
      <MobileBar />
      <ScrollReveal />
    </>
  );
}
