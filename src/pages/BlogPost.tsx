import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link, useParams } from 'react-router-dom';
import { postCache } from './Blog';
import { useSSRData } from '../context/SSRDataContext';

interface BlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  content?: string;
}

function BlogPost() {
  const { slug } = useParams();
  const { data } = useSSRData();
  
  // Initialize with SSR data if available
  const [post, setPost] = useState<BlogPost | undefined>(data.post || undefined);
  const [isLoading, setIsLoading] = useState(!data.post);

  // Check cache or fetch on client-side navigation
  useEffect(() => {
    // If we already have the post from SSR, we're done
    if (post) {
      setIsLoading(false);
      return;
    }

    // Check cache first
    if (slug) {
      const cachedPost = postCache.get(slug);
      if (cachedPost) {
        setPost(cachedPost);
        setIsLoading(false);
        return;
      }

      // Fetch from API if not in cache
      fetch(`/api/posts/${slug}`)
        .then(res => res.json())
        .then(data => {
          setPost(data.data);
          setIsLoading(false);
        })
        .catch(err => {
          console.error('Failed to fetch post:', err);
          setIsLoading(false);
        });
    }
  }, [slug, post]);

  if (!slug) {
    return null;
  }

  // Show loading state while fetching
  if (isLoading) {
    return (
      <div className="min-h-screen bg-primary">
        <Header />
        <main className="max-w-3xl mx-auto px-6 pt-32 pb-20">
          <div className="animate-pulse">
            <div className="h-8 bg-secondary/50 rounded w-32 mb-12"></div>
            <div className="h-12 bg-secondary/50 rounded w-3/4 mb-4"></div>
            <div className="h-6 bg-secondary/50 rounded w-1/2 mb-12"></div>
            <div className="space-y-4">
              <div className="h-4 bg-secondary/50 rounded"></div>
              <div className="h-4 bg-secondary/50 rounded w-5/6"></div>
              <div className="h-4 bg-secondary/50 rounded w-4/6"></div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Post not found after loading
  if (!post) {
    return (
      <div className="min-h-screen bg-primary">
        <Header />
        <main className="max-w-3xl mx-auto px-6 pt-32 pb-20">
          <h1 className="text-4xl font-bold mb-4">Post Not Found</h1>
          <p className="text-muted mb-8">The post "{slug}" doesn't exist.</p>
          <Link to="/blog" className="text-accent hover:underline">← Back to blog</Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary">
      <Header />

      <main className="max-w-3xl mx-auto px-6 pt-32 pb-20">
        {/* Back link */}
        <Link 
          to="/blog" 
          className="inline-flex items-center gap-2 text-muted hover:text-accent transition-colors mb-8"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to blog
        </Link>

        <article>
          {/* Header */}
          <header className="mb-12">
            <div className="flex items-center gap-3 text-sm text-muted mb-4">
              <time>{new Date(post.date).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</time>
              <span>•</span>
              <div className="flex gap-2">
                {post.tags.map(tag => (
                  <span key={tag} className="text-accent/70">{tag}</span>
                ))}
              </div>
            </div>
           
          </header>

          {/* Content */}
          <div 
            className="prose dark:prose-invert max-w-none font-sans
              prose-headings:font-sans prose-headings:font-bold prose-headings:text-black dark:prose-headings:text-white
              prose-h1:text-2xl sm:prose-h1:text-4xl prose-h1:mb-8 prose-h1:mt-0
              prose-h2:text-xl sm:prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:border-b prose-h2:border-gray-300 dark:prose-h2:border-gray-700 prose-h2:pb-3
              prose-h3:text-lg sm:prose-h3:text-2xl prose-h3:mt-10 prose-h3:mb-4 prose-h3:text-gray-700 dark:prose-h3:text-gray-100
              prose-p:text-base sm:prose-p:text-lg prose-p:text-gray-800 dark:prose-p:text-gray-200 prose-p:leading-loose prose-p:my-6
              prose-a:text-blue-600 dark:prose-a:text-cyan-400 prose-a:underline prose-a:underline-offset-4 hover:prose-a:text-blue-700 dark:hover:prose-a:text-cyan-300
              prose-strong:text-black dark:prose-strong:text-white prose-strong:font-bold
              prose-em:italic prose-em:text-gray-800 dark:prose-em:text-gray-200
              prose-code:before:content-none prose-code:after:content-none
              prose-pre:my-8 prose-pre:overflow-x-auto
              prose-blockquote:border-l-4 prose-blockquote:border-blue-400 dark:prose-blockquote:border-cyan-400/30 prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-gray-700 dark:prose-blockquote:text-gray-300 prose-blockquote:my-6
              prose-ul:text-base sm:prose-ul:text-lg prose-ol:text-base sm:prose-ol:text-lg prose-ul:space-y-3 prose-ol:space-y-3 prose-ul:my-6 prose-ol:my-6
              prose-li:text-gray-800 dark:prose-li:text-gray-200 prose-li:leading-relaxed prose-li:marker:text-gray-600 dark:prose-li:marker:text-gray-400
              prose-img:rounded-lg prose-img:my-8
              prose-hr:border-gray-300 dark:prose-hr:border-gray-800 prose-hr:my-8"
            dangerouslySetInnerHTML={{ __html: post.content || '' }}
          />
        </article>
      </main>

      <Footer />
    </div>
  );
}

export default BlogPost;
