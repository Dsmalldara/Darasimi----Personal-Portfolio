---
title: "Building an SSR Server for My Portfolio from Scratch: The Internals"
slug: "building-my-own-ssr"
date: "2025-12-08"
excerpt: "Deep dive into building a custom SSR server: hydration mechanics, data serialization, code splitting, and how to combine SSR with SPA navigation for the best of both worlds."
tags: ["React", "SSR", "TypeScript"]
---

# Building an SSR Server for My Portfolio from Scratch: The Internals

I decided to deep dive into how popular frameworks like Next.js do Server Side Rendering by building a custom SSR server for my portfolio

## Why?

Building a custom SSR server forces you to understand a lot of things going on under the hood as regards bundling of server and client components,hydration, various techniques used to code split these components and generally  deciding when you need  client-side navigation in a  SSR application.

This implementation is quite on a simple-average complexity level compared to standard framework implementations, I must say that. There isn't much of streaming, standard code splitting implementation. This is more of a barebones server.

I am going to  to talk about:

- My Server Setup
- How does SSR work
- How to setup a Server Side Rendered Application
- Why hydration is critical and how mismatches happen
- Code splitting in SSR applications
- Fetching Data for SSR, hydrating on client
- Deciding when you need client-side navigation and SPA feel in an SSR APP

## The Setup

The stack is simple:

- **Express** for the server
- **React** with `renderToString` for SSR
- **esbuild** for bundling
- **React Router** for routing

## How does SSR Work

Server Side Rendering is pretty much rendering HTML from the server. Having to make this work effectively is what makes SSR interesting. When HTML is served from the server, the client receives it and displays it immediately. Then JavaScript loads and React **hydrates** this HTML by attaching event listeners and making it interactive. One of the core **advantages** of rendering HTML files from the server is the **fast first paint** it offers compared to a purely client-side rendered page which has a lot of other processes it needs to fulfill. Web crawlers also easily read server-rendered files.

## How to Setup a Server-Side Rendered Application

For my setup, I setup an Express server that uses React-DOM's **`renderToString`** to render React components to HTML. I made use of esbuild for my bundling, it creates two bundles.
One that gets served from the server and a client bundle that gets sent to the browser to hydrate the page and make it interactive


```typescript
const app = express();
app.use('/dist', express.static('dist'));

const html = renderToString(
  React.createElement(StaticRouter, { location: req.url },
    React.createElement(App )
  )
);

res.send(`
  <!DOCTYPE html>
  <html lang="en" class="dark">
    <body>
      <div id="root">${html}</div>
      <script type="module" src="/dist/client.js"></script>
    </body>
  </html>
`);
```

my build.ts was setup similar to this

```typescript
import esbuild from "esbuild";


const buildServer = process.env.BUILD_SERVER === 'true';

//client build
const clientContext = await esbuild.context({
    entryPoints: ["src/client.tsx"],
    
    bundle: true,
    format: "esm",
    outdir: "dist",  // Required for splitting (can't use outfile)
    splitting: true, 
    minify: true,
    sourcemap: true,
});
// Only build server for production
// Only build server for production
if (buildServer) {
    await esbuild.build({
        entryPoints: ["src/framework/server.ts"],
        bundle: true,
        outfile:"dist/server.js",
        platform: "node",
        sourcemap: true,
        format: "esm",
        target: ["node20"],
        loader:{".ts": "ts", ".js": "js"},
        external: ["react", "react-dom", "express", "fs", "path", "marked", "gray-matter", "isomorphic-dompurify", "highlight.js"],
    }).catch(() => process.exit(1));
    console.log(" Server built for production");
}
```

With this setup, both my server and client use the built files from /dist in production.
In development, I use **tsx** to transpile on the fly. For production, I build with esbuild as shown above

This is pretty much the overall flow for a basic server side rendering setup.
For a production grade setup, you will probably want to do some code splitting to prevent bloats, I thought about using the **loadable/components** library for that but I ended up concluding this isnt what the  stress for a portfolio app, rightfullly so.

