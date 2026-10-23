# Bangkok Metro Guide

English and Russian transport website with a preserved BTS fare calculator.

- English: `/`, `/stations/W1`, `/routes/W1-E6`, `/guides/chatuchak-market`.
- Russian: `/ru`, `/ru/stations/W1`, `/ru/routes/W1-E6`, `/ru/guides/chatuchak-market`.
- `data/transit.ts` defines lines, operator types and separately ticketed systems.
- `data/metroStations.ts` keeps the legacy BTS data and explicit empty scaffolds for other networks. Empty scaffolds must not be used as a connected routing graph.
- `data/fares.ts` stores sourced and dated values; `lib/fareModel.ts` sums separately priced legs. An unknown leg leaves the total unknown. Historical values are not labelled current verified fares.
- The Green BTS calculator retains its previous amounts. Mixed Green/Gold trips now add separate tickets.
- Detail pages and sample guides are editorial previews with `noindex`. Remove that only after checking their content and fares.
- Set `SITE_URL` to the real public origin (for example, your HTTPS domain) to enable absolute canonical and language alternate links. No placeholder domain is emitted.
- Affiliate offers are not connected yet.

Use Node.js 24 for `npm test` (native TypeScript stripping and module hooks), `npm run lint`, and `npm run build` for checks. The build downloads the existing Google Fonts and needs network access.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Home pages are in `app/(en)/page.tsx` and `app/ru/page.tsx`. Shared page templates are in `components/pages/`, and the existing calculator is in `components/FareCalculator.tsx`.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
