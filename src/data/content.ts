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
      "Built a LangChain AI agent automating ROI processing -- authorization checks, compliance validation, and document generation -- cutting processing time by 60% and saving $20K/year.",
      "Engineered a containerized FastAPI service emulating authenticated RethinkBH sessions for real-time clinical record sync, bypassing 24-48hr public API latency.",
      "Developed a React + FastAPI NER pipeline with OpenAI for structured data extraction from therapist notes at 92% accuracy.",
    ],
  },
  {
    title: "Software Developer Intern",
    company: "AllCheer",
    location: "California, USA",
    period: "Jun 2024 - Dec 2024",
    bullets: [
      "Designed a Python logistics engine on Google Cloud with Google Maps APIs for multi-stop route optimization and large-scale staff scheduling.",
      "Led backend R&D and API schema design for ROI automation, prototyping in Make.com and translating to production service architecture.",
    ],
  },
];

export const projects: Project[] = [
  {
    title: "bedtime.ai",
    subtitle: "Multi-Modal AI Storytelling Platform",
    description:
      "Extended a multi-modal AI storytelling system that turns children's drawings into narrated stories. Four models orchestrated in a single pipeline: EfficientNet-B0 for sketch classification (~70% accuracy on children's drawings), OpenAI GPT for story generation, Coqui XTTS v2 for voice cloning, and a touch-enabled React drawing canvas. Includes 35 backend tests, 19 frontend tests, and Docker Compose deployment.",
    tags: [
      "React",
      "TypeScript",
      "FastAPI",
      "EfficientNet",
      "OpenAI GPT",
      "Voice Cloning",
      "Docker",
    ],
    highlights: [
      "4 models orchestrated in a single pipeline",
      "~70% classification accuracy on children's drawings",
      "35 backend + 19 frontend tests",
    ],
    githubUrl: "https://github.com/notquite28/bedtime.ai",
  },
  {
    title: "Abliteration for LFM2.5",
    description:
      "An interpretability project for LiquidAI/LFM2.5-1.2B-Instruct focused on refusal directions, weight orthogonalization, and inference-time intervention using manual PyTorch hooks. Reduced model refusal rate from 50% to ~37% without retraining.",
    tags: [
      "Research",
      "LLM Interpretability",
      "PyTorch",
      "Hugging Face",
      "Residual Streams",
      "Inference Intervention",
    ],
    compactTags: ["PyTorch", "Interpretability", "Research"],
    githubUrl: "https://github.com/notquite28/abliteration",
  },
  {
    title: "Nier Archive",
    subtitle: "Real-Time Collaborative Site",
    description:
      "A real-time collaborative site with live cursor sharing and viewer presence, built with SvelteKit 5, Cloudflare Workers, Durable Objects for stateful WebSocket connections, KV-backed analytics, and a custom Vite markdown pipeline for blog content.",
    tags: [
      "SvelteKit 5",
      "Cloudflare Workers",
      "Durable Objects",
      "WebSockets",
      "Cloudflare KV",
      "Vite Plugin",
    ],
    compactTags: ["SvelteKit", "Cloudflare", "WebSockets"],
    githubUrl: "https://github.com/notquite28/nier-archive-site",
  },
  {
    title: "Rethink BH Automation",
    subtitle: "FastAPI + Cloud Run Backend",
    description:
      "A containerized FastAPI service deployed on Google Cloud Run that emulates authenticated user sessions against RethinkBH endpoints to sync appointment and authorization data in real time, bypassing 24-48 hour API latency for downstream applications.",
    tags: [
      "System Architecture",
      "FastAPI",
      "Cloud Run",
      "Google Cloud",
      "DevOps",
      "Automation",
    ],
    compactTags: ["FastAPI", "Cloud Run", "Automation"],
    githubUrl: "",
  },
  {
    title: "LangChain RAG",
    description:
      "A production-ready RAG pipeline querying Star Wars scripts using LangChain, OpenAI embeddings, and Qdrant. Rebuilt from a tutorial with configurable data sources, prompt hardening against injection, source attribution, ~30x cost reduction (GPT-4o-mini), and a 28-test suite (13 mocked unit + 15 integration).",
    tags: ["AI/ML", "LangChain", "Vector Search", "RAG", "LLMs"],
    compactTags: ["RAG", "LangChain", "Qdrant"],
    githubUrl: "https://github.com/notquite28/langchain-rag",
  },
  {
    title: "Enterprise ROI System",
    subtitle: "AI Agent for Document Processing",
    description:
      "An LLM agent that automates HIPAA document release workflows -- orchestrating authorization checks, compliance validation, and document generation to reduce manual processing time by 60% and deliver $20K in annual savings.",
    tags: [
      "AI Agent",
      "Enterprise",
      "Automation",
      "Legal Tech",
      "Cost Optimization",
    ],
    compactTags: ["AI Agent", "Automation", "HIPAA"],
    githubUrl: "",
  },
];

export const skillCategories: SkillCategory[] = [
  {
    title: "Languages & Frameworks",
    skills: [
      "Python",
      "TypeScript",
      "JavaScript",
      "C#",
      ".NET",
      "FastAPI",
      "React",
      "Astro",
    ],
  },
  {
    title: "AI & Data Systems",
    skills: [
      "LangChain",
      "LangGraph",
      "PyTorch",
      "Vector Search",
      "Embeddings",
      "Prompt Engineering",
    ],
  },
  {
    title: "Infrastructure & Delivery",
    skills: [
      "Google Cloud",
      "Docker",
      "AWS",
      "REST APIs",
      "PostgreSQL",
      "SQL",
      "Git",
    ],
  },
];

export const profile = {
  name: "Arnav Panigrahi",
  role: "Software Developer",
  tagline:
    "Backend systems, fullstack applications, and AI/ML pipelines -- shipped to production.",
  location: "California, United States",
  email: "arnav.panigrahi@gmail.com",
  github: "https://github.com/notquite28",
  linkedin: "https://www.linkedin.com/in/arnav-panigrahi/",
  resume: "https://notquite28.github.io/resume/resumeml.pdf",
  image: "jelly.webp",
  about: [
    "I build backend services, fullstack applications, and AI/ML pipelines with a focus on shipping reliable software to production. My work spans FastAPI microservices on Google Cloud, LangChain-based AI agents for enterprise workflows, and multi-modal ML systems combining computer vision, NLP, and voice synthesis.",
    "At AllCheer, I've delivered measurable impact -- a 60% reduction in document processing time, $20K in annual cost savings, and 92% accuracy on an NER pipeline for clinical data extraction. I thrive at the intersection of backend engineering and applied AI, where system design meets real-world constraints.",
    "I hold an M.S. in Computer Science from UC Riverside, where I focused on distributed systems and machine learning. I'm currently seeking software engineering roles in backend systems and applied AI.",
  ],
  proof: [
    { value: "2.5+", label: "years shipping software" },
    { value: "60%", label: "reduction in processing time" },
    { value: "$20K", label: "annual savings delivered" },
  ],
} as const;
