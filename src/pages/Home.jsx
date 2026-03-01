import EventCard from '../components/EventCard';
import { EVENTS } from '../events';
import './Home.css';

export default function Home() {
  return (
    <main className="home">
      <header className="home__hero">
        <div className="home__hero-inner">
          <p className="home__hero-kicker">Bryce Perry · 2026 Tour</p>
          <h1 className="home__hero-title">Meet &amp; Greet RSVP</h1>
          <p className="home__hero-subtitle">
            Join Bryce for a small, casual meet and greet the day before each
            main event. Space is limited — secure your spot today.
          </p>
        </div>
      </header>

      <section className="home__events">
        <div className="home__events-grid">
          {EVENTS.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </section>

      <footer className="home__footer">
        <p>
          Questions?{' '}
          <a href="https://bryceperry.org" target="_blank" rel="noreferrer">
            bryceperry.org
          </a>
        </p>
      </footer>
    </main>
  );
}
