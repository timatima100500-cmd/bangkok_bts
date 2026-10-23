# Bangkok Metro Guide

English and Russian static website with a BTS fare calculator.

- English: `/`, `/stations/W1/`, `/guides/chatuchak-market/`.
- Russian: `/ru/`, `/ru/stations/W1/`, `/ru/guides/chatuchak-market/`.
- Routes between stations are calculated inside the home page tool; there are no route pages.
- Draft station and guide pages have `noindex` and are excluded from the sitemap.
- Fare data includes historical references and approximate estimates. They are not live operator quotes.

Use Node.js 24. Run `npm run lint`, `npm test`, and `npm run build`. The build creates the static `out/` directory and downloads the existing Google Fonts.

Cloudflare Pages settings are in [docs/DEPLOY.md](docs/DEPLOY.md). Canonical URLs use `https://btsguide.com` by default; `SITE_URL` can override the origin for a different environment.
