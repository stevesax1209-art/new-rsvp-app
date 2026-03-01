import { useState } from 'react';
import './RSVPForm.css';

const emptyGuest = () => ({ name: '', email: '' });

export default function RSVPForm({ event, onSuccess }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    guests: [],
  });
  const [additionalCount, setAdditionalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAdditionalChange = (e) => {
    const count = Math.max(0, Math.min(10, parseInt(e.target.value) || 0));
    setAdditionalCount(count);
    setForm((prev) => {
      const guests = Array.from({ length: count }, (_, i) => prev.guests[i] || emptyGuest());
      return { ...prev, guests };
    });
  };

  const handleGuestChange = (index, field, value) => {
    setForm((prev) => {
      const guests = prev.guests.map((g, i) =>
        i === index ? { ...g, [field]: value } : g
      );
      return { ...prev, guests };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.name.trim()) {
      setError('Please enter your name.');
      return;
    }
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError('Please enter a valid email address.');
      return;
    }
    for (let i = 0; i < form.guests.length; i++) {
      if (!form.guests[i].name.trim()) {
        setError(`Please enter a name for additional guest ${i + 1}.`);
        return;
      }
      if (
        form.guests[i].email &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.guests[i].email)
      ) {
        setError(`Please enter a valid email for additional guest ${i + 1} (or leave it blank).`);
        return;
      }
    }

    setLoading(true);
    try {
      const payload = {
        eventId: event.id,
        eventCity: event.city,
        eventDate: event.meetGreetDate,
        mailerliteGroupId: event.mailerliteGroupId,
        name: form.name.trim(),
        email: form.email.trim(),
        guests: form.guests.map((g) => ({
          name: g.name.trim(),
          email: g.email.trim(),
        })),
        submittedAt: new Date().toISOString(),
      };

      const res = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Submission failed. Please try again.');
      }

      onSuccess();
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="rsvp-form" onSubmit={handleSubmit} noValidate>
      <h2 className="rsvp-form__title">RSVP — {event.city} Meet &amp; Greet</h2>
      <p className="rsvp-form__subtitle">{event.meetGreetDate}</p>

      {error && <div className="rsvp-form__error" role="alert">{error}</div>}

      <div className="rsvp-form__group">
        <label htmlFor="rsvp-name" className="rsvp-form__label">
          Your Name <span className="rsvp-form__required">*</span>
        </label>
        <input
          id="rsvp-name"
          type="text"
          className="rsvp-form__input"
          value={form.name}
          onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
          placeholder="Jane Smith"
          required
          autoComplete="name"
        />
      </div>

      <div className="rsvp-form__group">
        <label htmlFor="rsvp-email" className="rsvp-form__label">
          Your Email <span className="rsvp-form__required">*</span>
        </label>
        <input
          id="rsvp-email"
          type="email"
          className="rsvp-form__input"
          value={form.email}
          onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
          placeholder="jane@example.com"
          required
          autoComplete="email"
        />
      </div>

      <div className="rsvp-form__group">
        <label htmlFor="rsvp-additional" className="rsvp-form__label">
          Additional Guests (0–10)
        </label>
        <input
          id="rsvp-additional"
          type="number"
          className="rsvp-form__input rsvp-form__input--narrow"
          value={additionalCount}
          min={0}
          max={10}
          onChange={handleAdditionalChange}
        />
      </div>

      {form.guests.length > 0 && (
        <div className="rsvp-form__guests">
          <p className="rsvp-form__guests-title">Additional Guest Details</p>
          {form.guests.map((guest, i) => (
            <div key={i} className="rsvp-form__guest-row">
              <span className="rsvp-form__guest-num">Guest {i + 1}</span>
              <input
                type="text"
                className="rsvp-form__input rsvp-form__input--guest"
                value={guest.name}
                onChange={(e) => handleGuestChange(i, 'name', e.target.value)}
                placeholder={`Name *`}
                aria-label={`Guest ${i + 1} name`}
                required
              />
              <input
                type="email"
                className="rsvp-form__input rsvp-form__input--guest"
                value={guest.email}
                onChange={(e) => handleGuestChange(i, 'email', e.target.value)}
                placeholder="Email (optional)"
                aria-label={`Guest ${i + 1} email`}
              />
            </div>
          ))}
        </div>
      )}

      <button
        type="submit"
        className="rsvp-form__submit"
        disabled={loading}
        style={{ '--event-color': event.color }}
      >
        {loading ? 'Submitting…' : 'Confirm RSVP'}
      </button>
    </form>
  );
}
