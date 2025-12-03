import React from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import ProjectCard from '../components/ProjectCard'
import { SocialLink, GitHubIcon, LinkedInIcon, TwitterIcon, EmailIcon } from '../components/SocialLinks'

function Homepage() {
  const projects = [
    {
      title: "Custom SSR Server",
      description: "The server behind this site. Think Next.js, but handcrafted with React, Express, and esbuild to understand how SSR actually works under the hood.",
      tags: ["React", "Express", "esbuild","React-router", "TypeScript"],
      year: "2025",
      status: "Live" as const,
      github: "https://github.com/Dsmalldara/Darasimi----Personal-Portfolio",
    },
    {  title: "Resume Keys",
      description: "A modular full-stack AI application that analyzes resumes against job descriptions using LLM pipelines to identify ATS keyword gaps, compute match scores, and generate tailored cover-letter drafts.",
      tags: ["Next.js", "TypeScript", "Node.js", "PostgreSQL", "OpenAI"],
      link: "https://resume-keys.vercel.app",
      year: "2025",
      status: "Live" as const,
       github: "https://github.com/Dsmalldara/resume-keyword-matcher1",
    },
    {
      title: "Nimbleminds AI",
      description: "A high-fidelity, visually rich landing page showcasing cutting-edge AI solutions",
      tags: ["Next.js", "TypeScript", "GSAP"],
      link: "https://nimbleminds.vercel.app",
      year: "2024",
      status: "Live" as const,
        github: "https://github.com/Dsmalldara/nimblemindsai",
    },

  ];

  return (
    <div className="min-h-screen bg-primary">
      <Header />
      
      {/* Hero Section */}
      <main className="max-w-4xl mx-auto px-6 pt-32 pb-20">
        <section className="mb-20">
          <p className="text-muted mb-4 animate-fade-in-up">Frontend Engineer</p>
          <h1 className="font-display text-5xl md:text-6xl font-bold mb-6 animate-fade-in-up animation-delay-100">
            Darasimi
          </h1>
          <div className="max-w-2xl">
            <p className="text-lg text-accent/80 leading-relaxed mb-8 font-light animate-fade-in-up animation-delay-200">
              I'm a developer passionate about building applications that make things 
              easier. I care about clean interfaces, smooth performance, and creating 
              experiences that feel effortless to use. My favorite work is the kind 
              that solves real problems — simple on the surface, solid underneath.
            </p>
          </div>
          
          {/* Social Links */}
          <div className="flex gap-4 animate-fade-in-up animation-delay-300">
            <SocialLink 
              href="https://github.com/Dsmalldara" 
              label="GitHub" 
              icon={<GitHubIcon />} 
            />
            <SocialLink 
              href="https://linkedin.com/in/dada-darasimi" 
              label="LinkedIn" 
              icon={<LinkedInIcon />} 
            />
            <SocialLink 
              href="https://twitter.com/Dsmalldara" 
              label="Twitter" 
              icon={<TwitterIcon />} 
            />
            <SocialLink 
              href="mailto:topedarasimi5@gmail.com" 
              label="Email" 
              icon={<EmailIcon />} 
            />
          </div>
        </section>

        {/* Featured Projects */}
        <section className="animate-fade-in-up animation-delay-500">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-semibold font-serif">Featured Projects</h2>
          </div>
          <div className="grid gap-4">
            {projects.map((project) => (
              <ProjectCard key={project.title} {...project} />
            ))}
          </div>
          
          {/* View all projects CTA */}
          <a 
            href="/projects" 
            className="group flex items-center justify-center gap-2 mt-10 py-4 border border-secondary hover:border-accent rounded-lg transition-all duration-300 hover:bg-secondary/30"
          >
            <span className="text-muted group-hover:text-accent transition-colors">View all projects</span>
            <svg 
              className="w-4 h-4 text-muted group-hover:text-accent group-hover:translate-x-1 transition-all" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default Homepage
