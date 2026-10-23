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

References: [Cloudflare Pages static Next.js guide](https://developers.cloudflare.com/pages/framework-guides/nextjs/deploy-a-static-nextjs-site/), [Cloudflare build image and Node version](https://developers.cloudflare.com/pages/configuration/build-image/), [Next.js static exports](https://nextjs.org/docs/app/guides/static-exports).
