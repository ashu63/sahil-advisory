// Runs once in the browser before the app hydrates. This is where Next.js
// wants client-side analytics initialised (15.3+).
//
// PostHog is loaded through our own domain (/ingest, see next.config.ts) so
// ad blockers that list posthog.com do not drop the events, and so the
// cookie is first-party.
import posthog from 'posthog-js'

const token = process.env.NEXT_PUBLIC_POSTHOG_KEY
if (token) {
  posthog.init(token, {
    api_host: '/ingest',
    ui_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.posthog.com',
    defaults: '2026-05-30',
    // Anonymous visitors do not get a person profile until they identify or
    // convert; this keeps PostHog inside its free tier much longer.
    person_profiles: 'identified_only',
    capture_pageview: true,
    capture_pageleave: true,
    // Session recordings are opt-in per deployment; Clarity already covers it.
    disable_session_recording: process.env.NEXT_PUBLIC_POSTHOG_RECORD !== '1',
  })
}
