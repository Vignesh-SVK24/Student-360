import React, { createContext, useContext, useState, useEffect } from "react";
import { studentAuthService } from "../services/studentData";
import type { StudentFullProfile } from "../types/student";

interface StudentAuthContextType {
  student: StudentFullProfile;
  login: (identifier: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshStudent: () => void;
}

const StudentAuthContext = createContext<StudentAuthContextType | undefined>(undefined);

export const StudentAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [student, setStudent] = useState<StudentFullProfile>(studentAuthService.getCurrentStudent());

  const refreshStudent = () => {
    setStudent(studentAuthService.getCurrentStudent());
  };

  useEffect(() => {
    refreshStudent();
  }, []);

  const login = async (identifier: string, pass: string) => {
    const res = await studentAuthService.login(identifier, pass);
    if (res.success && res.student) {
      setStudent(res.student);
      return { success: true };
    }
    return { success: false, error: res.error || "Invalid register number or password." };
  };

  const logout = async () => {
    await studentAuthService.logout();
    setStudent(studentAuthService.getCurrentStudent());
  };

  return (
    <StudentAuthContext.Provider value={{ student, login, logout, refreshStudent }}>
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
