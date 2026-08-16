# Taita Hills 2026 Family Safari Hub

A responsive family trip website for the Group Shah safari to Taita Hills Wildlife Sanctuary from 28–30 October 2026. The site keeps the itinerary, lodge information, room assignments, and payment requests in one easy-to-share place.

## Key Features

- Live countdown to departure
- Three-day safari itinerary and optional activities
- Salt Lick Safari Lodge and pool-access information
- Searchable room and traveler ledger
- Automatic 25% deposit calculations in USD and KSh
- Correct unpaid starting state for every traveler
- Copyable, personalized deposit reminder messages
- Downloadable original itinerary PDF

## Technology

- TanStack Start
- React 19 and TypeScript
- Vite and Tailwind CSS
- Lucide React icons
- Netlify hosting

## Run Locally

Install dependencies and start the development server:

```bash
pnpm install
pnpm dev
```

Open the local URL shown in the terminal.

## Updating Payments

Guest records live in `src/routes/index.tsx`. Change a traveler's `paidUsd` from `0` to the amount received. The summaries and payment status update automatically. The deposit percentage is controlled by `DEPOSIT_PERCENT` in the same file.
