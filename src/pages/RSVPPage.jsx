import { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { EVENTS } from '../events';
import RSVPForm from '../components/RSVPForm';
import './RSVPPage.css';

export default function RSVPPage() {
  const { eventId } = useParams();
  const [submitted, setSubmitted] = useState(false);

  const event = EVENTS.find((e) => e.id === eventId);

  if (!event) {
    return <Navigate to="/" replace />;
  }

  if (submitted) {
    return (
      <div className="rsvp-page rsvp-page--success" style={{ '--event-color': event.color }}>
        <div className="rsvp-page__success-card">
          <div className="rsvp-page__success-icon">✓</div>
          <h1 className="rsvp-page__success-title">You&apos;re on the list!</h1>
          <p className="rsvp-page__success-body">
            Thanks for RSVPing to the <strong>{event.city}</strong> Meet &amp; Greet
            on <strong>{event.meetGreetDate}</strong>. A confirmation has been sent
            to your email. We can&apos;t wait to see you there!
          </p>
          <Link to="/" className="rsvp-page__back-btn" style={{ background: event.color }}>
            ← Back to All Events
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="rsvp-page" style={{ '--event-color': event.color }}>
      <div className="rsvp-page__banner">
        {event.imageUrl && (
          <img
            src={event.imageUrl}
            alt={event.imageAlt}
            className="rsvp-page__banner-img"
          />
        )}
        <div className="rsvp-page__banner-overlay" style={{ background: `linear-gradient(to top, ${event.color}f0 40%, ${event.color}80 100%)` }}>
          <Link to="/" className="rsvp-page__back">← All Events</Link>
          <div className="rsvp-page__banner-text">
            <span className="rsvp-page__banner-kicker">Meet &amp; Greet</span>
            <h1 className="rsvp-page__banner-city">{event.city}</h1>
            <p className="rsvp-page__banner-state">{event.state}</p>
            <p className="rsvp-page__banner-date">{event.meetGreetDate}</p>
          </div>
        </div>
      </div>

      <div className="rsvp-page__content">
        <RSVPForm event={event} onSuccess={() => setSubmitted(true)} />
      </div>
    </div>
  );
}