## Why hydration is critical and how mismatches happen

When the first paint is completed by SSR, the Client gets its bundled js file and tries to **hydrate** the page. Which is when  React compares the server-rendered HTML with what the Js bundle it has on the client-side. If they match, React just attaches event listeners and the page becomes interactive. If they don't match, React shows a warning and re-renders the entire tree.
This  causes visual flickers and forced rerenders with the client now being the source of truth

This is an example of my  setup for the hydration with react-dom

```typescript
import React from "react";
import { hydrateRoot } from "react-dom/client";

import { BrowserRouter } from "react-router-dom";
import App from "./pages/App";


hydrateRoot(
  document.getElementById("root")!,
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
```

Common causes of hydration mismatches are: using timestamps or random values during render, accessing browser-only APIs like window in components, or third-party scripts modifying the DOM before React hydrates.
A mental model to avoid this match is by keeping browser-only code out of the initial render we could do this by using useEffect or conditionally check for the browser environment with `typeof window !== 'undefined'`.

```typescript
// Bad - causes mismatch
   const timestamp = Date.now();
   
   // Good - only runs on client
   useEffect(() => {
     const timestamp = Date.now();
   }, []);
   ```

   for my blog contents, I read markdown files on the server using Node's fs module, parse them, and pass the data to the client through serialization to enable client side hydration.

```typescript
// Serialize blog data for client hydration
const blogDataScript = (blogData.posts || blogData.post) 
  ? `<script>window.__BLOG_DATA__ = ${JSON.stringify(blogData)};</script>`
  : '';

res.send(`
  <!DOCTYPE html>
  <html>
    <body>
      <div id="root">${html}</div>
      ${blogDataScript}
    </body>
  </html>
`);
```

On the client, I read `window.__BLOG_DATA__` during hydration to avoid refetching the same data.

## Code splitting in SSR applications

Code splitting is essential for production SSR apps to avoid large bundle sizes. Modern frameworks like Next.js and TanStack Start handle this automatically. For custom setups, libraries like **loadable/components** enable route-based and component-based code splitting.

For my portfolio, I kept things simple - the only dynamic import I used was for GSAP to avoid including it in the main bundle, however the difference is negligible as GSAP has a really small bundle:

```tsx
const gsapModule = await import('gsap');
```

## When Do You Need Client-Side Navigation in an SSR App?

After First paint with SSR, the page hydrates and subsequent navigations use 
client-side routing. With this you get the advantages of SSR and fast navigation of SPAs. For my blog pages which require asynchronous data fetching, I use React Router's Link and prefetch blog content on hover (onMouseEnter) to achieve this SPA feel.
On the blog post page, I use useEffect to check the cache first, then fetch if the data wasn't prefetched.

```
const preloadBlogPost = async (post: BlogPost) => {
  if (!postCache.has(post.slug)) {
    fetch(`/api/posts/${post.slug}`)
      .then(res => res.json())
      .then(data => postCache.set(post.slug, data.data)).catch(err => {
                    console.error('Failed to preload post:', err);                  
                  })
  }
}
```


## Conclusion

Building a custom SSR server gave me a much deeper understanding of what frameworks like Next.js handle automatically. The core bundling for server and client, rendering to HTML, serializing data, and hydrating on the client is quite  straightforward, but the details matter.

**Key takeaways:**

- Hydration is fragile: server and client must render identical data for a good experience
- Data serialization through `window.__DATA__` is simple but effective
- Prefetching on hover creates a smooth SPA experience after initial SSR
- For production, you'd want proper code splitting, streaming, and error boundaries

For a portfolio site, this barebones setup works great. For a complex app, I would  reach for Next.js or TanStack Start.

This implementation powers my portfolio you can check out the code on [GitHub](https://github.com/Dsmalldara/Darasimi----Personal-Portfolio).