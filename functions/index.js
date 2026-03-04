const functions = require('firebase-functions');
const admin = require('firebase-admin');
const axios = require('axios');

admin.initializeApp();
const db = admin.firestore();

// MailerLite API base URL
const MAILERLITE_API_URL = 'https://connect.mailerlite.com/api';

/**
 * Cloud Function: rsvp
 * Accepts RSVP submissions, saves to Firestore and adds subscriber(s) to MailerLite.
 */
exports.rsvp = functions.https.onRequest(async (req, res) => {
  // CORS headers for the hosted frontend
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  // Only allow POST
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method Not Allowed' });
    return;
  }

  const {
    eventId,
    eventCity,
    eventDate,
    mailerliteGroupId,
    name,
    email,
    guests = [],
  } = req.body;

  // Basic validation
  if (!name || !email || !eventId || !mailerliteGroupId) {
    res.status(400).json({ message: 'Missing required fields.' });
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ message: 'Invalid email address.' });
    return;
  }

  // Get MailerLite API key from Firebase environment config
  const mailerliteApiKey = functions.config().mailerlite?.api_key || process.env.MAILERLITE_API_KEY;
  if (!mailerliteApiKey) {
    console.error('MailerLite API key not configured.');
    res.status(500).json({ message: 'Server configuration error.' });
    return;
  }

  const headers = {
    Authorization: `Bearer ${mailerliteApiKey}`,
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  try {
    // 1. Save RSVP to Firestore
    const rsvpRef = db.collection('rsvps').doc();
    await rsvpRef.set({
      eventId,
      eventCity,
      eventDate,
      name,
      email,
      guests,
      submittedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // 2. Add primary attendee to MailerLite group
    await addSubscriberToMailerLite(headers, mailerliteGroupId, name, email, eventCity, eventDate);

    // 3. Add additional guests who provided email
    for (const guest of guests) {
      if (guest.email && emailRegex.test(guest.email)) {
        await addSubscriberToMailerLite(
          headers,
          mailerliteGroupId,
          guest.name,
          guest.email,
          eventCity,
          eventDate
        );
      }
    }

    res.status(200).json({ message: 'RSVP received. See you there!' });
  } catch (err) {
    console.error('RSVP error:', err?.response?.data || err.message, err.stack);
    res.status(500).json({ message: 'Could not process RSVP. Please try again.' });
  }
});

/**
 * Upsert a subscriber in MailerLite and add them to the event group.
 */
async function addSubscriberToMailerLite(headers, groupId, name, email, eventCity, eventDate) {
  // Split name into first/last
  const parts = name.trim().split(/\s+/);
  const first = parts[0] || '';
  const last = parts.slice(1).join(' ') || '';

  // Upsert subscriber and include the group directly in the payload
  const upsertResponse = await axios.post(
    `${MAILERLITE_API_URL}/subscribers`,
    {
      email,
      groups: [groupId],
      fields: {
        name: `${first} ${last}`.trim(),
        last_name: last,
      },
    },
    { headers }
  );

  // Explicitly assign to the group using the subscriber's UUID from the response,
  // ensuring the subscriber is added even if they already existed.
  const subscriberId = upsertResponse.data?.data?.id;
  if (subscriberId) {
    try {
      await axios.post(
        `${MAILERLITE_API_URL}/subscribers/${subscriberId}/groups/${groupId}`,
        {},
        { headers }
      );
    } catch (groupErr) {
      console.error(
        'MailerLite group assignment failed for subscriber',
        subscriberId,
        groupErr?.response?.data || groupErr.message
      );
      throw groupErr;
    }
  } else {
    console.warn('MailerLite subscriber upsert did not return an ID; group assignment skipped for', email);
  }
}
