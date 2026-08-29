export interface Student {
  id: string;
  registerNumber: string;
  name: string;
  department: string;
  course: string;
  year: string;
  section: string;
  attendance: number;
  cgpa: number;
  image: string;
  email?: string;
  phone?: string;
  dob?: string;
  gender?: string;
  address?: string;
  residenceType?: "Day Scholar" | "Hosteller";
  parentName?: string;
  parentContact?: string;
  parentOccupation?: string;
  school10th?: string;
  school12th?: string;
  skills: string[];
  topAchievement: string;
  achievementsList?: { title: string; event: string; date: string; rank: string }[];
  projectsList?: { title: string; tech: string[]; githubUrl: string; desc: string }[];
  certsList?: { title: string; org: string; date: string; verifyUrl: string }[];
}

export const mockStudents: Student[] = [
  {
    id: "1",
    registerNumber: "23AIM001",
    name: "Arun Kumar",
    department: "Artificial Intelligence & Data Science",
    course: "B.Tech AI & Data Science",
    year: "II",
    section: "A",
    attendance: 87,
    cgpa: 8.42,
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
    email: "arun.kumar@college.edu",
    phone: "+91 98451 23410",
    dob: "14 May 2005",
    gender: "Male",
    address: "No. 42, West Coast Road, Anna Nagar, Chennai - 600040",
    residenceType: "Day Scholar",
    parentName: "S. Kumaravel",
    parentContact: "+91 94440 98765",
    parentOccupation: "Senior Electrical Engineer",
    school10th: "St. John's Matriculation Higher Secondary (96.4%)",
    school12th: "DAV Senior Secondary School (96.0%)",
    skills: ["Python", "TensorFlow", "Deep Learning", "React", "TypeScript", "FastAPI"],
    topAchievement: "National Smart India Hackathon Winner (SIH 2025)",
    achievementsList: [
      { title: "Smart India Hackathon Winner", event: "National Grand Finale - Govt of India", date: "Jan 2025", rank: "1st Place (Gold)" },
      { title: "IIT Madras Shaastra Hackathon", event: "Shaastra Technical Fest", date: "Oct 2024", rank: "2nd Runner Up" },
      { title: "State Level Paper Presentation", event: "Emerging Trends in AI Conference", date: "Aug 2024", rank: "Best Paper Award" }
    ],
    projectsList: [
      { title: "HealthAI Diagnostics", tech: ["Python", "PyTorch", "FastAPI", "React"], githubUrl: "https://github.com/arun/health-ai", desc: "Automated pneumonia detection from chest X-rays using deep convolutional architectures." },
      { title: "SignBridge Translator", tech: ["TensorFlow.js", "MediaPipe", "WebSockets"], githubUrl: "https://github.com/arun/signbridge", desc: "Real-time bidirectional sign language translation to synthesized audio." },
      { title: "NeuroPulse MRI Segmentation", tech: ["3D U-Net", "Three.js", "Flask"], githubUrl: "https://github.com/arun/neuropulse", desc: "Volumetric segmentation of brain MRI scans with 3D web rendering." }
    ],
    certsList: [
      { title: "AWS Certified Machine Learning - Specialty", org: "Amazon Web Services", date: "Dec 2024", verifyUrl: "https://aws.amazon.com/verification" },
      { title: "Deep Learning Specialization", org: "DeepLearning.AI / Coursera", date: "Aug 2024", verifyUrl: "https://coursera.org/verify" },
      { title: "TensorFlow Developer Certificate", org: "Google Developers", date: "May 2024", verifyUrl: "https://google.com/certificates" }
    ]
  },
  {
    id: "2",
    registerNumber: "23AIM002",
    name: "Vignesh K",
    department: "Artificial Intelligence & Data Science",
    course: "B.Tech AI & Data Science",
    year: "II",
    section: "A",
    attendance: 68,
    cgpa: 7.45,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
    email: "vignesh.k@college.edu",
    phone: "+91 94432 87654",
    dob: "22 Sep 2005",
    gender: "Male",
    address: "Plot 18, Lake View Colony, Gandhi Road, Coimbatore - 641004",
    residenceType: "Hosteller",
    parentName: "M. Krishnan",
    parentContact: "+91 98421 11223",
    parentOccupation: "Branch Manager, State Bank of India",
    school10th: "Kendriya Vidyalaya (92.8%)",
    school12th: "SRV Matriculation Higher Secondary (91.2%)",
    skills: ["PyTorch", "Computer Vision", "OpenCV", "Flask", "Docker", "PostgreSQL"],
    topAchievement: "1st Runner Up - Tamil Nadu State AI Hackathon 2025",
    achievementsList: [
      { title: "Tamil Nadu State AI Hackathon", event: "TN AI Mission Grand Challenge", date: "Feb 2025", rank: "1st Runner Up" },
      { title: "Inter-College Code Sprint", event: "Technovate 2024", date: "Nov 2024", rank: "Top 5 Finalist" }
    ],
    projectsList: [
      { title: "Autonomous Drone Obstacle Detection", tech: ["YOLOv8", "ROS2", "Python"], githubUrl: "https://github.com/vignesh/drone-vision", desc: "Edge-computing drone obstacle detection algorithm with real-time avoidance." },
      { title: "Multilingual OCR Document Extractor", tech: ["Tesseract", "OpenCV", "Streamlit"], githubUrl: "https://github.com/vignesh/doc-ocr", desc: "Extracts tabular and handwritten data from damaged municipal documents." }
    ],
    certsList: [
      { title: "Computer Vision with OpenCV", org: "Coursera", date: "Jan 2025", verifyUrl: "https://coursera.org/verify" },
      { title: "Google Cloud Associate Cloud Engineer", org: "Google Cloud", date: "Sep 2024", verifyUrl: "https://cloud.google.com/certification" }
    ]
  },
  {
    id: "3",
    registerNumber: "23CSE045",
    name: "Sarah Jane",
    department: "Computer Science & Engineering",
    course: "B.Tech Computer Science",
    year: "III",
    section: "B",
    attendance: 93,
    cgpa: 9.12,
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80",
    email: "sarah.jane@college.edu",
    phone: "+91 97890 12345",
    dob: "08 Dec 2004",
    gender: "Female",
    address: "B-404, Green Meadows Apartments, OMR Road, Chennai - 600097",
    residenceType: "Day Scholar",
    parentName: "Dr. David Jane",
    parentContact: "+91 98409 87654",
    parentOccupation: "Chief Medical Officer, Apollo Hospitals",
    school10th: "National Public School (97.6%)",
    school12th: "Bala Vidya Mandir (98.2%)",
    skills: ["Java", "Spring Boot", "Kubernetes", "PostgreSQL", "Next.js", "System Design"],
    topAchievement: "Best Research Paper Award - IEEE ICET 2025",
    achievementsList: [
      { title: "IEEE ICET Best Paper Award", event: "International Conference on Emerging Tech", date: "Mar 2025", rank: "Best Student Paper" },
      { title: "ACM ICPC Regional Finalist", event: "Amritapuri Regional Contest", date: "Dec 2024", rank: "Rank #14" },
      { title: "Women in Tech Leadership Fellowship", event: "AnitaB.org Program", date: "Jul 2024", rank: "Fellow Award" }
    ],
    projectsList: [
      { title: "Distributed Consensus Cache", tech: ["Go", "Raft Protocol", "gRPC"], githubUrl: "https://github.com/sarah/distributed-cache", desc: "High-throughput replicated in-memory key-value store using Raft consensus." },
      { title: "FinSecure Payment Gateway", tech: ["Java", "Spring Cloud", "Kafka", "Postgres"], githubUrl: "https://github.com/sarah/finsecure", desc: "Idempotent financial ledger supporting 10,000 TPS with audit logging." }
    ],
    certsList: [
      { title: "AWS Certified Solutions Architect - Associate", org: "Amazon Web Services", date: "Feb 2025", verifyUrl: "https://aws.amazon.com/verification" },
      { title: "Certified Kubernetes Administrator (CKA)", org: "Linux Foundation / CNCF", date: "Nov 2024", verifyUrl: "https://cncf.io/certification" },
      { title: "Oracle Certified Professional: Java SE 17", org: "Oracle University", date: "May 2024", verifyUrl: "https://oracle.com/certview" }
    ]
  },
  {
    id: "4",
    registerNumber: "23ECE012",
    name: "Rahul Sharma",
    department: "Electronics & Communication",
    course: "B.Tech Electronics & Comm",
    year: "II",
    section: "C",
    attendance: 72,
    cgpa: 6.85,
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80",
    email: "rahul.sharma@college.edu",
    phone: "+91 98765 43210",
    dob: "19 Mar 2005",
    gender: "Male",
    address: "12/4, Cross Street, T. Nagar, Chennai - 600017",
    residenceType: "Hosteller",
    parentName: "Rajesh Sharma",
    parentContact: "+91 98402 34567",
    parentOccupation: "Businessman (Textiles)",
    school10th: "SBOA School & Junior College (88.4%)",
    school12th: "Chinmaya Vidyalaya (86.0%)",
    skills: ["Embedded C", "IoT Systems", "Arduino", "Raspberry Pi", "MATLAB", "VLSI"],
    topAchievement: "Finalist - National Robotics Challenge 2024",
    achievementsList: [
      { title: "National Robotics Challenge Finalist", event: "RoboCup India", date: "Oct 2024", rank: "Top 8 Finalist" },
      { title: "Hardware Hackathon 2nd Prize", event: "Circuits & Logic Fest", date: "Apr 2024", rank: "2nd Prize" }
    ],
    projectsList: [
      { title: "Smart Agriculture Telemetry Node", tech: ["ESP32", "LoRaWAN", "MQTT", "Grafana"], githubUrl: "https://github.com/rahul/smart-agri-lora", desc: "Long-range soil sensor network operating on solar energy with real-time moisture alerts." },
      { title: "Wearable ECG Telemetry Monitor", tech: ["Embedded C", "BLE 5.0", "Flutter"], githubUrl: "https://github.com/rahul/ecg-telemetry", desc: "Wearable low-power heart monitor streaming real-time ECG waveforms to mobile apps." }
    ],
    certsList: [
      { title: "Embedded Systems Specialist", org: "ARM University Program", date: "Jan 2025", verifyUrl: "https://arm.com/education" },
      { title: "Cisco Certified Network Associate (CCNA)", org: "Cisco Systems", date: "Sep 2024", verifyUrl: "https://cisco.com/verify" }
    ]
  }
];
