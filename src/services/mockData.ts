export interface Achievement {
  id: string;
  title: string;
  organization: string;
  event: string;
  date: string;
  description: string;
  leadershipRole: string;
  position: string;
}

export interface Project {
  id: string;
  title: string;
  shortDescription: string;
  detailedDescription: string;
  technologies: string;
  role: string;
  githubUrl: string;
  demoUrl: string;
  image: string;
}

// In-memory mock data store
let achievements: Achievement[] = [
  {
    id: "1",
    title: "First Place - National Hackathon",
    organization: "TechCorp",
    event: "CodeFest 2025",
    date: "2025-08-15",
    description: "Developed an AI-powered accessibility tool for visually impaired users.",
    leadershipRole: "Team Lead",
    position: "Winner"
  }
];

let projects: Project[] = [
  {
    id: "1",
    title: "EduManage Portal",
    shortDescription: "A college management system",
    detailedDescription: "Built the frontend for a massive college management system.",
    technologies: "React, Tailwind, Framer Motion",
    role: "Frontend Developer",
    githubUrl: "https://github.com/vigneshk/edumanage",
    demoUrl: "https://edumanage.demo.com",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&q=80"
  }
];

// Achievement Service
export const achievementService = {
  getAll: () => Promise.resolve([...achievements]),
  add: (data: Omit<Achievement, "id">) => {
    const newAchievement = { ...data, id: Date.now().toString() };
    achievements = [...achievements, newAchievement];
    return Promise.resolve(newAchievement);
  },
  delete: (id: string) => {
    achievements = achievements.filter(a => a.id !== id);
    return Promise.resolve();
  }
};

// Project Service
export const projectService = {
  getAll: () => Promise.resolve([...projects]),
  add: (data: Omit<Project, "id">) => {
    const newProject = { ...data, id: Date.now().toString() };
    projects = [...projects, newProject];
    return Promise.resolve(newProject);
  },
  delete: (id: string) => {
    projects = projects.filter(p => p.id !== id);
    return Promise.resolve();
  }
};
