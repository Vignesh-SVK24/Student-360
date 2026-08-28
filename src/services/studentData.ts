import type {
  StudentFullProfile,
  AchievementItem,
  SkillItem,
  CertificateItem,
  ProjectItem,
  PersonalDetails,
  ParentDetails,
  ProfileLinks
} from '../types/student';

export const mockStudentsList: StudentFullProfile[] = [
  {
    id: "1",
    registerNumber: "23AIM001",
    name: "Arun Kumar",
    department: "Artificial Intelligence & Machine Learning",
    course: "B.Tech AI & ML",
    year: "II",
    section: "A",
    profileImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
    personal: {
      dob: "2005-04-12",
      gender: "Male",
      email: "arun.kumar23@college.edu",
      phone: "+91 98401 23456",
      address: "No. 42, West Coast Road, Anna Nagar, Chennai - 600040",
      residenceType: "Day Scholar"
    },
    parent: {
      name: "S. Kumaravel",
      relationship: "Father",
      contact: "+91 94440 98765",
      email: "kumaravel.s@gmail.com",
      occupation: "Senior Electrical Engineer"
    },
    academic: {
      school10th: "St. John's Matriculation Higher Secondary School",
      marks10th: "482 / 500",
      percentage10th: "96.4%",
      school12th: "DAV Senior Secondary School",
      marks12th: "576 / 600",
      percentage12th: "96.0%",
      cgpa: 8.42,
      arrears: 0,
      totalCredits: 164,
      earnedCredits: 82
    },
    links: {
      github: "https://github.com/arunkumar-aiml",
      linkedin: "https://linkedin.com/in/arunkumar-tech",
      portfolio: "https://arunkumar.dev",
      other: "https://huggingface.co/arunkumar"
    },
    overallAttendance: 87,
    achievements: [
      {
        id: "ach-1",
        title: "National Smart India Hackathon Winner",
        organization: "Ministry of Education, Govt. of India",
        event: "SIH 2025 Grand Finale",
        date: "2025-09-20",
        description: "Built an AI-driven smart drone crop disease detection system with 94% real-time diagnosis accuracy.",
        leadershipRole: "Team Lead",
        position: "1st Place (National Winner)"
      },
      {
        id: "ach-2",
        title: "Best Innovator Award",
        organization: "IEEE Computer Society Student Branch",
        event: "TechVision Summit 2025",
        date: "2025-03-14",
        description: "Recognized for developing low-latency edge AI models for hearing-impaired assistance systems.",
        leadershipRole: "Lead Researcher",
        position: "First Prize"
      },
      {
        id: "ach-3",
        title: "Inter-College Code Sprint Champion",
        organization: "IIT Madras Shaastra",
        event: "Shaastra Algorithmic Cup",
        date: "2025-01-08",
        description: "Ranked #1 among 300+ collegiate competitive programming participants.",
        leadershipRole: "Individual Participant",
        position: "Champion"
      }
    ],
    skills: [
      { id: "sk-1", name: "Python", category: "Programming", proficiency: "Expert" },
      { id: "sk-2", name: "TypeScript & React", category: "Programming", proficiency: "Advanced" },
      { id: "sk-3", name: "C++ (DSA)", category: "Programming", proficiency: "Advanced" },
      { id: "sk-4", name: "PyTorch & TensorFlow", category: "Technical", proficiency: "Advanced" },
      { id: "sk-5", name: "Computer Vision & YOLO", category: "Technical", proficiency: "Advanced" },
      { id: "sk-6", name: "Natural Language Processing", category: "Technical", proficiency: "Intermediate" },
      { id: "sk-7", name: "Docker & Containerization", category: "Tools", proficiency: "Intermediate" },
      { id: "sk-8", name: "Git & GitHub Actions", category: "Tools", proficiency: "Expert" },
      { id: "sk-9", name: "Linux & Bash Scripting", category: "Tools", proficiency: "Advanced" },
      { id: "sk-10", name: "Technical Team Leadership", category: "Soft Skills", proficiency: "Advanced" },
      { id: "sk-11", name: "Problem Solving & Agile", category: "Soft Skills", proficiency: "Expert" },
      { id: "sk-12", name: "Public Speaking & Pitching", category: "Soft Skills", proficiency: "Advanced" }
    ],
    certificates: [
      {
        id: "cert-1",
        title: "Deep Learning Specialization",
        organization: "DeepLearning.AI / Coursera",
        issueDate: "2025-05-18",
        certificateId: "DL-AI-883921",
        credentialUrl: "https://coursera.org/verify/specialization/sample",
        thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&auto=format&fit=crop&q=80"
      },
      {
        id: "cert-2",
        title: "AWS Certified Machine Learning - Specialty",
        organization: "Amazon Web Services",
        issueDate: "2025-07-22",
        certificateId: "AWS-MLS-49201",
        credentialUrl: "https://aws.amazon.com/verification",
        thumbnail: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500&auto=format&fit=crop&q=80"
      },
      {
        id: "cert-3",
        title: "Full Stack Web Development Professional",
        organization: "Meta / edX",
        issueDate: "2024-11-10",
        certificateId: "META-FS-10398",
        credentialUrl: "https://edx.org/verify",
        thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=500&auto=format&fit=crop&q=80"
      }
    ],
    projects: [
      {
        id: "proj-1",
        title: "AgroVision - Autonomous Drone Crop Health AI",
        shortDescription: "Edge AI multispectral drone analytics for early blight detection.",
        detailedDescription: "Designed an embedded computer vision pipeline using YOLOv8 and TensorRT running on Raspberry Pi and NVIDIA Jetson. Decreased manual inspection time by 75% for 50-acre farmlands with automatic GPS hotspot mapping.",
        technologies: ["Python", "PyTorch", "OpenCV", "FastAPI", "React", "Docker"],
        role: "Team Lead & ML Architect",
        startDate: "2025-06",
        endDate: "2025-09",
        githubUrl: "https://github.com/arunkumar-aiml/agrovision",
        demoUrl: "https://agrovision-demo.vercel.app",
        image: "https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=600&auto=format&fit=crop&q=80"
      },
      {
        id: "proj-2",
        title: "SignBridge - Real-Time Sign Language Translator",
        shortDescription: "Bi-directional Indian Sign Language (ISL) to speech converter.",
        detailedDescription: "Utilized MediaPipe landmark extraction coupled with an LSTM-Transformer model to interpret 120+ gestures with 93.6% accuracy under varying lighting conditions.",
        technologies: ["Python", "TensorFlow", "MediaPipe", "WebSockets", "Tailwind CSS"],
        role: "Full Stack ML Developer",
        startDate: "2025-01",
        endDate: "2025-04",
        githubUrl: "https://github.com/arunkumar-aiml/signbridge",
        demoUrl: "https://signbridge.dev",
        image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&auto=format&fit=crop&q=80"
      },
      {
        id: "proj-3",
        title: "NeuroPulse - Brain Tumor Segmentation System",
        shortDescription: "3D U-Net MRI medical imaging web application for radiologists.",
        detailedDescription: "Implemented deep volumetric segmentation on BraTS datasets, providing interactive 3D volume rendering and DICOM header visualization directly in the browser.",
        technologies: ["Python", "3D U-Net", "Nibabel", "Three.js", "Flask"],
        role: "Computer Vision Researcher",
        startDate: "2024-09",
        endDate: "2024-12",
        githubUrl: "https://github.com/arunkumar-aiml/neuropulse",
        demoUrl: "https://neuropulse-ai.org",
        image: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=600&auto=format&fit=crop&q=80"
      }
    ],
    remarks: [
      {
        id: "rem-1",
        facultyName: "Dr. K. Senthil Nathan",
        facultyDesignation: "Head of Department - AI & ML",
        date: "2025-10-15",
        grade: "Excellent",
        remark: "Arun has exhibited stellar performance in both academics and co-curricular projects. His contribution to the SIH hackathon brought high laurels to our department."
      },
      {
        id: "rem-2",
        facultyName: "Prof. Priya Ramanathan",
        facultyDesignation: "Faculty Advisor & Assistant Professor",
        date: "2025-08-28",
        grade: "Excellent",
        remark: "Consistent attendance at 87%, meticulous laboratory documentation, and exemplary peer mentorship in Machine Learning lab."
      },
      {
        id: "rem-3",
        facultyName: "Dr. R. Arvind",
        facultyDesignation: "Professor - Data Structures & Algorithms",
        date: "2025-03-10",
        grade: "Good",
        remark: "Active participant in code sprint challenges and exhibits sharp algorithmic intuition."
      }
    ],
    attendanceBySemester: {
      3: [
        { code: "23AI301", subject: "Discrete Mathematics & Linear Algebra", total: 48, present: 43, absent: 5, percentage: 89.5 },
        { code: "23AI302", subject: "Data Structures & Algorithms", total: 60, present: 54, absent: 6, percentage: 90.0 },
        { code: "23AI303", subject: "Database Management Systems", total: 52, present: 45, absent: 7, percentage: 86.5 },
        { code: "23AI304", subject: "Fundamentals of Machine Learning", total: 56, present: 50, absent: 6, percentage: 89.2 },
        { code: "23AI305", subject: "Operating Systems & System Programming", total: 46, present: 38, absent: 8, percentage: 82.6 },
        { code: "23AI306", subject: "Machine Learning Laboratory", total: 36, present: 33, absent: 3, percentage: 91.6 }
      ],
      2: [
        { code: "23AI201", subject: "Python Programming for AI", total: 50, present: 44, absent: 6, percentage: 88.0 },
        { code: "23AI202", subject: "Digital Principles & Computer Org", total: 45, present: 38, absent: 7, percentage: 84.4 },
        { code: "23AI203", subject: "Probability, Statistics & Queueing", total: 52, present: 46, absent: 6, percentage: 88.4 },
        { code: "23AI204", subject: "Object Oriented Programming (Java)", total: 48, present: 42, absent: 6, percentage: 87.5 }
      ],
      1: [
        { code: "23AI101", subject: "Engineering Mathematics - I", total: 54, present: 48, absent: 6, percentage: 88.8 },
        { code: "23AI102", subject: "Engineering Physics", total: 48, present: 41, absent: 7, percentage: 85.4 },
        { code: "23AI103", subject: "Problem Solving with C", total: 56, present: 52, absent: 4, percentage: 92.8 },
        { code: "23AI104", subject: "Technical English & Communication", total: 40, present: 36, absent: 4, percentage: 90.0 }
      ]
    }
  }
];

