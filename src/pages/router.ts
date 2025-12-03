import React from "react";
import Homepage from "./Homepage";
import Projects from "./Projects";
import About from "./About";


export interface RouteMeta {
    title: string;
    description: string;
    keywords?: string;
    ogImage?: string;
}

export interface RouteConfig {
    path: string;
    component: React.ComponentType;
    meta: RouteMeta;
}

export const routes: RouteConfig[] = [
    {
        path: "/",
        component: Homepage,
        meta: {
            title: "Darasimi | Frontend Engineer",
            description: "Welcome to my portfolio. I'm a Frontend engineer specializing in React, Node.js, and TypeScript. Building beautiful digital experiences.",
            keywords: "software engineer,frontend,  developer, portfolio, react, node.js, typescript",
        }
    },
    {
        path: "/projects",
        component: Projects,
        meta: {
            title: "Projects | Dada Darasimi",
            description: "A collection of projects including AI-powered tools, event management systems, and high-fidelity landing pages.",
            keywords: "projects, portfolio, web development, react, next.js, typescript",
        }
    },
    {
        path: "/about",
        component: About,
        meta: {
            title: "About | Darasimi",
            description: "Learn more about me, my skills, and my journey as a software engineer.",
            keywords: "about, software engineer, skills, experience",
        }
    }
]

