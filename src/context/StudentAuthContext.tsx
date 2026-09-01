import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { authApi, studentApi, tokenStorage, type UserSession } from "../services/apiClient";
import type { StudentFullProfile } from "../types/student";

export const DEFAULT_EMPTY_STUDENT: StudentFullProfile = {
  id: "1",
  registerNumber: "",
  name: "",
  department: "Artificial Intelligence & Data Science",
  course: "B.Tech AI & Data Science",
  year: "II",
  section: "A",
  profileImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
  personal: {
    dob: "2005-05-14",
    gender: "Male",
    email: "",
    phone: "",
    address: "",
    residenceType: "Day Scholar",
  },
  parent: {
    name: "",
    relationship: "Father",
    contact: "",
    email: "",
    occupation: "",
  },
  academic: {
    school10th: "",
    marks10th: "",
    percentage10th: "",
    school12th: "",
    marks12th: "",
    percentage12th: "",
    cgpa: 8.0,
    arrears: 0,
    totalCredits: 160,
    earnedCredits: 45,
  },
  links: {
    github: "",
    linkedin: "",
    portfolio: "",
    other: "",
  },
  overallAttendance: 85,
  achievements: [],
  skills: [],
  certificates: [],
  projects: [],
  remarks: [],
  attendanceBySemester: {},
};

export function mapBackendProfileToStudent(profile: any): StudentFullProfile {
  if (!profile) return DEFAULT_EMPTY_STUDENT;

  return {
    id: String(profile.id || 1),
    registerNumber: profile.register_number || "",
    name: profile.full_name || `${profile.first_name || ""} ${profile.last_name || ""}`.trim(),
    department: profile.department_name || "Artificial Intelligence & Data Science",
    course: profile.course_name || "B.Tech AI & Data Science",
    year: profile.year || "II",
    section: profile.section || "A",
    profileImage: profile.profile_photo_url || DEFAULT_EMPTY_STUDENT.profileImage,
    personal: {
      dob: profile.date_of_birth ? String(profile.date_of_birth) : "2005-05-14",
      gender: profile.gender || "Male",
      email: profile.email || "",
      phone: profile.phone_number || "",
      address: profile.address || "",
      residenceType: (profile.student_type as any) || "Day Scholar",
    },
    parent: {
      name: profile.guardians?.[0]?.parent_name || "",
      relationship: profile.guardians?.[0]?.relationship || "Father",
      contact: profile.guardians?.[0]?.phone_number || "",
      email: profile.guardians?.[0]?.email || "",
      occupation: profile.guardians?.[0]?.occupation || "",
    },
    academic: {
      school10th: profile.academic_background?.school_10th || "",
      marks10th: String(profile.academic_background?.total_marks_10th || ""),
      percentage10th: String(profile.academic_background?.percentage_10th || ""),
      school12th: profile.academic_background?.school_12th || "",
      marks12th: String(profile.academic_background?.total_marks_12th || ""),
      percentage12th: String(profile.academic_background?.percentage_12th || ""),
      cgpa: profile.cgpa || 8.0,
      arrears: 0,
      totalCredits: 160,
      earnedCredits: 45,
    },
    links: {
      github: profile.profile_links?.find((l: any) => l.platform?.toLowerCase() === "github")?.url || "",
      linkedin: profile.profile_links?.find((l: any) => l.platform?.toLowerCase() === "linkedin")?.url || "",
      portfolio: profile.profile_links?.find((l: any) => l.platform?.toLowerCase() === "portfolio")?.url || "",
      other: "",
    },
    overallAttendance: profile.attendance_percentage || 85,
    achievements: (profile.achievements || []).map((a: any) => ({
      id: String(a.id),
      title: a.title,
      organization: a.organization || "",
      event: a.event_name || "",
      date: a.achievement_date ? String(a.achievement_date) : "",
      description: a.description || "",
      leadershipRole: a.leadership_role || "",
      position: a.position || "",
    })),
    skills: (profile.skills || []).map((s: any) => ({
      id: String(s.id),
      name: s.name,
      category: s.category || "Technical",
      proficiency: s.proficiency_level || "Intermediate",
    })),
    certificates: (profile.certificates || []).map((c: any) => ({
      id: String(c.id),
      title: c.title,
      organization: c.issuing_organization || "",
      issueDate: c.issue_date ? String(c.issue_date) : "",
      certificateId: c.credential_id || "",
      credentialUrl: c.credential_url,
      thumbnail: c.thumbnail_url || "https://images.unsplash.com/photo-1589330694653-dad6bc01cf0f?w=400",
    })),
    projects: (profile.projects || []).map((p: any) => ({
      id: String(p.id),
      title: p.title,
      shortDescription: p.short_description || "",
      detailedDescription: p.detailed_description || "",
      technologies: (p.technologies || []).map((t: any) => (typeof t === "string" ? t : t.name)),
      role: p.student_role || "Developer",
      startDate: p.start_date ? String(p.start_date) : "",
      endDate: p.end_date ? String(p.end_date) : "",
      githubUrl: p.github_url || "",
      demoUrl: p.live_demo_url || "",
      image: p.project_image_url || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400",
    })),
    remarks: (profile.remarks || []).map((r: any) => ({
      id: String(r.id),
      facultyName: r.faculty_name || "Faculty Member",
      facultyDesignation: "Class Advisor & Professor",
      date: r.created_at ? new Date(r.created_at).toLocaleDateString() : "Recent",
      grade: r.grade || "Good",
      remark: r.remark || "",
    })),
    attendanceBySemester: {},
  };
}

