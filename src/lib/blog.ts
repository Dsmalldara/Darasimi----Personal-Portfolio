import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';
import DOMPurify from "isomorphic-dompurify";
import hljs from 'highlight.js';

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  content: string; // HTML content
}

export interface BlogPostMeta {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
}

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog')

// Configure marked with custom code renderer using highlight.js
const renderer = new marked.Renderer();

renderer.code = function({ text, lang }: { text: string; lang?: string }) {
  let highlighted = text;
  
  if (lang) {
    try {
      highlighted = hljs.highlight(text, { language: lang }).value;
    } catch (err) {
      highlighted = hljs.highlightAuto(text).value;
    }
  }
  
  return `<pre><code class="hljs language-${lang || ''}">${highlighted}</code></pre>`;
} as any;

marked.setOptions({ renderer });

export function getAllPosts():BlogPostMeta[]{
    if(!fs.existsSync(BLOG_DIR)){
        return []
    }

 const files = fs.readdirSync(BLOG_DIR).filter(f=> f.endsWith('.md'));
 
  const posts = files.map(filename => {
    const filePath = path.join(BLOG_DIR, filename);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { data } = matter(fileContent);
  

    return {
      slug: data.slug || filename.replace('.md', ''),
      title: data.title || 'Untitled',
      date: data.date || '',
      excerpt: data.excerpt || '',
      tags: data.tags || [],
    };
  });

  // Sort by date, newest first
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(slug: string): BlogPost | null {
  if (!fs.existsSync(BLOG_DIR)) {
    return null;
  }

  const files = fs.readdirSync(BLOG_DIR).filter(f => f.endsWith('.md'));

  for (const filename of files) {
    const filePath = path.join(BLOG_DIR, filename);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = matter(fileContent);
    const html = DOMPurify.sanitize(marked(content) as string);
    const postSlug = data.slug || filename.replace('.md', '');

    if (postSlug === slug) {
      return {
        slug: postSlug,
        title: data.title || 'Untitled',
        date: data.date || '',
        excerpt: data.excerpt || '',
        tags: data.tags || [],
        content: html,
      };
    }
  }

  return null;
}