let activeStudent: StudentFullProfile = JSON.parse(JSON.stringify(mockStudentsList[0]));

export const studentAuthService = {
  login: async (identifier: string, pass: string): Promise<{ success: boolean; student?: StudentFullProfile; error?: string }> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    const trimmed = identifier.trim().toLowerCase();
    const found = mockStudentsList.find(
      s => s.registerNumber.toLowerCase() === trimmed || s.personal.email.toLowerCase() === trimmed
    );
    if (found) {
      activeStudent = JSON.parse(JSON.stringify(found));
      localStorage.setItem("edumanage_student_session", JSON.stringify(activeStudent));
      return { success: true, student: activeStudent };
    }
    if (trimmed === "23aim001" || trimmed === "student" || trimmed.includes("arun") || trimmed.includes("vignesh")) {
      activeStudent = JSON.parse(JSON.stringify(mockStudentsList[0]));
      localStorage.setItem("edumanage_student_session", JSON.stringify(activeStudent));
      return { success: true, student: activeStudent };
    }
    if (pass.length < 3) {
      return { success: false, error: "Password must be at least 3 characters long." };
    }
    activeStudent = JSON.parse(JSON.stringify(mockStudentsList[0]));
    localStorage.setItem("edumanage_student_session", JSON.stringify(activeStudent));
    return { success: true, student: activeStudent };
  },
  logout: async () => {
    localStorage.removeItem("edumanage_student_session");
  },
  getCurrentStudent: (): StudentFullProfile => {
    const saved = localStorage.getItem("edumanage_student_session");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return activeStudent;
      }
    }
    return activeStudent;
  }
};

