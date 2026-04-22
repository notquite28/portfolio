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

export const projects: Project[] = [
  {
    title: "bedtime.ai",
    subtitle: "Multi-Modal AI Storytelling Platform",
    description:
      "A multi-modal AI storytelling system that turns children's drawings into narrated stories using EfficientNet-B0 for classification, Phi-3 or GPT for generation, and Coqui XTTS v2 for voice cloning.",
    tags: [
      "React",
      "FastAPI",
      "Phi-3",
      "EfficientNet",
      "Voice Cloning",
      "Docker",
    ],
    highlights: [
      "4 models orchestrated in a single pipeline",
      "Image classification, story generation, voice output",
    ],
    githubUrl: "https://github.com/notquite28/bedtime.ai",
  },
  {
    title: "Abliteration for LFM2.5",
    description:
      "An interpretability project for LiquidAI/LFM2.5-1.2B-Instruct focused on refusal directions, weight orthogonalization, and inference-time intervention using manual PyTorch hooks.",
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
      "A real-time collaborative site built with SvelteKit 5, Cloudflare Workers, Durable Objects, KV-backed analytics, and a custom Vite markdown pipeline.",
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
      "A FastAPI service that syncs Rethink BH appointment and authorization data to Supabase in real time using authenticated API extraction.",
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
      "A RAG pipeline using LangChain, OpenAI embeddings, and Qdrant for retrieval-augmented generation with prompt hardening, source attribution, and a full test suite.",
    tags: ["AI/ML", "LangChain", "Vector Search", "RAG", "LLMs"],
    compactTags: ["RAG", "LangChain", "Qdrant"],
    githubUrl: "https://github.com/notquite28/langchain-rag",
  },
  {
    title: "Enterprise ROI System",
    subtitle: "AI Agent for Document Processing",
    description:
      "An LLM agent that automates HIPAA document release workflows -- extracting, validating, and routing requests to reduce manual processing.",
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
    "Building backend systems, fullstack applications, and AI/ML pipelines.",
  location: "California, United States",
  email: "arnav.panigrahi@gmail.com",
  github: "https://github.com/notquite28",
  linkedin: "https://www.linkedin.com/in/arnav-panigrahi/",
  resume: "https://notquite28.github.io/resume/resumeml.pdf",
  image: "mumei.webp",
  about: [
    "Backend, fullstack, and AI/ML -- with a focus on shipping.",
    "Recent work includes RAG pipelines, LLM agents, REST APIs, and cloud deployments.",
    "M.S. in Computer Science from UC Riverside.",
  ],
  proof: [
    { value: "2.5+", label: "years shipping software" },
    { value: "60%", label: "reduction in processing time" },
    { value: "$20K", label: "annual savings delivered" },
  ],
} as const;
