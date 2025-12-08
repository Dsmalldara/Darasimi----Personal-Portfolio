import React, { createContext, useContext, ReactNode } from 'react';

interface BlogPostMeta {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
}

interface BlogPost extends BlogPostMeta {
  content: string;
}

interface SSRData {
  posts?: BlogPostMeta[];
  post?: BlogPost | null;
}

interface SSRDataContextValue {
  data: SSRData;
}

const SSRDataContext = createContext<SSRDataContextValue>({ data: {} });

export function SSRDataProvider({ 
  children, 
  initialData 
}: { 
  children: ReactNode; 
  initialData?: SSRData;
}) {
  // On server: use initialData passed as prop
  // On client: use initialData from prop (hydration) or window.__BLOG_DATA__
  const data = initialData || (typeof window !== 'undefined' ? window.__BLOG_DATA__ : {}) || {};
  
  return (
    <SSRDataContext.Provider value={{ data }}>
      {children}
    </SSRDataContext.Provider>
  );
}

export function useSSRData() {
  return useContext(SSRDataContext);
}