export const studentService = {
  getProfile: async (): Promise<StudentFullProfile> => {
    return Promise.resolve(studentAuthService.getCurrentStudent());
  },
  updatePersonal: async (data: Partial<PersonalDetails>): Promise<StudentFullProfile> => {
    const current = studentAuthService.getCurrentStudent();
    current.personal = { ...current.personal, ...data };
    localStorage.setItem("edumanage_student_session", JSON.stringify(current));
    activeStudent = current;
    return Promise.resolve(current);
  },
  updateParent: async (data: Partial<ParentDetails>): Promise<StudentFullProfile> => {
    const current = studentAuthService.getCurrentStudent();
    current.parent = { ...current.parent, ...data };
    localStorage.setItem("edumanage_student_session", JSON.stringify(current));
    activeStudent = current;
    return Promise.resolve(current);
  },
  updateLinks: async (data: Partial<ProfileLinks>): Promise<StudentFullProfile> => {
    const current = studentAuthService.getCurrentStudent();
    current.links = { ...current.links, ...data };
    localStorage.setItem("edumanage_student_session", JSON.stringify(current));
    activeStudent = current;
    return Promise.resolve(current);
  },
  updateProfilePhoto: async (newImageUrl: string): Promise<StudentFullProfile> => {
    const current = studentAuthService.getCurrentStudent();
    current.profileImage = newImageUrl;
    localStorage.setItem("edumanage_student_session", JSON.stringify(current));
    activeStudent = current;
    return Promise.resolve(current);
  }
};

