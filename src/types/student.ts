export interface PersonalDetails {
  dob: string;
  gender: string;
  email: string;
  phone: string;
  address: string;
  residenceType: "Day Scholar" | "Hosteller";
}

export interface ParentDetails {
  name: string;
  relationship: string;
  contact: string;
  email: string;
  occupation: string;
}

export interface AcademicDetails {
  school10th: string;
  marks10th: string;
  percentage10th: string;
  school12th: string;
  marks12th: string;
  percentage12th: string;
  cgpa: number;
  arrears: number;
  totalCredits: number;
  earnedCredits: number;
}

export interface ProfileLinks {
  github: string;
  linkedin: string;
  portfolio: string;
  other?: string;
}

export interface AchievementItem {
  id: string;
  title: string;
  organization: string;
  event: string;
  date: string;
  description: string;
  leadershipRole: string;
  position: string;
}

export type SkillCategory = "Programming" | "Technical" | "Tools" | "Soft Skills";
export type SkillProficiency = "Beginner" | "Intermediate" | "Advanced" | "Expert";

export interface SkillItem {
  id: string;
  name: string;
  category: SkillCategory;
  proficiency: SkillProficiency;
}

export interface CertificateItem {
  id: string;
  title: string;
  organization: string;
  issueDate: string;
  certificateId: string;
  credentialUrl?: string;
  thumbnail: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  shortDescription: string;
  detailedDescription: string;
  technologies: string[];
  role: string;
  startDate?: string;
  endDate?: string;
  githubUrl: string;
  demoUrl: string;
  image: string;
}

export interface FacultyRemarkItem {
  id: string;
  facultyName: string;
  facultyDesignation: string;
  date: string;
  grade: "Poor" | "Average" | "Better" | "Good" | "Excellent";
  remark: string;
}

export interface SubjectAttendance {
  code: string;
  subject: string;
  total: number;
  present: number;
  absent: number;
  od?: number;
  percentage: number;
}

export interface StudentFullProfile {
  id: string;
  registerNumber: string;
  name: string;
  department: string;
  course: string;
  year: string;
  section: string;
  profileImage: string;
  personal: PersonalDetails;
  parent: ParentDetails;
  academic: AcademicDetails;
  links: ProfileLinks;
  overallAttendance: number;
  achievements: AchievementItem[];
  skills: SkillItem[];
  certificates: CertificateItem[];
  projects: ProjectItem[];
  remarks: FacultyRemarkItem[];
  attendanceBySemester: Record<number, SubjectAttendance[]>;
}
