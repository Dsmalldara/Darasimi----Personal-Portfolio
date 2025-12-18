import React from 'react';
import express from 'express';
import { renderToString,  } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import App from "../pages/App";
import { routes, RouteMeta } from "../pages/router";
import { getAllPosts, getPostBySlug, BlogPost, BlogPostMeta } from "../lib/blog";

// Helper function to escape HTML special characters
const escapeHtml = (text: string): string => {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

const app = express();
app.use('/dist', express.static('dist'));
app.use(express.static('public')); // Serve images and static assets

// Serve resume.pdf from root
app.get('/resume.pdf', (req, res) => {
    res.sendFile('resume.pdf', { root: '.' });
});
app.get('/api/posts', (req,res)=>{
    const posts = getAllPosts();
    if(posts.length == 0){
        return res.status(400).json({data:[]})
    }
    return res.status(200).json({data:posts})
})
app.get('/api/posts/:slug',(req,res)=>{
  const { slug } = req.params;
  const post = getPostBySlug(slug);
  if(!post) {
    return res.status(404).json({data:null})
  }
  return res.status(200).json({data:post})
})

// Find meta for current route (with dynamic blog post handling)
const getMetaForPath = (path: string, blogPost?: BlogPost | null): RouteMeta => {
    // Handle dynamic blog post routes
    if (path.startsWith('/blog/') && blogPost) {
        return {
            title: `${blogPost.title} | Darasimi`,
            description: blogPost.excerpt,
            keywords: blogPost.tags.join(', '),
            canonical: `https://darasimi.dev/blog/${blogPost.slug}`,
        };
    }
    
    const route = routes.find(r => r.path === path);
    return route?.meta || {
        title: "Darasimi Portfolio",
        description: "Frontend Developer Portfolio"
    };
};

// Get blog data for a given path
const getBlogData = (path: string): { posts?: BlogPostMeta[]; post?: BlogPost | null } => {
    if (path === '/blog') {
        return { posts: getAllPosts() };
    }
    
    const blogPostMatch = path.match(/^\/blog\/(.+)$/);
    if (blogPostMatch) {
        const slug = blogPostMatch[1];
        return { post: getPostBySlug(slug) };
    }
    
    return {};
};

const renderApp = (req: any, res: any, next: any) => {
    // Skip if already handled by static middleware
    if (res.headersSent) return next();
    
    // Get blog data if on a blog route
    const blogData = getBlogData(req.path);
    const meta = getMetaForPath(req.path, blogData.post);
    
    try{
        const html = renderToString(
            React.createElement(StaticRouter, { location: req.url },
                React.createElement(App, { initialData: blogData })
            )
        );
        
        // Serialize blog data for client hydration
        const blogDataScript = (blogData.posts || blogData.post) 
            ? `<script>window.__BLOG_DATA__ = ${JSON.stringify(blogData)};</script>`
            : '';
        
         res.send(`
            <!DOCTYPE html>
            <html lang="en" class="dark">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>${escapeHtml(meta.title)}</title>
                <meta name="description" content="${escapeHtml(meta.description)}">
                <!-- Favicon -->
                <link rel="icon" href="/favicon.svg" type="image/svg+xml">
                <link rel="apple-touch-icon" href="/favicon.svg">
                ${meta.keywords ? `<meta name="keywords" content="${escapeHtml(meta.keywords)}">` : ''}
                ${meta.canonical ? `<link rel="canonical" href="${escapeHtml(meta.canonical)}">` : ''}
                <!-- Open Graph / Social -->
                <meta property="og:type" content="website">
                <meta property="og:url" content="${escapeHtml(meta.canonical || 'https://darasimi.dev')}">
                <meta property="og:title" content="${escapeHtml(meta.title)}">
                <meta property="og:description" content="${escapeHtml(meta.description)}">
                <meta property="og:site_name" content="Darasimi">
                ${meta.ogImage ? `<meta property="og:image" content="${escapeHtml(meta.ogImage)}">` : ''}
                <!-- Twitter -->
                <meta name="twitter:card" content="summary_large_image">
                <meta name="twitter:site" content="@daaboruemi">
                <meta name="twitter:title" content="${escapeHtml(meta.title)}">
                <meta name="twitter:description" content="${escapeHtml(meta.description)}">
                ${meta.ogImage ? `<meta name="twitter:image" content="${escapeHtml(meta.ogImage)}">` : ''}
                <link rel="stylesheet" href="/dist/styles.css">
            </head>
            <body>
                <div id="root">${html}</div>
                ${blogDataScript}
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


const PORT =  3000;
app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));