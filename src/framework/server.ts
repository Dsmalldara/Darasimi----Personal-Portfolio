import React from 'react';
import express from 'express';
import { renderToString,  } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import App from "../pages/App";
import { routes, RouteMeta } from "../pages/router";

const app = express();
app.use('/dist', express.static('dist'));
app.use(express.static('public')); // Serve images and static assets

// Serve resume.pdf from root
app.get('/resume.pdf', (req, res) => {
    res.sendFile('resume.pdf', { root: '.' });
});

// Find meta for current route
const getMetaForPath = (path: string): RouteMeta => {
    const route = routes.find(r => r.path === path);
    return route?.meta || {
        title: "Darasimi Portfolio",
        description: "Frontend Developer Portfolio"
    };
};

const renderApp = (req: any, res: any, next: any) => {
    // Skip if already handled by static middleware
    if (res.headersSent) return next();
    
    const meta = getMetaForPath(req.path);
    
    try{
        const html = renderToString(
            React.createElement(StaticRouter, { location: req.url },
                React.createElement(App)
            )
        );
         res.send(`
            <!DOCTYPE html>
            <html lang="en" class="dark">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>${meta.title}</title>
                <meta name="description" content="${meta.description}">
                ${meta.keywords ? `<meta name="keywords" content="${meta.keywords}">` : ''}
                ${meta.canonical ? `<link rel="canonical" href="${meta.canonical}">` : ''}
                
                <!-- Open Graph / Social -->
                <meta property="og:type" content="website">
                <meta property="og:url" content="${meta.canonical || 'https://darasimi.dev'}">
                <meta property="og:title" content="${meta.title}">
                <meta property="og:description" content="${meta.description}">
                <meta property="og:site_name" content="Darasimi">
                ${meta.ogImage ? `<meta property="og:image" content="${meta.ogImage}">` : ''}
                
                <!-- Twitter -->
                <meta name="twitter:card" content="summary_large_image">
                <meta name="twitter:site" content="@daaboruemi">
                <meta name="twitter:title" content="${meta.title}">
                <meta name="twitter:description" content="${meta.description}">
                ${meta.ogImage ? `<meta name="twitter:image" content="${meta.ogImage}">` : ''}
                
                <link rel="stylesheet" href="/dist/styles.css">
            </head>
            <body>
                <div id="root">${html}</div>
                <script type="module" src="/dist/client.js"></script>
            </body>
            </html>
  `);
    }
    catch(err){
        console.error("SSR Error:", err);
        res.status(500).send("An error occurred");
    }
};

app.use(renderApp);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));