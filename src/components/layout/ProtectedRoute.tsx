import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useStudentAuth } from "../../context/StudentAuthContext";
import { useFacultyAuth } from "../../context/FacultyAuthContext";
import { AmbientBackground } from "./AmbientBackground";

interface ProtectedRouteProps {
  role: "STUDENT" | "FACULTY";
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ role, children }) => {
  const location = useLocation();
  const studentAuth = useStudentAuth();
  const facultyAuth = useFacultyAuth();

  const isStudentRole = role === "STUDENT";
  const isLoading = isStudentRole ? studentAuth.isLoading : facultyAuth.isLoading;
  const isAuthenticated = isStudentRole ? studentAuth.isAuthenticated : facultyAuth.isAuthenticated;
  const loginRedirectPath = isStudentRole ? "/login/student" : "/login/faculty";

  if (isLoading) {
    return (
      <AmbientBackground theme="dark">
        <div className="min-h-screen flex flex-col items-center justify-center p-6 relative z-10">
          <div className="p-8 rounded-3xl bg-slate-900/70 backdrop-blur-2xl border border-white/10 shadow-2xl flex flex-col items-center gap-4 text-center">
            <div className="w-12 h-12 border-3 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
            <div>
              <h4 className="text-white font-bold text-sm">Verifying Session...</h4>
              <p className="text-slate-400 text-xs mt-1">Checking institutional credentials</p>
            </div>
          </div>
        </div>
      </AmbientBackground>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={loginRedirectPath} state={{ from: location }} replace />;
  }

  return <>{children}</>;
};