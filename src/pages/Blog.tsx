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

        <div className="grid gap-6">
          {posts.length === 0 ? (
            <p className="text-muted text-center py-12">No posts yet. Check back soon!</p>
          ) : (
            posts.map((post) => (
              <article key={post.slug} className="group">
                <Link 
                  to={`/blog/${post.slug}`}
                  onMouseEnter={() => preloadBlogPost(post)}
                  className="block h-full"
                >
                  <div className="h-full bg-white dark:bg-secondary/20 border-2 border-gray-200 dark:border-white rounded-xl p-6 sm:p-8 transition-all duration-300 hover:border-gray-300 dark:hover:border-white hover:shadow-md dark:hover:shadow-lg dark:hover:shadow-accent/10">
                    {/* Metadata */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 mb-4 pb-4 border-b border-gray-200 dark:border-secondary/30">
                      <time className="text-xs sm:text-sm font-medium text-gray-600 dark:text-muted/70 uppercase tracking-wide">
                        {new Date(post.date).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </time>
                      <div className="flex flex-wrap gap-2">
                        {post.tags.map(tag => (
                          <span 
                            key={tag} 
                            className="text-xs font-semibold px-2 py-1 bg-blue-50 dark:bg-accent/20 text-blue-600 dark:text-accent/90 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Title */}
                    <h2 className="text-lg sm:text-2xl font-bold mb-3 text-gray-900 dark:text-white group-hover:text-gray-900/60 dark:group-hover:text-white transition-all duration-200 line-clamp-2">
                      {post.title}
                    </h2>

                    {/* Excerpt */}
                    <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed line-clamp-3 mb-4">
                      {post.excerpt}
                    </p>

                    {/* Read More Link */}
                    <div className="flex items-center text-accent dark:text-cyan-400 font-semibold text-sm group-hover:gap-2 transition-all duration-200">
                      Read article
                      <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
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
