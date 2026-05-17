# Reserva Backoffice

Reserva Backoffice is the admin workspace for managing appointments, clients, checkout, payments, establishment settings, and operational reporting for the Reserva product.

## Stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS v4
- Radix UI / shadcn-style primitives
- Lucide React icons
- Recharts
- React PDF

## Visual Identity

| Token | Value |
|---|---|
| Primary | `#FFC900` |
| Primary hover | `#E6B500` |
| Text | `#0A0A0A` |
| Background | `#FFFFFF` |
| Soft surface | `#F7F7F3` |
| Font | Figtree |

## Data Direction

The customer-facing Reserva app keeps mock/domain data centralized under `lib/data/*` and exposes compatibility helpers through `lib/mock-data.ts`. The backoffice should follow the same direction as pages are refactored:

- Keep reusable mock records out of pages.
- Put domain types in `lib/types.ts`.
- Put table-like mock data in `lib/data/*`.
- Use `lib/mock-data.ts` as a re-export and query-helper hub.

## Setup

```bash
npm install
npm run dev
```

## Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm run start` | Run the production server |
| `npm run lint` | Run ESLint |

## Notes

This project uses npm and `package-lock.json`. Bun lockfiles and generated build output should not be kept as source files.
