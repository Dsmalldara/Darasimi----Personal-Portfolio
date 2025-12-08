import React from "react";
import Homepage from "./Homepage";
import Projects from "./Projects";
import About from "./About";
import Blog from "./Blog";
import BlogPost from "./BlogPost";


export interface RouteMeta {
    title: string;
    description: string;
    keywords?: string;
    ogImage?: string;
    canonical?: string;
}

export interface RouteConfig {
    path: string;
    component: React.ComponentType;
    meta: RouteMeta;
}

const BASE_URL = "https://darasimi.dev";

export const routes: RouteConfig[] = [
    {
        path: "/",
        component: Homepage,
        meta: {
            title: "Darasimi | Frontend Engineer",
            description: "Frontend engineer specializing in React, TypeScript, and Node.js. Building performant web experiences with custom solutions.",
            keywords: "darasimi, frontend engineer, react developer, typescript, node.js, portfolio",
            ogImage: `${BASE_URL}/og-home.png`,
            canonical: BASE_URL,
        }
    },
    {
        path: "/projects",
        component: Projects,
        meta: {
            title: "Projects | Darasimi",
            description: "A collection of projects including AI-powered tools, custom SSR server, and high-fidelity landing pages built with React and TypeScript.",
            keywords: "darasimi projects, web development, react projects, next.js, typescript",
            ogImage: `${BASE_URL}/og-projects.png`,
            canonical: `${BASE_URL}/projects`,
        }
    },
    {
        path: "/about",
        component: About,
        meta: {
            title: "About | Darasimi",
            description: "Frontend engineer passionate about performance, clean code, and building tools that solve real problems.",
            keywords: "about darasimi, frontend engineer, software developer, experience",
            ogImage: `${BASE_URL}/og-about.png`,
            canonical: `${BASE_URL}/about`,
        }
    },
    {
        path: "/blog",
        component: Blog,
        meta: {
            title: "Blog | Darasimi",
            description: "Articles on React, modern web development, and frontend architecture.",
            keywords: "darasimi blog, frontend blog, react tutorials, web development",
            ogImage: `${BASE_URL}/og-blog.png`,
            canonical: `${BASE_URL}/blog`,
        }
    },
    {
        path: "/blog/:slug",
        component: BlogPost,
        meta: {
            title: "Blog | Darasimi",
            description: "Blog post",
            canonical: `${BASE_URL}/blog`,
        }
    }
]

