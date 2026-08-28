import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap,
  ChevronRight,
  ChevronLeft,
  User,
  Trophy,
  Code2,
  Award,
  Briefcase,
  MessageSquare,
  Bell,
  LogOut,
  Settings,
  ShieldCheck,
  TrendingUp
} from "lucide-react";
import { useStudentAuth } from "../../context/StudentAuthContext";
import { AmbientBackground } from "../layout/AmbientBackground";

interface StudentLayoutProps {
  children: React.ReactNode;
  pageTitle?: string;
  showBack?: boolean;
  backTo?: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export default function StudentLayout({
  children,
  pageTitle,
  showBack = false,
  backTo = "/student/dashboard",
  subtitle,
  actions
}: StudentLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { student, logout } = useStudentAuth();

  const [menuOpen, setMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/login/student");
  };

  const quickMenuItems = [
    { id: 1, icon: TrendingUp, label: "Overview", path: "/student/dashboard" },
    { id: 2, icon: User, label: "My Profile", path: "/student/profile" },
    { id: 3, icon: Trophy, label: "Achievements", path: "/student/achievements" },
    { id: 4, icon: Code2, label: "Skills", path: "/student/skills" },
    { id: 5, icon: Award, label: "Certificates", path: "/student/certificates" },
    { id: 6, icon: Briefcase, label: "Projects", path: "/student/projects" },
    { id: 7, icon: MessageSquare, label: "Remarks", path: "/student/remarks" },
  ];

  const isCurrent = (path: string) => location.pathname === path;

  return (
    <AmbientBackground theme="light">
      <div className="min-h-screen flex flex-col font-sans relative pb-32">
        {/* Top Floating Glass Header */}
        <header className="sticky top-0 z-40 px-4 sm:px-8 py-3 w-full">
          <div className="max-w-7xl mx-auto px-5 py-3 rounded-2xl bg-white/70 backdrop-blur-xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex items-center justify-between">
            {/* Left / Title area */}
            <div className="flex items-center gap-4">
              {showBack ? (
                <button
                  onClick={() => navigate(backTo)}
                  className="p-2 hover:bg-slate-100/80 rounded-xl text-slate-700 transition-all flex items-center gap-1.5 text-xs font-bold cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Back</span>
                </button>
              ) : (
                <Link to="/student/dashboard" className="flex items-center gap-3 group cursor-pointer">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-blue-600 flex items-center justify-center text-white shadow-md shadow-purple-500/25 group-hover:scale-105 transition-transform">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div className="hidden sm:block">
                    <div className="flex items-center gap-1.5">
                      <span className="font-extrabold text-slate-900 text-base tracking-tight block leading-tight">
                        Student 360
                      </span>
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-purple-100 text-purple-700 border border-purple-200">
                        STUDENT
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500 font-semibold">
                      Department of {student.department.split(" ")[0]}
                    </span>
                  </div>
                </Link>
              )}

              {pageTitle && (
                <div className="border-l border-slate-300/80 pl-4 py-0.5">
                  <h1 className="text-lg sm:text-xl font-bold text-slate-900 leading-tight">{pageTitle}</h1>
                  {subtitle && <p className="text-xs text-slate-500 font-medium">{subtitle}</p>}
                </div>
              )}
            </div>

            {/* Right actions & Profile Avatar */}
            <div className="flex items-center gap-3 sm:gap-4">
              {actions && <div className="flex items-center gap-2">{actions}</div>}

              {/* Notification Popover */}
              <div className="relative" ref={notifRef}>
                <button 
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="w-10 h-10 rounded-xl bg-white/60 hover:bg-white text-slate-600 hover:text-slate-900 flex items-center justify-center transition-all relative cursor-pointer border border-white/60 shadow-sm"
                  title="Notifications"
                >
                  <Bell className="w-4 h-4" />
                  <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-purple-500 animate-ping"></span>
                  <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-purple-600"></span>
                </button>

                <AnimatePresence>
                  {notificationsOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-80 p-3 rounded-2xl bg-white/90 backdrop-blur-2xl border border-white/80 shadow-2xl z-50 text-left"
                    >
                      <div className="flex items-center justify-between pb-2 border-b border-slate-100 px-1">
                        <span className="text-xs font-bold text-slate-900">Notifications</span>
                        <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">2 New</span>
                      </div>
                      <div className="py-2 space-y-1.5">
                        <div className="p-2 rounded-xl bg-purple-50/60 border border-purple-100 text-xs">
                          <p className="font-semibold text-slate-800">Faculty Remark Posted</p>
                          <p className="text-[11px] text-slate-500 mt-0.5">Dr. Sarah Jenkins added an endorsement on your NLP project.</p>
                        </div>
                        <div className="p-2 rounded-xl bg-blue-50/60 border border-blue-100 text-xs">
                          <p className="font-semibold text-slate-800">Attendance Report Available</p>
                          <p className="text-[11px] text-slate-500 mt-0.5">Overall attendance updated to {student.overallAttendance}%. Good standing.</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="h-6 w-px bg-slate-300/60"></div>

              {/* Profile Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-white/80 transition-all cursor-pointer border border-transparent hover:border-white/80"
                >
                  <img
                    src={student.profileImage}
                    alt={student.name}
                    className="w-9 h-9 rounded-xl object-cover ring-2 ring-purple-500/20 shadow-sm"
                  />
                  <div className="hidden md:block text-left text-xs pr-1">
                    <p className="font-bold text-slate-900 leading-tight">{student.name}</p>
                    <p className="text-slate-500 font-semibold text-[11px]">{student.registerNumber}</p>
                  </div>
                </button>

                <AnimatePresence>
                  {profileDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-64 bg-white/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/80 p-2 z-50"
                    >
                      <div className="p-3 border-b border-slate-100 bg-purple-50/40 rounded-xl mb-1">
                        <p className="text-xs font-bold text-slate-900">{student.name}</p>
                        <p className="text-[11px] text-purple-600 font-bold">{student.registerNumber}</p>
                        <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{student.department}</p>
                      </div>

                      <div className="space-y-0.5 py-1">
                        <Link
                          to="/student/profile"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-purple-600 hover:bg-purple-50/70 rounded-xl transition-all"
                        >
                          <User className="w-4 h-4 text-slate-400" />
                          <span>My 360 Profile</span>
                        </Link>
                        <Link
                          to="/student/settings"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-purple-600 hover:bg-purple-50/70 rounded-xl transition-all"
                        >
                          <Settings className="w-4 h-4 text-slate-400" />
                          <span>Account Settings</span>
                        </Link>
                        <div className="flex items-center gap-2.5 px-3 py-2 text-[11px] font-semibold text-slate-500">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                          <span>Verified Active Student</span>
                        </div>
                      </div>

                      <div className="pt-1 mt-1 border-t border-slate-100">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50/80 rounded-xl transition-colors cursor-pointer"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </main>

        {/* Floating Liquid Quick Menu */}
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-auto">
          <motion.div
            className="flex items-center bg-slate-950/85 backdrop-blur-2xl rounded-[32px] p-2 shadow-[0_20px_60px_rgba(0,0,0,0.4)] border border-white/15"
            animate={{ width: menuOpen ? "auto" : "64px" }}
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
          >
            <motion.button
              onClick={() => setMenuOpen(!menuOpen)}
              className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 flex items-center justify-center text-white transition-colors shrink-0 cursor-pointer shadow-inner"
              animate={{ rotate: menuOpen ? 180 : 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              title={menuOpen ? "Close Quick Menu" : "Open Student 360 Navigation"}
            >
              <ChevronRight className="w-6 h-6" />
            </motion.button>

            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  className="flex items-center pl-2 pr-3 space-x-1.5 sm:space-x-2"
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: "auto", opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 350, damping: 28 }}
                >
                  {quickMenuItems.map((item, index) => (
                    <motion.button
                      key={item.id}
                      onClick={() => {
                        navigate(item.path);
                        setMenuOpen(false);
                      }}
                      initial={{ opacity: 0, scale: 0.6, x: -15 }}
                      animate={{ opacity: 1, scale: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.6, x: -15 }}
                      transition={{ delay: index * 0.03, type: "spring", stiffness: 300, damping: 20 }}
                      whileHover={{ scale: 1.15, y: -3 }}
                      whileTap={{ scale: 0.92 }}
                      className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-all relative group cursor-pointer ${
                        isCurrent(item.path)
                          ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/50 ring-2 ring-purple-300/40"
                          : "bg-white/5 text-slate-300 hover:text-white hover:bg-white/20"
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="absolute -top-10 bg-slate-900/95 text-white text-xs font-semibold px-2.5 py-1 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap shadow-xl border border-white/10">
                        {item.label}
                      </span>
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </AmbientBackground>
  );
}
