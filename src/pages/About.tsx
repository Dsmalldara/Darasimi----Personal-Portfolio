import React from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { SocialLink, GitHubIcon, LinkedInIcon, EmailIcon, TwitterIcon } from '../components/SocialLinks'

function About() {
  const experience = [
    {
      company: "Riverscope Technologies",
      role: "Frontend Developer",
      period: "June 2024 –  Oct 2025",
      description: "Built the frontend for a custom ERP platform. Lots of complex data flows, dashboards, and making sure things stay fast even with huge datasets."
    },
    {
      company: "Xapic Technologies",
      role: "Frontend Developer",
      period: "March 2024 – June 2024",
      description: "Built a student dashboard for EdulyncX . Learned a ton about performance optimization and shipping features that real users depend on."
    }
  ];



  return (
    <div className="min-h-screen bg-primary">
      <Header />
      
      <main className="max-w-4xl mx-auto px-6 pt-32 pb-20">
        <section className="mb-12">
          <h1 className="text-4xl font-bold mb-8">About Me</h1>
          
          <div className="prose prose-invert max-w-none">
            <p className="text-lg text-muted leading-relaxed mb-6">
              Hi, I'm Darasimi a frontend engineer who cares about the details. 
              I build interfaces that feel effortless to use, perform well under pressure, 
              and are built on code that's easy to maintain and extend.
            </p>
            

            <p className="text-lg text-muted leading-relaxed mb-6">
              I believe good software should be invisible. Users shouldn't think about 
              the interface, they should just accomplish what they came to do.
            </p>


            <h2 className="text-2xl font-semibold mt-12 mb-6">Experience</h2>
            <div className="space-y-6 mb-8">
              {experience.map((exp, index) => (
                <div 
                  key={exp.company} 
                  className="group relative p-6 bg-secondary/50 rounded-xl border border-white/5 hover:border-white/10 hover:bg-secondary/70 transition-all duration-300"
                >
                  {/* Timeline dot */}
                  <div className="absolute -left-[-0.2rem] top-8 w-2 h-2 bg-accent rounded-full hidden md:block" />
                  
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-3">
                    <div>
                      <h3 className="text-xl font-medium text-accent group-hover:text-white transition-colors">
                        {exp.role}
                      </h3>
                      <p className="text-muted">
                        @ {exp.company}
                      </p>
                    </div>
                    <span className="text-sm text-muted/70 font-mono bg-primary/50 px-3 py-1 rounded-full w-fit">
                      {exp.period}
                    </span>
                  </div>
                  
                  <p className="text-muted font-light leading-relaxed">
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>

            <h2 className="text-2xl font-semibold mt-12 mb-4">Let's Connect</h2>
            <p className="text-muted mb-6 font-light">
              I'm always open to discussing new projects, creative ideas, or opportunities.
            </p>
            
            <div className="flex gap-4">
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
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default About
