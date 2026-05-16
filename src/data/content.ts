export interface Project {
  title: string;
  subtitle?: string;
  description: string;
  tags: string[];
  compactTags?: string[];
  highlights?: string[];
  link?: string;
  githubUrl?: string;
}

export interface SkillCategory {
  title: string;
  skills: string[];
}

export interface ProofItem {
  value: string;
  label: string;
}

export interface Experience {
  title: string;
  company: string;
  location: string;
  period: string;
  bullets: string[];
}

export const experiences: Experience[] = [
  {
    title: "Software Developer",
    company: "AllCheer",
    location: "California, USA",
    period: "Mar 2025 - Present",
    bullets: [
      "Built a LangChain AI agent for ROI workflows, automating authorization checks, compliance validation, and document generation while cutting processing time by 60% and saving $20K/year.",
      "Engineered a containerized FastAPI service that emulates authenticated RethinkBH sessions for real-time clinical record sync, bypassing 24-48-hour public API latency.",
      "Developed a React + FastAPI NER pipeline using OpenAI for structured data extraction from therapist notes at 92% accuracy.",
    ],
  },
  {
    title: "Software Developer Intern",
    company: "AllCheer",
    location: "California, USA",
    period: "Jun 2024 - Dec 2024",
    bullets: [
      "Designed a Python logistics engine on Google Cloud with Google Maps APIs for multi-stop route optimization and large-scale staff scheduling.",
      "Led backend R&D and API schema design for ROI automation, moving Make.com prototypes into production service architecture.",
    ],
  },
  {
    title: "Junior Software Developer",
    company: "Pinnacle Consulting LLC",
    location: "Bhubaneswar, India",
    period: "Jan 2022 - Aug 2023",
    bullets: [
      "Integrated ArcGIS Online with Angular and .NET for a $75M utility provider, enabling real-time infrastructure visualization and reducing oversight errors by 30%.",
      "Delivered three full-stack ERP systems with Node.js and SQL Server, implementing JWT-based RBAC and complex query workflows to automate invoicing.",
    ],
  },
];

