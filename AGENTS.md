# Project Guide

## Overview

This is the Group Shah Taita Hills safari hub for 28–30 October 2026. It combines the trip itinerary, accommodation details, room assignments, and a per-traveler 25% deposit request ledger.

## Architecture

- `src/routes/index.tsx` contains the single-page React experience, guest data, calculations, filtering, and copyable deposit reminders.
- `src/styles.css` contains the full visual system, responsive layout, illustrations, and component styling.
- `src/routes/__root.tsx` defines the document shell and page metadata.
- `public/assets/taita-hills-itinerary.pdf` is the uploaded safari itinerary available for download.

## Technology

- TanStack Start and TanStack Router
- React 19 and TypeScript
- Tailwind CSS via Vite, with custom global CSS
- Lucide React icons
- Netlify deployment adapter

## Conventions

- Keep all payment arithmetic derived from the guest records rather than hard-coding summary totals.
- `paidUsd` is the source of truth for recorded payments; it remains `0` until money is received.
- `DEPOSIT_PERCENT` controls the requested deposit and currently equals `0.25`.
- KSh values use the organizer-provided conversion rate of 130 and are stored per guest to preserve the source sheet exactly.
- Use semantic HTML and preserve keyboard-visible, accessible controls.
- Components and types use PascalCase; variables and functions use camelCase.

## Important Decisions

- The site intentionally uses no database because payment updates are maintained directly in the guest list and deployed as a private family information page.
- Optional night drives and the Maasai village visit are shown separately and are not included in the ledger totals.
- The ledger distinguishes the full safari amount, deposit currently requested, and actual paid amount to avoid presenting requested deposits as collected money.
