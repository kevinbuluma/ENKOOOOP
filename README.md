# ENKOP — Real Estate

A cinematic, editorial real-estate website foundation for ENKOP, built with React, TypeScript and Vite. The visual direction is deliberately restrained: warm stone, ink, architectural imagery and generous typography.

## Run locally

```bash
npm install
npm run dev
```

The production build is checked with:

```bash
npm run build
npm run preview
```

## What is implemented

- Responsive homepage, properties catalogue, property details, About, Services, Insights, article and Contact routes.
- Skippable, session-only cinematic entry; reduced-motion support; scroll reveals; responsive full-screen navigation.
- Four-view cinematic hero with locally hosted, muted H.264 motion studies, automatic crossfades, slow camera drift, drag-to-pan scene framing and horizontal swipe scene navigation. Its public tour-control panel is intentionally hidden; the scene sequence continues in the background, and still posters remain the fallback for reduced-motion, data-saver and blocked-video playback. The panel can be restored by enabling `SHOW_PUBLIC_TOUR_PANEL` in `src/components/HeroScape.tsx`.
- URL-backed search/filtering for location, property type, status, bedrooms and maximum price, with recommended, featured, newest, price and area sorting.
- Local Buy/Rent/Invest/Sell preference, intent-aware property ordering, a saved shortlist and recently viewed residences. These preferences stay on the visitor’s device and require no login.
- Property gallery with fullscreen viewer, thumbnails, keyboard navigation and touch swipe.
- Property enquiry and viewing-request forms, contact form, client validation, honeypot and preview-mode rate limiting.
- Property-specific WhatsApp messages, optional click-to-call, viewing requests and stored enquiry metadata. The configured number is read from the environment.
- Admin-ready optional property fields for a cover image, film, social links, virtual tour, external listing, map and dedicated WhatsApp/phone contacts; related listings are selected by neighbourhood, type and price proximity.
- Dynamic page titles, descriptions, canonical URLs, Open Graph/Twitter tags and JSON-LD for the brand, property and article routes. Sample property details are marked `noindex`.
- Centralized property and editorial data, a Supabase-ready data boundary, SQL schema, row-level security policies and a private admin membership table.
- Local generated architectural photography stored in `public/images` so the preview does not depend on an external image CDN.

## Important content notes

The homes, asking prices, article copy and imagery in this preview are **illustrative placeholders**, not verified ENKOP inventory or photographs of ENKOP properties. The hero videos are smooth camera-move studies rendered from generated still images—not genuine property footage, a live 360° tour or Google Street View. Replace them with approved ENKOP photography/video or panorama assets when available. Sample properties are marked in the interface. Replace and approve content in `src/data/properties.ts`, `src/data/insights.ts` and `src/lib/config.ts` before publishing. Any domain or contact details configured for deployment must also be verified first.

`https://www.enkop.co.ke` is a provisional value in `.env.example`; replace it with ENKOP’s verified domain before launch. When `VITE_SITE_URL` is set, the build generates `robots.txt` and a sitemap for the static pages plus published Supabase properties/articles (when the public anon configuration is available). Sample listing routes are not added. No email or phone number is embedded by default—configure them before publishing.

## Deploy to Vercel

Current production deployment: <https://enkop-real-estate.vercel.app> (Vercel project: `enkop-real-estate`). Add ENKOP’s verified custom domain in the Vercel project when available.

This is a Vite single-page app. `vercel.json` adds the SPA rewrite needed for direct visits and refreshes on nested routes (for example, `/properties/the-oak-residence`). Vercel’s Vite configuration uses the built `dist` directory.

To deploy from a machine where you are authenticated to Vercel:

```bash
npx vercel login   # once, if needed
npx vercel         # preview deployment
npx vercel --prod  # production deployment
```

Or import the repository in the Vercel dashboard with **Framework Preset: Vite**, **Build Command: `npm run build`**, and **Output Directory: `dist`**. Set `VITE_SITE_URL`, Supabase public URL/anon key, and verified contact/WhatsApp variables in the Vercel project’s Environment Variables before promoting to production. Do not deploy the sample listings as real inventory.

## Supabase setup

1. Create a Supabase project and run `supabase/schema.sql` in its SQL editor.
2. Create an Auth user for each ENKOP administrator. Add the user's Auth UUID to `public.admins` from the SQL editor. No public admin signup is enabled.
3. Copy `.env.example` to `.env.local` and provide:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY` (the publishable/anon key only)
   - `VITE_SITE_URL` and verified ENKOP contact details
   - `VITE_WHATSAPP_NUMBER` in international digits, without `+`
4. Restart Vite after changing environment variables.

The browser data adapter reads only published properties and submits enquiry rows through the anon key under RLS. If Supabase is not configured, properties come from the clearly marked local sample dataset and enquiries are saved to this browser's local storage; they are **not delivered to ENKOP** in preview mode. Never put a Supabase `service_role` key in a `VITE_` variable or in the client bundle.

The schema is admin-ready, but this initial build intentionally does not ship a pretend admin login or property editor. Admin routes and authenticated CRUD can be added against the supplied `admins` table and RLS policies once ENKOP supplies its Supabase project and workflow. Public upload controls are not exposed. The Storage bucket is limited to common image MIME types and 10 MB per file, with writes restricted to admins.

For a production enquiry endpoint, put a CAPTCHA-enabled Supabase Edge Function or equivalent server route in front of public submissions and apply server-side rate limiting. The local preview rate limit is only a UX safeguard; it is not a production security boundary.

## Deployment / SEO notes

The SPA updates route metadata and canonical links after client-side navigation. For reliable dynamic Open Graph previews in social crawlers that do not execute JavaScript, deploy with prerendering, SSR or an edge metadata renderer for property/article URLs. Sitemap generation uses only the verified canonical host and published CMS records; configure `VITE_SITE_URL` (and the public Supabase URL/anon key if dynamic routes should be included) at build time.