export const projects: Project[] = [
  {
    title: "bedtime.ai",
    subtitle: "Multi-Modal AI Storytelling Platform",
    description:
      "A multi-modal AI pipeline that turns children's drawings into narrated bedtime stories. Combines EfficientNet-B0 sketch classification, GPT story generation, and Coqui XTTS voice cloning in a single orchestrated flow.",
    tags: ["React", "TypeScript", "FastAPI", "EfficientNet", "OpenAI GPT", "Voice Cloning", "Docker"],
    highlights: [
      "4 models orchestrated in a single pipeline",
      "~70% classification accuracy on children's drawings",
      "35 backend + 19 frontend tests",
    ],
    githubUrl: "https://github.com/notquite28/bedtime.ai",
  },
  {
    title: "Abliteration for LFM2.5",
    subtitle: "LLM Interpretability via Weight Orthogonalization",
    description:
      "An interpretability study on LiquidAI/LFM2.5 that identifies and removes refusal directions via weight orthogonalization. Reduced model refusal rate from 50% to ~37% without retraining.",
    tags: ["Research", "LLM Interpretability", "PyTorch", "Hugging Face", "Residual Streams", "Inference Intervention"],
    compactTags: ["PyTorch", "Interpretability", "Research"],
    highlights: [
      "Identified refusal directions in LFM2.5-1.2B residual streams",
      "Removed refusal behavior via weight orthogonalization — no retraining",
      "Cut refusal rate from 50% to ~37%",
    ],
    githubUrl: "https://github.com/notquite28/abliteration",
  },
  {
    title: "Nier Archive",
    subtitle: "Real-Time Collaborative Site",
    description:
      "A real-time collaborative site with live cursor sharing and viewer presence. Built on Cloudflare Workers, Durable Objects, and SvelteKit 5.",
    tags: ["SvelteKit 5", "Cloudflare Workers", "Durable Objects", "WebSockets", "Cloudflare KV", "Vite Plugin"],
    compactTags: ["SvelteKit", "Cloudflare", "WebSockets"],
    highlights: [
      "Live cursor sharing and viewer presence across sessions",
      "Stateful WebSocket coordination via Cloudflare Durable Objects",
      "Custom Vite markdown pipeline for blog content",
    ],
    githubUrl: "https://github.com/notquite28/nier-archive-site",
  },
  {
    title: "Yomiji",
    subtitle: "Offline-First WaniKani Android Client",
    description:
      "An offline-first WaniKani study app for Android with SQLite-backed incremental sync, review flows, and romaji-to-kana answer checking. Jest-covered domain logic.",
    tags: ["React Native", "Expo", "TypeScript", "SQLite", "WaniKani API", "Jest"],
    compactTags: ["React Native", "Expo", "SQLite"],
    highlights: [
      "SQLite incremental sync with pending-write queues",
      "Romaji-to-kana answer checking, offline-first",
      "Jest-covered domain logic for lessons and reviews",
    ],
    githubUrl: "https://github.com/notquite28/yomiji",
  },
  {
    title: "Rethink BH Automation",
    subtitle: "FastAPI + Cloud Run Backend",
    description:
      "A containerized FastAPI service deployed on Google Cloud Run that emulates authenticated user sessions against RethinkBH endpoints to sync appointment and authorization data in real time, bypassing 24-48-hour API latency for downstream applications.",
    tags: ["System Architecture", "FastAPI", "Cloud Run", "Google Cloud", "DevOps", "Automation"],
    compactTags: ["FastAPI", "Cloud Run", "Automation"],
    githubUrl: "",
  },
  {
    title: "LangChain RAG",
    description:
      "A production-ready RAG pipeline for querying Star Wars scripts with LangChain, OpenAI embeddings, and Qdrant. Expanded from a tutorial into a configurable system with prompt-injection hardening, source attribution, ~30x cost reduction using GPT-4o-mini, and a 28-test suite.",
    tags: ["AI/ML", "LangChain", "Vector Search", "RAG", "LLMs"],
    compactTags: ["RAG", "LangChain", "Qdrant"],
    githubUrl: "https://github.com/notquite28/langchain-rag",
  },
  {
    title: "Enterprise ROI System",
    subtitle: "AI Agent for Document Processing",
    description:
      "An LLM agent that automates HIPAA document release workflows, orchestrating authorization checks, compliance validation, and document generation to reduce manual processing time by 60% and deliver $20K in annual savings.",
    tags: ["AI Agent", "Enterprise", "Automation", "Legal Tech", "Cost Optimization"],
    compactTags: ["AI Agent", "Automation", "HIPAA"],
    githubUrl: "",
  },
];

export const skillCategories: SkillCategory[] = [
  {
    title: "Languages & Frameworks",
    skills: ["Python", "TypeScript", "JavaScript", "C#", ".NET", "FastAPI", "React", "Angular", "Astro"],
  },
  {
    title: "AI & Data Systems",
    skills: ["LangChain", "LangGraph", "PyTorch", "Vector Search", "Embeddings", "Prompt Engineering"],
  },
  {
    title: "Infrastructure & Delivery",
    skills: ["Google Cloud", "Docker", "AWS", "REST APIs", "Node.js", "SQL Server", "PostgreSQL", "SQL", "Git"],
  },
];

export const profile = {
  name: "Arnav Panigrahi",
  role: "Software Developer",
  tagline: "Backend systems, full-stack applications, and AI/ML pipelines shipped to production.",
  location: "California, United States",
  email: "arnav.panigrahi@gmail.com",
  github: "https://github.com/notquite28",
  linkedin: "https://www.linkedin.com/in/arnav-panigrahi/",
  resume: "https://notquite28.github.io/resume/resumeml.pdf",
  image: "jelly.webp",
  about: [
    "I write backend services and ML systems that run in production. Lately that's been FastAPI microservices, LangChain agents, and multi-modal models. I did my M.S. in CS at UC Riverside and I'm based in California.",
    "Outside of work, I play guitar, sink hours into JRPGs, and tinker with OSS and agentic harnesses. I collect keyboards — HHKB is the only correct answer — and use Mario Zechner's pi agentic harness. I'm slowly teaching myself Japanese.",
  ],
  proof: [
    { value: "3+", label: "years shipping software" },
    { value: "60%", label: "reduction in processing time" },
    { value: "$20K", label: "annual savings delivered" },
  ],
} as const;
