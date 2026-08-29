import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Settings, 
  LogOut, 
  ShieldCheck, 
  ChevronDown, 
  Mail, 
  IdCard, 
  Building2, 
  Check, 
  X, 
  Sliders, 
  BellRing,
  BookOpen
} from "lucide-react";

export function FacultyProfileDropdown() {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Settings State
  const [attendanceThreshold, setAttendanceThreshold] = useState(75);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [autoSgpaReports, setAutoSgpaReports] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    setDropdownOpen(false);
    navigate("/login/faculty");
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      setSettingsOpen(false);
    }, 1200);
  };

  return (
    <>
      {/* Profile Trigger Button */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-2.5 p-1 sm:p-1.5 rounded-2xl hover:bg-white/80 transition-all border border-transparent hover:border-white/80 cursor-pointer group"
          title="Faculty Account Details"
        >
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150" 
              alt="Faculty Avatar" 
              className="w-9 h-9 rounded-xl object-cover ring-2 ring-blue-500/30 group-hover:ring-blue-500/60 transition-all shadow-sm" 
            />
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
          </div>

          <div className="hidden md:block text-left text-xs pr-1">
            <div className="flex items-center gap-1">
              <p className="font-extrabold text-slate-900 leading-tight">Dr. Sarah Jenkins</p>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
            </div>
            <p className="text-slate-500 font-medium text-[11px]">Computer Science & AI</p>
          </div>
        </button>

        {/* Dropdown Menu Popover */}
        <AnimatePresence>
          {dropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 mt-2.5 w-80 bg-white/95 backdrop-blur-2xl rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-white/80 p-3 z-50 text-left"
            >
              {/* Faculty Info Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-50/80 via-indigo-50/50 to-slate-50 border border-blue-100/80 mb-2">
                <div className="flex items-start gap-3">
                  <img 
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150" 
                    alt="Dr. Sarah Jenkins" 
                    className="w-12 h-12 rounded-xl object-cover ring-2 ring-blue-500/30 shadow-md"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-sm font-extrabold text-slate-900 leading-snug truncate">
                        Dr. Sarah Jenkins
                      </h4>
                      <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                    </div>
                    <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded-md mt-0.5">
                      Associate Professor
                    </span>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-blue-200/50 space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="font-semibold text-slate-800 text-[11px] truncate">
                      Dept. of Computer Science & AI
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="flex items-center gap-2 text-slate-500">
                      <IdCard className="w-3.5 h-3.5 text-slate-400" />
                      Faculty ID
                    </span>
                    <span className="font-mono font-bold text-slate-800 bg-white/80 px-2 py-0.5 rounded-md border border-slate-200/60">
                      FAC-CS-8924
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">prof.sarah@college.edu</span>
                  </div>
                </div>
              </div>

              {/* Menu Actions */}
              <div className="space-y-1 py-1 text-xs font-semibold">
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    setSettingsOpen(true);
                  }}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-slate-700 hover:text-blue-600 hover:bg-blue-50/80 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5">
                    <Settings className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
                    <span>Faculty Settings</span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 group-hover:text-blue-500">Preferences</span>
                </button>

                <div className="flex items-center justify-between px-3.5 py-2 rounded-xl text-[11px] text-slate-500 bg-slate-50/60 border border-slate-100">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-3.5 h-3.5 text-blue-500" />
                    <span>Assigned Batch</span>
                  </div>
                  <span className="font-bold text-slate-800">Class 2023 - 2027</span>
                </div>
              </div>

              {/* Logout Option */}
              <div className="pt-1.5 mt-1 border-t border-slate-100">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-bold text-red-600 hover:bg-red-50/80 rounded-xl transition-colors cursor-pointer group"
                >
                  <LogOut className="w-4 h-4 text-red-500 group-hover:-translate-x-0.5 transition-transform" />
                  <span>Sign Out</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Faculty Settings Modal */}
      <AnimatePresence>
        {settingsOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSettingsOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-md"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-lg bg-white/95 backdrop-blur-2xl rounded-3xl shadow-[0_20px_70px_rgba(0,0,0,0.25)] border border-white/80 overflow-hidden z-10"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/50">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                    <Sliders className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 leading-snug">Faculty Portal Settings</h3>
                    <p className="text-xs text-slate-500 font-medium">Department of Computer Science & AI</p>
                  </div>
                </div>

                <button 
                  onClick={() => setSettingsOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Form */}
              <form onSubmit={handleSaveSettings} className="p-6 space-y-5">
                {/* Faculty ID Read-Only Card */}
                <div className="p-3.5 rounded-2xl bg-blue-50/50 border border-blue-100 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-blue-900">Dr. Sarah Jenkins</p>
                    <p className="text-slate-500 text-[11px]">Faculty ID: FAC-CS-8924</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                    Active Faculty
                  </span>
                </div>

                {/* Attendance Alert Threshold */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Minimum Attendance Warning Threshold
                    </label>
                    <span className="font-mono font-bold text-blue-600 text-xs bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                      {attendanceThreshold}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="60"
                    max="90"
                    step="1"
                    value={attendanceThreshold}
                    onChange={(e) => setAttendanceThreshold(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Flags students with attendance below this percentage in red on the dashboard roster.
                  </p>
                </div>

                {/* Toggles */}
                <div className="space-y-3 pt-2 border-t border-slate-100">
                  <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50/60 border border-slate-100 cursor-pointer hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-2.5">
                      <BellRing className="w-4 h-4 text-blue-600" />
                      <div>
                        <p className="text-xs font-bold text-slate-800">Email Digest for Low Attendance</p>
                        <p className="text-[11px] text-slate-500">Receive weekly automated warning reports</p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={emailAlerts}
                      onChange={(e) => setEmailAlerts(e.target.checked)}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 accent-blue-600"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50/60 border border-slate-100 cursor-pointer hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-2.5">
                      <BookOpen className="w-4 h-4 text-purple-600" />
                      <div>
                        <p className="text-xs font-bold text-slate-800">Automated Grade Velocity Analytics</p>
                        <p className="text-[11px] text-slate-500">Compute cumulative CGPA progression per semester</p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={autoSgpaReports}
                      onChange={(e) => setAutoSgpaReports(e.target.checked)}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 accent-blue-600"
                    />
                  </label>
                </div>

                {/* Submit button */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setSettingsOpen(false)}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/25 flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    {saveSuccess ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Saved Successfully!</span>
                      </>
                    ) : (
                      <span>Save Preferences</span>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
