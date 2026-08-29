import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Bell, Users, TrendingUp, Award, AlertCircle, Eye } from "lucide-react";
import { mockStudents } from "../../mock/data";
import { AmbientBackground } from "../../components/layout/AmbientBackground";
import { FacultyProfileDropdown } from "../../components/faculty/FacultyProfileDropdown";

export default function FacultyDashboard() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const searchResults = searchQuery
    ? mockStudents.filter(s => 
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        s.registerNumber.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <AmbientBackground theme="light">
      {/* Glass Top Header */}
      <header className="sticky top-0 z-40 px-4 sm:px-8 py-3 w-full">
        <div className="max-w-7xl mx-auto px-5 py-3 rounded-2xl bg-white/75 backdrop-blur-xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-slate-900 text-base tracking-tight block leading-tight">Student 360</span>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-blue-100 text-blue-700 border border-blue-200">FACULTY</span>
              </div>
              <span className="text-[11px] text-slate-500 font-semibold">Faculty Information Portal</span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-xl mx-4 relative" ref={searchRef}>
            <div className={`relative transition-all duration-300 ${isSearchFocused ? "scale-[1.01]" : ""}`}>
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Search className={`w-4 h-4 transition-colors ${isSearchFocused ? "text-blue-600" : ""}`} />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium bg-slate-100/70 border border-slate-200/60 focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all placeholder-slate-400"
                placeholder="Search students by register no, name, or course..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
              />
            </div>

            <AnimatePresence>
              {isSearchFocused && searchQuery && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute z-50 mt-2 w-full bg-white/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/80 overflow-hidden"
                >
                  {searchResults.length > 0 ? (
                    <ul className="max-h-96 overflow-y-auto py-2 custom-scrollbar">
                      {searchResults.map((student) => (
                        <li 
                          key={student.id}
                          className="px-4 py-3 hover:bg-blue-50/60 cursor-pointer transition-colors flex items-center gap-3.5 border-b border-slate-50 last:border-0"
                          onClick={() => navigate("/faculty/students/" + student.id)}
                        >
                          <img src={student.image} alt={student.name} className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-200" />
                          <div className="flex-1">
                            <h4 className="text-sm font-bold text-slate-900 leading-snug">{student.name}</h4>
                            <p className="text-xs text-slate-500">{student.registerNumber} • {student.department}</p>
                          </div>
                          <div className="text-right">
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                              student.attendance < 75 ? "bg-red-50 text-red-600 border border-red-200" : "bg-emerald-50 text-emerald-600 border border-emerald-200"
                            }`}>
                              {student.attendance}% Att
                            </span>
                            <div className="text-xs text-slate-500 font-semibold mt-0.5">CGPA: {student.cgpa}</div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="px-4 py-8 text-center text-slate-500 text-sm">
                      No students found matching "{searchQuery}"
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Profile & Notifications */}
          <div className="flex items-center gap-3">
            <button className="w-10 h-10 rounded-xl bg-white/60 hover:bg-white text-slate-600 hover:text-slate-900 flex items-center justify-center transition-all border border-white/60 shadow-sm relative cursor-pointer">
              <Bell className="w-4 h-4" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-blue-600"></span>
            </button>

            <div className="h-6 w-px bg-slate-300/60 hidden sm:block"></div>

            <FacultyProfileDropdown />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Faculty Dashboard</h1>
            <p className="text-slate-500 font-medium text-sm mt-1">Institutional academic monitoring & student 360 evaluation</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-xl text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
              Semester VI • Active Term
            </span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { label: "Enrolled Students", value: "245", icon: Users, color: "text-blue-600", bg: "bg-blue-50/80", border: "border-blue-100" },
            { label: "Class Avg Attendance", value: "84.2%", icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50/80", border: "border-emerald-100" },
            { label: "Cumulative CGPA", value: "8.14", icon: Award, color: "text-purple-600", bg: "bg-purple-50/80", border: "border-purple-100" },
            { label: "Attendance Alerts", value: "12", icon: AlertCircle, color: "text-red-600", bg: "bg-red-50/80", border: "border-red-100", sub: "Below 75% threshold" },
          ].map((stat, i) => (
            <div 
              key={i} 
              className="p-6 rounded-3xl bg-white/70 backdrop-blur-xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.03)] hover:shadow-lg transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${stat.bg} ${stat.border} border shadow-sm`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                {stat.sub && (
                  <span className="text-[11px] font-bold text-red-600 bg-red-50 px-2.5 py-1 rounded-full border border-red-200">
                    {stat.sub}
                  </span>
                )}
              </div>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">{stat.label}</p>
              <h3 className="text-3xl font-extrabold text-slate-900 mt-1">{stat.value}</h3>
            </div>
          ))}
        </div>

        {/* Student Roster Table */}
        <div className="rounded-3xl bg-white/70 backdrop-blur-xl border border-white/60 shadow-[0_12px_40px_rgb(0,0,0,0.04)] overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100/80 flex justify-between items-center bg-white/40">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Student Directory (Class 2023-2027)</h2>
              <p className="text-xs text-slate-500 font-medium">Showing active students under your academic department</p>
            </div>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-200">
              {mockStudents.length} Records Loaded
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100/50 text-slate-500 text-[11px] font-bold uppercase tracking-wider border-b border-slate-100">
                  <th className="px-6 py-4">Student Profile</th>
                  <th className="px-6 py-4">Register No</th>
                  <th className="px-6 py-4">Department & Course</th>
                  <th className="px-6 py-4">Attendance</th>
                  <th className="px-6 py-4">CGPA</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/80">
                {mockStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <img src={student.image} alt={student.name} className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-200" />
                        <div>
                          <span className="font-bold text-slate-900 block leading-tight">{student.name}</span>
                          <span className="text-[11px] text-slate-400 font-medium">Sec {student.section} • Year {student.year}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 font-mono font-semibold">
                      {student.registerNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-slate-800">{student.department}</div>
                      <div className="text-xs text-slate-500 font-medium">{student.course}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2.5">
                        <div className="w-16 bg-slate-200/80 rounded-full h-2 overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${student.attendance < 75 ? "bg-red-500" : "bg-emerald-500"}`} 
                            style={{ width: `${student.attendance}%` }}
                          />
                        </div>
                        <span className={`text-xs font-bold ${student.attendance < 75 ? "text-red-600" : "text-emerald-700"}`}>
                          {student.attendance}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-800 font-mono">
                        {student.cgpa}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button 
                        onClick={() => navigate("/faculty/students/" + student.id)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-blue-600 bg-blue-50/80 hover:bg-blue-600 hover:text-white rounded-xl transition-all shadow-sm cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View 360</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </AmbientBackground>
  );
}
