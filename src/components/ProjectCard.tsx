import React from "react";

interface ProjectCardProps {
  title: string;
  description: string;
  tags: string[];
  link?: string;
  year: string;
  status?: "WIP" | "Live";
  image?: string;
  featured?: boolean;
  github?: string;
}

function ProjectCard({ title, description, tags, link, year, status, image, featured, github }: ProjectCardProps) {
  // Featured card with large image
  if (featured && image) {
    return (
      <div className="group overflow-hidden rounded-2xl border border-secondary hover:border-muted/50 transition-all duration-500 bg-secondary/30">
        {/* Image container - clickable to live site */}
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="block relative overflow-hidden aspect-[16/9]"
        >
          <img 
            src={image} 
            alt={title}
            className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
          
          {/* Status badge */}
          {status && (
            <span className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm ${
              status === "WIP" 
                ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30" 
                : "bg-green-500/20 text-green-400 border border-green-500/30"
            }`}>
              {status}
            </span>
          )}
        </a>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-2xl font-semibold group-hover:text-accent transition-colors duration-300">
              {title}
            </h3>
            <span className="text-sm text-muted font-mono">{year}</span>
          </div>
          
          <p className="text-muted mb-5 leading-relaxed">
            {description}
          </p>
          
          <div className="flex flex-wrap gap-2 mb-5">
            {tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-3 py-1.5 bg-primary/80 text-muted rounded-full border border-secondary/50"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Links */}
          <div className="flex items-center gap-4">
            {
              link && (
                <a 
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-muted hover:text-accent transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              <span className="text-sm">Live</span>
            </a>
              )
            }
            
            {github && (
              <a 
                href={github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-muted hover:text-accent transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z" />
                </svg>
                <span className="text-sm">Code</span>
              </a>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Standard card (no image or not featured)
  return (
    <div className="group p-6 border border-secondary hover:border-muted/50 rounded-xl transition-all duration-300 hover:bg-secondary/30">
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-xl font-semibold group-hover:text-accent transition-colors">
          {title}
        </h3>
        <div className="flex items-center gap-3 text-sm text-muted">
          {status && (
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
              status === "WIP" 
                ? "bg-yellow-500/20 text-yellow-400" 
                : "bg-green-500/20 text-green-400"
            }`}>
              {status}
            </span>
          )}
          <span className="font-mono">{year}</span>
        </div>
      </div>
      <p className="text-muted mb-4 leading-relaxed">
        {description}
      </p>
      <div className="flex flex-wrap gap-2 mb-4">
        {tags.map((tag) => (
          <span
            key={tag}
            className="text-xs px-2.5 py-1 bg-primary/80 text-muted rounded-full border border-secondary/50"
          >
            {tag}
          </span>
        ))}
      </div>
      
      {/* Links */}
      <div className="flex items-center gap-4">
       {
        link && (
           <a 
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-muted hover:text-accent transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          <span className="text-sm">Live</span>
        </a>
        )
       }
        
        {github && (
          <a 
            href={github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-muted hover:text-accent transition-colors"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z" />
            </svg>
            <span className="text-sm">Code</span>
          </a>
        )}
      </div>
    </div>
  );
}

export default ProjectCard;
