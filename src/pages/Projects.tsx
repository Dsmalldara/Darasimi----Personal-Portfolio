import React from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import ProjectCard from '../components/ProjectCard'

function Projects() {
  const projects = [
     {
      title: "Custom SSR Server",
      description: "A custom SSR server powering this portfolio. Built with React, Express, and esbuild to understand SSR internals — hydration, code splitting, and server rendering.",
      tags: ["React", "Express", "esbuild", "TypeScript"],
      year: "2025",
      status: "Live" as const,
      featured: true,
      github: "https://github.com/Dsmalldara/Darasimi----Personal-Portfolio",
    },
    {
      title: "Resume Keys",
      description: "A modular full-stack AI application that analyzes resumes against job descriptions using LLM pipelines to identify ATS keyword gaps, compute match scores, and generate tailored cover-letter drafts.",
      tags: ["Next.js", "TypeScript", "Node.js", "PostgreSQL", "OpenaAI"],
      link: "https://resume-keys.vercel.app",
      year: "2025",
      status: "Live" as const,
      image: "/resumekeys.png",
      featured: true,
      github: "https://github.com/Dsmalldara/resume-keyword-matcher1",
    },
    {
      title: "Nimbleminds AI",
      description: "A high-fidelity, visually rich landing page showcasing cutting-edge AI solutions aimed at high-growth startups and innovators. Features smooth animations and modern design.",
      tags: ["Next.js", "TypeScript", "Tailwind CSS", "GSAP", "Framer Motion"],
      link: "https://nimbleminds.vercel.app",
      year: "2024",
      status: "Live" as const,
      image: "/nimbleminds.png",
      featured: true,
      github: "https://github.com/Dsmalldara/nimblemindsai",
    },
    {
      title: "Whipevents",
      description: "An event management system with secure authentication, payment processing, role-based access control (RBAC), and a complete event publishing workflow.",
      tags: ["Next.js", "TypeScript", "MongoDB", "Mongoose", "Tailwind CSS"],
      link: "https://whipevents.vercel.app",
      year: "2024",
      status: "Live" as const,
      image: "/whipevents.png",
      featured: true,
      
    },
  
  ];

  // Split into featured and regular projects
  const featuredProjects = projects.filter(p => p.featured);
  const regularProjects = projects.filter(p => !p.featured);

  return (
    <div className="min-h-screen bg-primary">
      <Header />
      
      <main className="max-w-5xl mx-auto px-6 pt-32 pb-20">
        <section className="mb-16">
          <h1 className="text-4xl font-bold mb-4">Projects</h1>
          <p className="text-muted text-lg max-w-2xl">
            A selection of projects I've built — from AI-powered tools to event platforms. 
            Each one taught me something new.
          </p>
        </section>

        {/* Featured projects - larger cards with images */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {featuredProjects.map((project) => (
            <ProjectCard key={project.title} {...project} />
          ))}
        </div>

        {/* Regular projects - compact list */}
        {regularProjects.length > 0 && (
          <div className="grid gap-4">
            {regularProjects.map((project) => (
              <ProjectCard key={project.title} {...project} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}

export default Projects
