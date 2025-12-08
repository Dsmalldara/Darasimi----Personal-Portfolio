import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import { useSSRData } from '../context/SSRDataContext';

// This will be injected by the server
declare global {
  interface Window {
    __BLOG_DATA__?: {
      posts?: Array<{
        slug: string;
        title: string;
        date: string;
        excerpt: string;
        tags: string[];
      }>;
      post?: {
        slug: string;
        title: string;
        date: string;
        excerpt: string;
        tags: string[];
        content: string;
      };
    };
  }
}

interface BlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  content?: string;
}
  
export const postCache = new Map<string, BlogPost>();
export const postsListCache = { data: null as any }; // Cache for blog list

// Prefetch blog posts list
export const prefetchBlogsList = async () => {
  if (!postsListCache.data) {
    try {
      const res = await fetch('/api/posts');
      const data = await res.json();
      postsListCache.data = data.data;
    } catch (err) {
      console.error('Failed to prefetch blog posts:', err);
    }
  }
};

function Blog() {
  const { data } = useSSRData();
  const [posts, setPosts] = useState(data.posts || []);
  const [isLoading, setIsLoading] = useState(!data.posts);

  // Fetch posts if not available from SSR context (client-side navigation)
  useEffect(() => {
    if (data.posts) {
      setPosts(data.posts);
      postsListCache.data = data.posts;
      setIsLoading(false);
      return;
    }

    // Check cache first
    if (postsListCache.data) {
      setPosts(postsListCache.data);
      setIsLoading(false);
      return;
    }

    // Fetch if not in context or cache 
    fetch('/api/posts')
      .then(res => res.json())
      .then(data => {
        setPosts(data.data);
        postsListCache.data = data.data;
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch posts:', err);
        setIsLoading(false);
      });
  }, [data.posts]);

  // Preload data on hover
  const preloadBlogPost = async (post: BlogPost) => {
     if (!postCache.has(post.slug)) {
                fetch(`/api/posts/${post.slug}`)
                  .then(res => res.json())
                  .then(data => postCache.set(post.slug, data.data)).catch(err => {
                    console.error('Failed to preload post:', err);                  
                  })
              }
      }
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-primary">
        <Header />
        <main className="max-w-3xl mx-auto px-6 pt-32 pb-20">
          <div className="animate-pulse space-y-8">
            <div>
              <div className="h-10 bg-secondary/50 rounded w-32 mb-2"></div>
              <div className="h-6 bg-secondary/50 rounded w-2/3"></div>
            </div>
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="border border-secondary/50 rounded-lg p-6 space-y-3">
                  <div className="h-4 bg-secondary/50 rounded w-1/4"></div>
                  <div className="h-6 bg-secondary/50 rounded w-1/2"></div>
                  <div className="h-4 bg-secondary/50 rounded w-full"></div>
                </div>
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary">
      <Header />

      <main className="max-w-3xl mx-auto px-6 pt-32 pb-20">
        <section className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Blog</h1>
          <p className="text-muted text-lg">
            Thoughts on frontend development, React internals, and building things from scratch.
          </p>
        </section>

        <div className="space-y-8">
          {posts.length === 0 ? (
            <p className="text-muted">No posts yet. Check back soon!</p>
          ) : (
            posts.map((post) => (
              <article key={post.slug} className="group">
          <Link 
            to={`/blog/${post.slug}`}
            onMouseEnter={() => preloadBlogPost(post)}
          className="block">
                  <div className="border border-secondary rounded-lg p-6 transition-all duration-300 hover:border-accent/50 hover:bg-secondary/30">
                    <div className="flex items-center gap-3 text-sm text-muted mb-3">
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
                    <h2 className="text-xl font-semibold mb-2 group-hover:text-accent transition-colors">
                      {post.title}
                    </h2>
                    <p className="text-muted leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>
                </Link>
              </article>
            ))
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Blog;
