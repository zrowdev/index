# Zrow beta waitlist site

This package contains the Next.js app for the Zrow beta waitlist.

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment

Copy `.env.example` to `.env.local` and set:

- `BLOB_READ_WRITE_TOKEN` — Vercel Blob read/write token used to store waitlist submissions
- `WAITLIST_SIGNING_SECRET` — secret used to derive stable waitlist record IDs

## Verification

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

## Production preview

```bash
npm run build
npm run start
```

## Deployment

Deploy the `index/` app to Vercel and add the same environment variables in the project settings.
