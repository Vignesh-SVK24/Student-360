import React, { createContext, useContext, useState, useEffect } from "react";
import { authApi, tokenStorage, type UserSession } from "../services/apiClient";

export interface FacultyProfile {
  id: number;
  facultyId: string;
  name: string;
  email: string;
  department: string;
  designation: string;
  assigned_role?: string;
  profilePhoto?: string;
}

const DEFAULT_FACULTY: FacultyProfile = {
  id: 1,
  facultyId: "FAC-AIML-01",
  name: "Dr. S. Ramanujam",
  email: "ramanujam.s@college.edu",
  department: "Artificial Intelligence & Data Science",
  designation: "Class Advisor & Professor",
  assigned_role: "CLASS_ADVISOR",
  profilePhoto: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300",
};

interface FacultyAuthContextType {
  faculty: FacultyProfile;
  user: UserSession | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (identifier: string, pass: string, rememberMe?: boolean) => Promise<{ success: boolean; error?: string }>;
  register: (data: {
    name: string;
    faculty_id: string;
    email: string;
    phone_number?: string;
    department_id?: number;
    designation: string;
    password: string;
    confirm_password: string;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const FacultyAuthContext = createContext<FacultyAuthContextType | undefined>(undefined);

export const FacultyAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [faculty, setFaculty] = useState<FacultyProfile>(() => {
    const saved = localStorage.getItem("s360_faculty_profile");
    return saved ? JSON.parse(saved) : DEFAULT_FACULTY;
  });
  const [user, setUser] = useState<UserSession | null>(tokenStorage.getUser());
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!tokenStorage.getAccessToken());
  const [isLoading, setIsLoading] = useState<boolean>(!!tokenStorage.getAccessToken());

  // Restore authenticated session on reload
  useEffect(() => {
    const restoreSession = async () => {
      const token = tokenStorage.getAccessToken();
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await authApi.getMe();
        if (res.success && res.data && (res.data.role === "FACULTY" || res.data.role === "ADMIN")) {
          setUser(res.data);
          setIsAuthenticated(true);
          const updated: FacultyProfile = {
            id: res.data.profile_id || 1,
            facultyId: res.data.identifier || "FAC-AIML-01",
            name: res.data.name || "Faculty Member",
            email: res.data.email,
            department: res.data.department_name || "Artificial Intelligence & Data Science",
            designation: "Faculty Mentor",
            assigned_role: res.data.assigned_role || "CLASS_ADVISOR",
            profilePhoto: res.data.profile_photo_url || DEFAULT_FACULTY.profilePhoto,
          };
          setFaculty(updated);
          localStorage.setItem("s360_faculty_profile", JSON.stringify(updated));
        }
      } finally {
        setIsLoading(false);
      }
    };
    restoreSession();
  }, []);

  const login = async (identifier: string, pass: string, rememberMe: boolean = false) => {
    const res = await authApi.loginFaculty(identifier, pass, rememberMe);
    if (res.success && res.data) {
      setUser(res.data.user);
      setIsAuthenticated(true);
      const updated: FacultyProfile = {
        id: res.data.user.profile_id || 1,
        facultyId: res.data.user.identifier || identifier,
        name: res.data.user.name || "Faculty Member",
        email: res.data.user.email,
        department: res.data.user.department_name || "Department of AI & Data Science",
        designation: "Faculty Mentor",
        assigned_role: res.data.user.assigned_role || "CLASS_ADVISOR",
        profilePhoto: res.data.user.profile_photo_url || DEFAULT_FACULTY.profilePhoto,
      };
      setFaculty(updated);
      localStorage.setItem("s360_faculty_profile", JSON.stringify(updated));
      return { success: true };
    }

    // Fallback: demo credentials check for offline/standalone mode
    if (
      (identifier === "FAC-AIML-01" || identifier === "ramanujam.s@college.edu" || identifier === "prof.sarah@college.edu") &&
      (pass === "Faculty@360" || pass === "faculty123")
    ) {
      setIsAuthenticated(true);
      return { success: true };
    }

    return {
      success: false,
      error: res.error || "Invalid faculty credentials.",
    };
  };

  const register = async (data: any) => {
    const res = await authApi.registerFaculty(data);
    if (res.success && res.data) {
      setUser(res.data.user);
      setIsAuthenticated(true);
      const updated: FacultyProfile = {
        id: res.data.user.profile_id || 1,
        facultyId: data.faculty_id,
        name: data.name,
        email: data.email,
        department: "Department of AI & Data Science",
        designation: data.designation || "Assistant Professor",
        assigned_role: data.assigned_role || "CLASS_ADVISOR",
      };
      setFaculty(updated);
      localStorage.setItem("s360_faculty_profile", JSON.stringify(updated));
      return { success: true };
    }
    return { success: false, error: res.error || "Registration failed" };
  };

  const logout = async () => {
    await authApi.logout();
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("s360_faculty_profile");
  };

  return (
    <FacultyAuthContext.Provider value={{ faculty, user, isAuthenticated, isLoading, login, register, logout }}>
      {children}
    </FacultyAuthContext.Provider>
  );
};

export const useFacultyAuth = () => {
  const context = useContext(FacultyAuthContext);
  if (!context) {
    throw new Error("useFacultyAuth must be used within a FacultyAuthProvider");
  }
  return context;
};