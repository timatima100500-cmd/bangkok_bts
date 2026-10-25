# Cloudflare Pages: static export

This repository builds a static Next.js site. Deployment is a separate owner action.

## Build settings

- Framework preset: **Next.js (Static HTML Export)**
- Build command: `npm run build`
- Build output directory: `out`
- Root directory: repository root
- Production branch: `main` (after the task branch is reviewed and merged)
- Environment variable: `NODE_VERSION=24` (also required by the native TypeScript test runner)
- Optional environment variable: `SITE_URL=https://btsguide.com`; this is already the metadata default.

The build writes `out/index.html`, `out/ru/index.html`, `out/sitemap.xml`, and `out/robots.txt`. No server runtime, middleware or API routes are used.

Before publishing, check the exported HTML and the canonical host. Draft pages carry `noindex` and are excluded from the sitemap. Connect the custom domain and search tools only after editorial review.

## Indexing release (owner-approved, 2026-10-25)

Station pages, existing guides and the `/stations/`, `/guides/`, `/fares/`, `/about/`, `/sources/` sections are now indexable in EN and RU. Fare accuracy labels remain independent of indexing. Following the owner's repeated instruction, all current markdown files have `verified: true`, `noindex: false` and `verified_on: 2026-10-25`. Technical slugs beginning with `_` remain excluded from the sitemap; error pages and legacy `/get-to/` aliases remain `noindex`.

Run `npm run lint`, `npm test`, `npm run build`, then `npm run test:export` before deploying. The export check confirms that every sitemap URL has an HTML file, `index, follow` and a matching canonical, and that home titles are not duplicated. The current sitemap contains 250 unique URLs.

Markdown guides are served at `/guides/[slug]/`; legacy `/get-to/[slug]/` aliases carry `noindex` and canonical links to `/guides/[slug]/`.

After publishing, inspect `/stations/BL01/` and `/ru/stations/BL01/` for `index, follow`, and check `/sitemap.xml` for the same URLs as the verified export. Production deployment requires an authenticated Cloudflare account and the existing Pages project; do not create a replacement project.

On 2026-10-25, `https://www.btsguide.com/stations/BL01/` returned a 301 redirect to `https://btsguide.com/stations/BL01/`. Preserve this Cloudflare configuration and recheck it after deployment. Pages `_redirects` does not support domain-level redirects.

References: [Cloudflare Pages static Next.js guide](https://developers.cloudflare.com/pages/framework-guides/nextjs/deploy-a-static-nextjs-site/), [Cloudflare build image and Node version](https://developers.cloudflare.com/pages/configuration/build-image/), [Next.js static exports](https://nextjs.org/docs/app/guides/static-exports).
