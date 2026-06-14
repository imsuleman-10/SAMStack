import { Code2, Globe, Bot, ServerCog, Smartphone, Palette, BarChart3 } from "lucide-react";

export const services = [
  {
    id: "CUSTOM_SOFTWARE",
    slug: "custom-enterprise-software",
    title: "Custom Enterprise Software",
    subtitle: "Performance Core",
    description: "Low-latency systems architecture, dynamic database configurations, high-throughput backend services, and multithreaded logic engines tailored for scale.",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1200",
    icon: Code2,
    features: [
      "Microservices Architecture",
      "High-throughput APIs",
      "Database Optimization",
      "Legacy System Modernization"
    ],
    techStack: ["Node.js", "Go", "PostgreSQL", "Redis"]
  },
  {
    id: "SERVERLESS_WEB",
    slug: "web-serverless-apps",
    title: "Web & Serverless Apps",
    subtitle: "Sub-50ms Edge",
    description: "Ultra-fast Next.js App Router pages, server-side pre-rendered HTML, optimised cloud edge routes, and zero-cost scaling solutions.",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=1200",
    icon: Globe,
    features: [
      "Next.js App Router",
      "Edge Computing",
      "Zero-downtime Deployments",
      "Global CDN Distribution"
    ],
    techStack: ["Next.js", "React", "Vercel", "Tailwind CSS"]
  },
  {
    id: "AGENTIC_AI",
    slug: "agentic-ai-integrations",
    title: "Agentic AI & Integrations",
    subtitle: "Next-Gen Tech",
    description: "Custom AI autonomous workflow agents, semantic vector indexing, retrieval-augmented systems (RAG), and smart pipeline automations.",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1200",
    icon: Bot,
    features: [
      "Autonomous Agents",
      "RAG Implementations",
      "LLM Fine-tuning",
      "Workflow Automation"
    ],
    techStack: ["Python", "LangChain", "Pinecone", "OpenAI"]
  },
  {
    id: "DEVOPS_CLOUD",
    slug: "devops-cloud-architectures",
    title: "DevOps & Cloud Architectures",
    subtitle: "Zero Downtime",
    description: "Containerised docker registries, CI/CD pipeline automation, and cloud serverless monitoring for highly available production systems.",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200",
    icon: ServerCog,
    features: [
      "CI/CD Pipelines",
      "Infrastructure as Code",
      "Kubernetes Orchestration",
      "24/7 Telemetry"
    ],
    techStack: ["Docker", "Kubernetes", "AWS", "GitHub Actions"]
  },
  {
    id: "MOBILE_APPS",
    slug: "mobile-app-development",
    title: "Mobile App Development",
    subtitle: "Cross-Platform",
    description: "Native-performance iOS and Android applications built with React Native and Expo, featuring offline-first architecture and seamless backend integration.",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=1200",
    icon: Smartphone,
    features: [
      "React Native & Expo",
      "Offline-First Architecture",
      "Push Notifications & Deep Links",
      "App Store Deployment"
    ],
    techStack: ["React Native", "Expo", "Firebase", "TypeScript"]
  },
  {
    id: "UI_UX_DESIGN",
    slug: "ui-ux-design-systems",
    title: "UI/UX Design Systems",
    subtitle: "Pixel-Perfect",
    description: "Research-driven interface design, scalable design systems, interactive prototyping, and user experience audits that convert visitors into customers.",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=1200",
    icon: Palette,
    features: [
      "Design System Architecture",
      "Interactive Prototyping",
      "User Research & Testing",
      "Accessibility Compliance"
    ],
    techStack: ["Figma", "Framer", "Storybook", "Tailwind CSS"]
  },
  {
    id: "DATA_ANALYTICS",
    slug: "data-analytics-bi",
    title: "Data Analytics & BI",
    subtitle: "Actionable Insights",
    description: "Real-time data pipelines, interactive dashboards, predictive analytics models, and business intelligence systems that turn raw data into strategic decisions.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200",
    icon: BarChart3,
    features: [
      "Real-Time Dashboards",
      "ETL Pipeline Engineering",
      "Predictive Analytics",
      "Custom Reporting Engines"
    ],
    techStack: ["Python", "PostgreSQL", "Grafana", "Apache Kafka"]
  },
];
