import { useState } from 'react';
import { Link } from 'react-router-dom';
import './EventCard.css';

export default function EventCard({ event }) {
  const [imgError, setImgError] = useState(false);

  return (
    <article
      className="event-card"
      style={{ '--card-color': event.color }}
    >
      <div className="event-card__image-wrap">
        {!imgError ? (
          <img
            src={event.imageUrl}
            alt={event.imageAlt}
            className="event-card__image"
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : (
          <div
            className="event-card__image-fallback"
            style={{ background: event.color }}
          />
        )}
        <div className="event-card__overlay" style={{ background: `linear-gradient(to top, ${event.color}e8 30%, transparent 100%)` }} />
        <div className="event-card__badge">Meet &amp; Greet</div>
        <div className="event-card__date-badge">{event.meetGreetDateShort}</div>
      </div>

      <div className="event-card__body">
        <div className="event-card__location">
          <span className="event-card__city">{event.city}</span>
          <span className="event-card__state">{event.state}</span>
        </div>

        <p className="event-card__meet-date">
          <strong>Meet &amp; Greet:</strong> {event.meetGreetDate}
        </p>

        <div className="event-card__main-event">
          <p className="event-card__main-label">Main Event</p>
          <p className="event-card__main-name">{event.mainEventName}</p>
          <p className="event-card__main-meta">
            {event.mainEventRole} · {event.mainEventDate}
          </p>
          <a
            href={event.mainEventUrl}
            target="_blank"
            rel="noreferrer"
            className="event-card__learn-more"
          >
            Learn More &amp; Register ↗
          </a>
        </div>

        <Link
          to={`/rsvp/${event.id}`}
          className="event-card__rsvp-btn"
          style={{ background: event.color }}
        >
          RSVP Now
        </Link>
      </div>
    </article>
  );
}
