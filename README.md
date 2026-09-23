# BreadBreakers

Next.js rebuild of [breadbreakerscommunity.org](https://www.breadbreakerscommunity.org/), deploying to Vercel.

## Setup

```bash
npm install
npm run dev
```

## RSVP email (Postmark)

When someone submits an event RSVP, the app saves it to Postgres and sends two emails via Postmark:

1. **Admin notification** → `POSTMARK_TO_EMAIL` (e.g. info@ forwarding to Sarah)
2. **Attendee confirmation** → the email they entered on the form, from `POSTMARK_FROM_EMAIL`

Add these to `.env.local` (and Vercel project settings for production):

```bash
POSTMARK_SERVER_TOKEN=your-server-token
POSTMARK_FROM_EMAIL=info@breadbreakerscommunity.org
POSTMARK_TO_EMAIL=info@breadbreakerscommunity.org
```

In Postmark, verify the **sender signature** for `POSTMARK_FROM_EMAIL` before testing. Without these variables, RSVPs still save but no email is sent.