interface StudentAuthContextType {
  student: StudentFullProfile;
  user: UserSession | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (identifier: string, pass: string, rememberMe?: boolean) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateName: (nameData: any) => Promise<{ success: boolean; error?: string }>;
  refreshProfile: () => Promise<void>;
  refreshStudent: () => Promise<void>;
}

const StudentAuthContext = createContext<StudentAuthContextType | undefined>(undefined);

export const StudentAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [student, setStudent] = useState<StudentFullProfile>(DEFAULT_EMPTY_STUDENT);
  const [user, setUser] = useState<UserSession | null>(tokenStorage.getUser());
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!tokenStorage.getAccessToken());
  const [isLoading, setIsLoading] = useState<boolean>(!!tokenStorage.getAccessToken());

  const fetchAndSetStudentProfile = useCallback(async () => {
    try {
      const res = await studentApi.getMyProfile();
      if (res.success && res.data) {
        const mapped = mapBackendProfileToStudent(res.data);
        setStudent(mapped);
      }
    } catch (err) {
      console.error("Failed to load student profile", err);
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    await fetchAndSetStudentProfile();
  }, [fetchAndSetStudentProfile]);

  // Restore authenticated session on mount
  useEffect(() => {
    const restoreSession = async () => {
      const token = tokenStorage.getAccessToken();
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await authApi.getMe();
        if (res.success && res.data && res.data.role === "STUDENT") {
          setUser(res.data);
          setIsAuthenticated(true);
          await fetchAndSetStudentProfile();
        }
      } finally {
        setIsLoading(false);
      }
    };
    restoreSession();
  }, [fetchAndSetStudentProfile]);

  const login = async (identifier: string, pass: string, rememberMe: boolean = false) => {
    const apiRes = await authApi.loginStudent(identifier, pass, rememberMe);
    if (apiRes.success && apiRes.data) {
      setUser(apiRes.data.user);
      setIsAuthenticated(true);
      await fetchAndSetStudentProfile();
      return { success: true };
    }

    return {
      success: false,
      error: apiRes.error || "Invalid register number or password.",
    };
  };

  const logout = async () => {
    await authApi.logout();
    setUser(null);
    setStudent(DEFAULT_EMPTY_STUDENT);
    setIsAuthenticated(false);
  };

  const updateName = async (nameData: any) => {
    const res = await studentApi.updateMyName(nameData);
    if (res.success) {
      await fetchAndSetStudentProfile();
      return { success: true };
    }
    return { success: false, error: res.error || "Failed to update name" };
  };

  return (
    <StudentAuthContext.Provider
      value={{
        student,
        user,
        isAuthenticated,
        isLoading,
        login,
        logout,
        refreshProfile,
        refreshStudent: refreshProfile,
        updateName,
      }}
    >
      {children}
    </StudentAuthContext.Provider>
  );
};

export const useStudentAuth = () => {
  const context = useContext(StudentAuthContext);
  if (!context) {
    throw new Error("useStudentAuth must be used within a StudentAuthProvider");
  }
  return context;
};
