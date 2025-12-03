# darasimi-ssr

A minimal SSR framework. React, Express, esbuild. No magic.

---

## Overview

Custom server-side rendering engine powering [darasimi.dev](https://darasimi.dev).

Built for control over the rendering pipeline — routing, meta tags, code splitting, hydration — without the abstractions of Next.js or Remix.

## Stack

| | |
|-|-|
| React 19 | UI + hydration |
| Express 5 | Server |
| esbuild | Bundler (ESM, splitting) |
| React Router 7 | Routing |
| Tailwind | Styles |
| GSAP | Animations (dynamic import) |

## Architecture

```
Request
   ↓
Express (server.ts)
   ↓
renderToString(<App />)
   ↓
HTML with meta tags
   ↓
Browser renders immediately
   ↓
client.js loads
   ↓
hydrateRoot() attaches listeners
   ↓
Interactive
```

## Structure

```
src/
├── framework/
│   ├── server.ts      # SSR server
│   └── build.ts       # esbuild config
├── pages/             # Routes
├── components/        # UI
├── context/           # State (theme)
└── client.tsx         # Hydration entry
```

## Usage

```bash
pnpm install
pnpm dev        # development
pnpm build      # production build
pnpm start      # production server
```

## Implementation Details

**Hydration safety** — Browser APIs (`localStorage`, `window`) are accessed in `useEffect` only, never during render. Prevents mismatch between server and client output.

**Code splitting** — esbuild configured with `splitting: true` and ESM format. GSAP loads as a separate chunk on demand.

**Meta tags** — Injected per-route at render time. No client-side helmet needed.

**Theme** — Persisted to localStorage, applied via class on `<html>`. Default set server-side to prevent flash.

