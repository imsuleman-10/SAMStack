import { Code2, Globe, Bot, ServerCog, Smartphone, Palette, BarChart3 } from "lucide-react";

export const services = [
  {
    id: "CUSTOM_SOFTWARE",
    slug: "custom-enterprise-software",
    title: "Custom Enterprise Software",
    subtitle: "Scale Without Limits",
    description: "We engineer resilient backends that prevent downtime and scale seamlessly. Stop losing revenue to system crashes; our low-latency architectures ensure your business operations remain uninterrupted, no matter the traffic.",
    image: "/images/img-servers.jpg",
    icon: Code2,
    features: [
      "Zero-Downtime Architecture",
      "High-throughput APIs",
      "Revenue-Protecting Reliability",
      "Legacy System Modernization"
    ],
    techStack: ["Node.js", "Go", "PostgreSQL", "Redis"]
  },
  {
    id: "SERVERLESS_WEB",
    slug: "web-serverless-apps",
    title: "Web & Serverless Apps",
    subtitle: "Dominate Search Rankings",
    description: "Your website is your best salesperson. We build ultra-fast, server-rendered applications optimized for zero-delay indexing and maximum SEO visibility. Higher Lighthouse scores mean lower bounce rates and more organic leads.",
    image: "/images/img-coding-laptop.jpg",
    icon: Globe,
    features: [
      "Technical SEO & Fast Indexing",
      "Sub-50ms Global Load Times",
      "Increased Organic Traffic",
      "Conversion-Optimized UI"
    ],
    techStack: ["Next.js", "React", "Vercel", "Tailwind CSS"]
  },
  {
    id: "AGENTIC_AI",
    slug: "agentic-ai-integrations",
    title: "Agentic AI & Automation",
    subtitle: "Reduce Operational Costs",
    description: "Replace manual, error-prone workflows with autonomous AI agents. By integrating custom Machine Learning models into your data pipelines, we dramatically reduce your overhead costs and save hundreds of hours of manual labor.",
    image: "/images/img-ai-tech.jpg",
    icon: Bot,
    features: [
      "Automated Data Classification",
      "Cost-Saving AI Workflows",
      "Smart Customer Support Agents",
      "Data-Driven Decision Making"
    ],
    techStack: ["Python", "LangChain", "Pinecone", "OpenAI"]
  },
  {
    id: "DEVOPS_CLOUD",
    slug: "devops-cloud-architectures",
    title: "DevOps & Cloud Architectures",
    subtitle: "Zero Deployment Risk",
    description: "Ship features faster without breaking production. Our automated CI/CD pipelines and proactive infrastructure monitoring mean you catch errors before your users do, protecting your brand reputation.",
    image: "/images/img-global-scale.jpg",
    icon: ServerCog,
    features: [
      "Automated Safe Deployments",
      "Proactive Error Monitoring",
      "Infrastructure Cost Optimization",
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
    image: "/images/img-mobile-dev.jpg",
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
    image: "/images/img-design-tools.jpg",
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
    image: "/images/img-analytics.jpg",
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
