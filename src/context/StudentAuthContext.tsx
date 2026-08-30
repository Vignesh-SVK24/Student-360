import React, { createContext, useContext, useState, useEffect } from "react";
import { studentAuthService } from "../services/studentData";
import { authApi, studentApi, tokenStorage, type UserSession } from "../services/apiClient";
import type { StudentFullProfile } from "../types/student";

interface StudentAuthContextType {
  student: StudentFullProfile;
  user: UserSession | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (identifier: string, pass: string, rememberMe?: boolean) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshStudent: () => void;
  updateName: (nameData: { first_name?: string; middle_name?: string; last_name?: string; display_name?: string }) => Promise<{ success: boolean; error?: string }>;
}

const StudentAuthContext = createContext<StudentAuthContextType | undefined>(undefined);

export const StudentAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [student, setStudent] = useState<StudentFullProfile>(studentAuthService.getCurrentStudent());
  const [user, setUser] = useState<UserSession | null>(tokenStorage.getUser());
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!tokenStorage.getAccessToken());
  const [isLoading, setIsLoading] = useState<boolean>(!!tokenStorage.getAccessToken());

  const refreshStudent = () => {
    setStudent(studentAuthService.getCurrentStudent());
  };

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
          if (res.data.name) {
            const current = studentAuthService.getCurrentStudent();
            current.name = res.data.name;
            if (res.data.identifier) current.registerNumber = res.data.identifier;
            setStudent({ ...current });
          }
        }
      } finally {
        setIsLoading(false);
      }
    };
    restoreSession();
  }, []);

  const login = async (identifier: string, pass: string, rememberMe: boolean = false) => {
    // 1. Attempt Real Backend API
    const apiRes = await authApi.loginStudent(identifier, pass, rememberMe);
    if (apiRes.success && apiRes.data) {
      setUser(apiRes.data.user);
      setIsAuthenticated(true);

      // Sync local student profile
      const local = studentAuthService.getCurrentStudent();
      local.name = apiRes.data.user.name || local.name;
      local.registerNumber = apiRes.data.user.identifier || local.registerNumber;
      local.personal.email = apiRes.data.user.email;
      setStudent({ ...local });
      return { success: true };
    }

    // 2. Resilient Fallback to Local Auth Service
    const localRes = await studentAuthService.login(identifier, pass);
    if (localRes.success && localRes.student) {
      setStudent(localRes.student);
      setIsAuthenticated(true);
      return { success: true };
    }

    return {
      success: false,
      error: apiRes.error || localRes.error || "Invalid register number or password.",
    };
  };

  const logout = async () => {
    await authApi.logout();
    await studentAuthService.logout();
    setUser(null);
    setIsAuthenticated(false);
    setStudent(studentAuthService.getCurrentStudent());
  };

  const updateName = async (nameData: { first_name?: string; middle_name?: string; last_name?: string; display_name?: string }) => {
    // Call backend API
    const res = await studentApi.updateMyName(nameData);
    if (res.success) {
      const current = studentAuthService.getCurrentStudent();
      if (nameData.display_name) current.name = nameData.display_name;
      else if (nameData.first_name || nameData.last_name) {
        current.name = `${nameData.first_name || ""} ${nameData.last_name || ""}`.trim();
      }
      setStudent({ ...current });
      return { success: true };
    }
    return { success: false, error: res.error || "Failed to update name" };
  };

  return (
    <StudentAuthContext.Provider value={{ student, user, isAuthenticated, isLoading, login, logout, refreshStudent, updateName }}>
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