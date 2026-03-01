# Meet & Greet RSVP App

A modern RSVP app for Bryce Perry's 2026 meet-and-greet events, built with React + Vite, hosted on Firebase, and integrated with MailerLite.

## Events

| City | Meet & Greet | Main Event |
|------|-------------|------------|
| Cleveland, OH | April 17, 2026 | April 18 – 26th Annual OPFNE Parkinson's Symposium |
| Phoenix, AZ | May 24–27, 2026 | May 25 – WPC 2026 |
| Collingwood, ON | June 7, 2026 | June 7 – Living Better with Parkinson's Conference |
| Baton Rouge, LA | July 24, 2026 | July 25 – LSU Louisiana Parkinson's Conference |

## Tech Stack

- **Frontend**: React 19 + Vite (hosted on Firebase Hosting)
- **Backend**: Firebase Cloud Functions (Node.js 20) — proxies MailerLite API
- **Database**: Cloud Firestore — stores RSVP submissions
- **Email/CRM**: MailerLite — adds attendees to event-specific subscriber groups

---

## Local Development

### Prerequisites

- Node.js 20+
- [Firebase CLI](https://firebase.google.com/docs/cli): `npm install -g firebase-tools`

### 1. Clone and install

```bash
git clone https://github.com/stevesax1209-art/new-rsvp-app.git
cd new-rsvp-app
npm install
cd functions && npm install && cd ..
```

### 2. Configure environment variables

Copy the example file and fill in your Firebase project values:

```bash
cp .env.example .env.local
```

Open `.env.local` and fill in your values from the [Firebase Console](https://console.firebase.google.com/) → Project Settings → Your apps → SDK config:

```
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=rsvp.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=rsvp
VITE_FIREBASE_STORAGE_BUCKET=rsvp.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
```

### 3. Start dev server

```bash
npm run dev
```

The app runs at `http://localhost:5173`.

> **Note**: In development the `/api/rsvp` endpoint is not available unless you run Firebase Emulators (see below). The form will show a network error on submission locally.

### 4. Firebase Emulators (optional, for full local testing)

```bash
firebase emulators:start
```

Then run the Vite dev server separately. Emulators run on their own ports (Functions on 5001, Firestore on 8080).

---

## Deployment to Firebase

### Step 1 — Create Firebase project

1. Go to [console.firebase.google.com](https://console.firebase.google.com) and create a project named **`rsvp`**.
2. Enable **Firestore** (Native mode) and **Cloud Functions**.
3. Register a **Web app** inside the project and copy the SDK config values.

### Step 2 — Set your MailerLite API key

#### Where to put the MailerLite API key

The MailerLite API key is stored **server-side only** in Firebase Functions config — it is never exposed to the browser.

```bash
# Log in
firebase login

# Set the MailerLite API key (replace YOUR_KEY with your actual key)
firebase functions:config:set mailerlite.api_key="YOUR_MAILERLITE_API_KEY"
```

To find your MailerLite API key:
1. Log in to [app.mailerlite.com](https://app.mailerlite.com)
2. Go to **Integrations → Developer API**
3. Copy your API token

### Step 3 — Configure frontend environment

Create `.env.production` (or just `.env.local`) with your Firebase project values:

```
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=rsvp.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=rsvp
VITE_FIREBASE_STORAGE_BUCKET=rsvp.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

### Step 4 — Build and deploy

```bash
# Build the React app
npm run build

# Deploy everything (hosting + functions + firestore rules)
firebase deploy
```

Or deploy individual parts:

```bash
firebase deploy --only hosting
firebase deploy --only functions
firebase deploy --only firestore:rules
```

### Step 5 — Done!

Your app is live at:
```
https://rsvp.web.app
```
(or your custom domain if configured)

---

## MailerLite Group IDs

These are pre-configured in `src/events.js`:

| Event | Group ID |
|-------|----------|
| Cleveland – April 18 | `180251083036166100` |
| Phoenix – May 25 | `180251214422737963` |
| Collingwood – June 7 | `180251239077906214` |
| Baton Rouge – July 25 | `180251255757604767` |

---

## Project Structure

```
new-rsvp-app/
├── src/
│   ├── components/
│   │   ├── EventCard.jsx      # Event card with city image and RSVP button
│   │   ├── EventCard.css
│   │   ├── RSVPForm.jsx       # RSVP form (name, email, guests)
│   │   └── RSVPForm.css
│   ├── pages/
│   │   ├── Home.jsx           # Home page with event grid
│   │   ├── Home.css
│   │   ├── RSVPPage.jsx       # Individual event RSVP page
│   │   └── RSVPPage.css
│   ├── events.js              # Event configuration & MailerLite group IDs
│   ├── firebase.js            # Firebase client initialization
│   ├── App.jsx                # Router
│   └── main.jsx
├── functions/
│   └── index.js               # Firebase Cloud Function: POST /api/rsvp
├── firebase.json              # Firebase hosting + functions config
├── .firebaserc                # Firebase project alias
├── firestore.rules            # Firestore security rules
├── .env.example               # Environment variable template
└── vite.config.js
```

---

## Customisation

- **Event dates / details**: Edit `src/events.js`
- **City images**: Change the `imageUrl` values in `src/events.js` (Unsplash URLs)
- **Colors**: Change the `color` values (hex) in `src/events.js` per event
