# Next.js Perfect Score Configuration

![Lighthouse Perfect Score](lighthouse-perfect-score.png)

Production-tested Next.js configuration that achieves **100/100 Lighthouse scores** across Performance, Accessibility, Best Practices, and SEO. These settings are actively used on [knaru.com](https://knaru.com).

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Configuration Breakdown](#configuration-breakdown)
  - [Inline CSS](#1-inline-css)
  - [Aggressive Caching](#2-aggressive-caching)
  - [Package Optimization](#3-package-optimization)
  - [React Compiler](#4-react-compiler)
  - [Modular Imports](#5-modular-imports)
- [Code Patterns](#code-patterns)
  - [Font Loading](#font-loading)
  - [Image Optimization](#image-optimization)
  - [Third-Party Scripts](#third-party-scripts)
  - [ISR (Incremental Static Regeneration)](#isr-incremental-static-regeneration)
- [Why These Work](#why-these-work)
- [Live Demo](#live-demo)

---

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 16.x | App Router, Server Components |
| React | 19.x | React Compiler support |
| Vercel | - | Edge Network, Serverless |
| Bun | 1.x | Fast package management |

---

## Configuration Breakdown

### 1. Inline CSS

```javascript
experimental: {
  inlineCss: true,
}
```

**What it does:** Injects critical CSS directly into the HTML document instead of loading external CSS files.

**Why it matters:** External CSS files are render-blocking. The browser must download, parse, and apply CSS before painting anything. By inlining critical styles, we eliminate this network round-trip entirely.

**Impact:** First Contentful Paint (FCP) improved by ~150ms on mobile networks.

---

### 2. Aggressive Caching

```javascript
async headers() {
  return [
    {
      source: '/_next/static/:path*',
      headers: [
        { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
      ],
    },
    {
      source: '/images/:path*',
      headers: [
        { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
      ],
    },
  ]
}
```

**What it does:** Tells browsers to cache static assets (JS, CSS, images) for 1 year (31536000 seconds). The `immutable` directive indicates these files will never change.

**Why it matters:** Next.js generates hashed filenames for static assets (e.g., `page-a1b2c3.js`). When content changes, the filename changes. This means we can safely cache forever—if a user already has the file, they never need to download it again.

**Impact:** Repeat visitors experience near-instant page loads. Network requests for static assets drop to zero.

---

### 3. Package Optimization

```javascript
experimental: {
  optimizePackageImports: [
    'lucide-react',
    'date-fns',
    'react-hook-form',
    '@radix-ui/react-dialog',
    '@radix-ui/react-dropdown-menu',
  ],
}
```

**What it does:** Forces Next.js to analyze these packages and only include the code paths actually used.

**Why it matters:** Libraries like `lucide-react` contain 4000+ icons. Without optimization, importing one icon could pull in metadata for all icons. This setting ensures truly dead code is eliminated.

**Impact:** Initial JavaScript bundle reduced by 30-50KB depending on usage.

---

### 4. React Compiler

```javascript
reactCompiler: true,
```

**What it does:** Enables the new React 19 Compiler (formerly React Forget). It automatically adds `useMemo`, `useCallback`, and `React.memo` where beneficial.

**Why it matters:** Manual memoization is error-prone and often applied incorrectly. The compiler analyzes your code and applies optimizations that humans consistently miss.

**Impact:** Fewer unnecessary re-renders. Lower Total Blocking Time (TBT).

---

### 5. Modular Imports

```javascript
modularizeImports: {
  'lucide-react': {
    transform: 'lucide-react/dist/esm/icons/{{kebabCase member}}',
    skipDefaultConversion: false,
  },
  'date-fns': {
    transform: 'date-fns/{{member}}',
  },
},
```

**What it does:** Rewrites import statements to pull from specific file paths instead of the package root.

**Why it matters:** When you write `import { format } from 'date-fns'`, bundlers must parse the entire `date-fns` entry point to find `format`. This setting rewrites it to `import format from 'date-fns/format'`, skipping the entry point entirely.

**Impact:** Faster builds. Smaller bundles. Better tree-shaking.

---

## Code Patterns

Configuration alone is not enough. These code patterns complement the settings above.

### Font Loading

```tsx
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

export default function RootLayout({ children }) {
  return <body className={inter.className}>{children}</body>;
}
```

**Why:** The `display: 'swap'` property shows fallback text immediately while the web font loads. This prevents invisible text (FOIT) and reduces Cumulative Layout Shift (CLS). The `next/font` system also self-hosts fonts, eliminating external requests to Google Fonts.

---

### Image Optimization

```tsx
<Image 
  src="/hero.jpg" 
  alt="Hero"
  width={1200}
  height={600}
  priority
  sizes="(max-width: 768px) 100vw, 50vw"
/>
```

**Why:** The `priority` attribute tells Next.js to preload this image, critical for Largest Contentful Paint (LCP). Explicit `width` and `height` reserve space in the layout, preventing CLS. The `sizes` attribute helps the browser choose the smallest appropriate image variant.

---

### Third-Party Scripts

```tsx
import Script from 'next/script';

<Script 
  src="https://www.googletagmanager.com/gtag/js?id=GA_ID" 
  strategy="lazyOnload" 
/>
```

**Why:** Third-party scripts (analytics, ads, chat widgets) are notorious for blocking the main thread. The `lazyOnload` strategy defers loading until after the page is fully interactive. This protects your Interaction to Next Paint (INP) score.

---

### ISR (Incremental Static Regeneration)

```tsx
// app/posts/[id]/page.tsx
export const revalidate = 60;

export default async function Post({ params }) {
  const data = await getPost(params.id);
  return <PostContent data={data} />;
}
```

**Why:** Pure SSR requires a database query on every request, adding latency. Pure SSG serves stale content. ISR gives you both: instant static responses with background revalidation every 60 seconds. Users always get fast responses, and content stays fresh.

---

## Why These Work

The common thread across all optimizations:

1. **Eliminate network requests** - Inline CSS, aggressive caching, self-hosted fonts
2. **Reduce JavaScript** - Tree-shaking, modular imports, package optimization
3. **Don't block the main thread** - Lazy scripts, React Compiler, ISR

Lighthouse scores are not vanity metrics. They directly correlate with user experience and SEO rankings. Google uses Core Web Vitals as a ranking factor.

---

## Live Demo

These configurations are running in production:

**[https://knaru.com](https://knaru.com)**

Test it yourself:
1. Open Chrome DevTools
2. Go to Lighthouse tab
3. Run audit on Desktop

---

## License

MIT

---

<p align="center">
  Maintained by <a href="https://knaru.com">Knaru</a>
</p>