export const achievementService = {
  getAll: async (): Promise<AchievementItem[]> => {
    return Promise.resolve(studentAuthService.getCurrentStudent().achievements);
  },
  add: async (item: Omit<AchievementItem, "id">): Promise<AchievementItem> => {
    const current = studentAuthService.getCurrentStudent();
    const newItem: AchievementItem = { ...item, id: "ach-" + Date.now() };
    current.achievements.unshift(newItem);
    localStorage.setItem("edumanage_student_session", JSON.stringify(current));
    return Promise.resolve(newItem);
  },
  update: async (id: string, updated: Partial<AchievementItem>): Promise<AchievementItem> => {
    const current = studentAuthService.getCurrentStudent();
    const idx = current.achievements.findIndex(a => a.id === id);
    if (idx !== -1) {
      current.achievements[idx] = { ...current.achievements[idx], ...updated };
      localStorage.setItem("edumanage_student_session", JSON.stringify(current));
      return Promise.resolve(current.achievements[idx]);
    }
    throw new Error("Not found");
  },
  delete: async (id: string): Promise<void> => {
    const current = studentAuthService.getCurrentStudent();
    current.achievements = current.achievements.filter(a => a.id !== id);
    localStorage.setItem("edumanage_student_session", JSON.stringify(current));
    return Promise.resolve();
  }
};

export const skillService = {
  getAll: async (): Promise<SkillItem[]> => {
    return Promise.resolve(studentAuthService.getCurrentStudent().skills);
  },
  add: async (item: Omit<SkillItem, "id">): Promise<SkillItem> => {
    const current = studentAuthService.getCurrentStudent();
    const newItem: SkillItem = { ...item, id: "sk-" + Date.now() };
    current.skills.push(newItem);
    localStorage.setItem("edumanage_student_session", JSON.stringify(current));
    return Promise.resolve(newItem);
  },
  update: async (id: string, updated: Partial<SkillItem>): Promise<SkillItem> => {
    const current = studentAuthService.getCurrentStudent();
    const idx = current.skills.findIndex(s => s.id === id);
    if (idx !== -1) {
      current.skills[idx] = { ...current.skills[idx], ...updated };
      localStorage.setItem("edumanage_student_session", JSON.stringify(current));
      return Promise.resolve(current.skills[idx]);
    }
    throw new Error("Not found");
  },
  delete: async (id: string): Promise<void> => {
    const current = studentAuthService.getCurrentStudent();
    current.skills = current.skills.filter(s => s.id !== id);
    localStorage.setItem("edumanage_student_session", JSON.stringify(current));
    return Promise.resolve();
  }
};

export const certificateService = {
  getAll: async (): Promise<CertificateItem[]> => {
    return Promise.resolve(studentAuthService.getCurrentStudent().certificates);
  },
  add: async (item: Omit<CertificateItem, "id">): Promise<CertificateItem> => {
    const current = studentAuthService.getCurrentStudent();
    const newItem: CertificateItem = { ...item, id: "cert-" + Date.now() };
    current.certificates.unshift(newItem);
    localStorage.setItem("edumanage_student_session", JSON.stringify(current));
    return Promise.resolve(newItem);
  },
  delete: async (id: string): Promise<void> => {
    const current = studentAuthService.getCurrentStudent();
    current.certificates = current.certificates.filter(c => c.id !== id);
    localStorage.setItem("edumanage_student_session", JSON.stringify(current));
    return Promise.resolve();
  }
};

export const projectService = {
  getAll: async (): Promise<ProjectItem[]> => {
    return Promise.resolve(studentAuthService.getCurrentStudent().projects);
  },
  add: async (item: Omit<ProjectItem, "id">): Promise<ProjectItem> => {
    const current = studentAuthService.getCurrentStudent();
    const newItem: ProjectItem = { ...item, id: "proj-" + Date.now() };
    current.projects.unshift(newItem);
    localStorage.setItem("edumanage_student_session", JSON.stringify(current));
    return Promise.resolve(newItem);
  },
  delete: async (id: string): Promise<void> => {
    const current = studentAuthService.getCurrentStudent();
    current.projects = current.projects.filter(p => p.id !== id);
    localStorage.setItem("edumanage_student_session", JSON.stringify(current));
    return Promise.resolve();
  }
};
