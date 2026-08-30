import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Bell, 
  Users, 
  TrendingUp, 
  Award, 
  AlertCircle, 
  Eye, 
  Trophy, 
  User, 
  X, 
  ArrowRight,
  CheckCircle2,
  Code2,
  UserPlus
} from "lucide-react";
import { mockStudents, type Student } from "../../mock/data";
import { AmbientBackground } from "../../components/layout/AmbientBackground";
import { FacultyProfileDropdown } from "../../components/faculty/FacultyProfileDropdown";
import { AddStudentModal } from "../../components/faculty/AddStudentModal";

export default function FacultyDashboard() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [selectedQuickStudent, setSelectedQuickStudent] = useState<Student | null>(null);
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [studentsList, setStudentsList] = useState<Student[]>(() => {
    const custom = localStorage.getItem("s360_custom_students");
    if (custom) {
      try {
        const parsed = JSON.parse(custom);
        return [...mockStudents, ...parsed];
      } catch {
        return mockStudents;
      }
    }
    return mockStudents;
  });
  const searchRef = useRef<HTMLDivElement>(null);

  const handleStudentAdded = (apiStudent: any) => {
    const formatted: Student = {
      id: apiStudent.id ? String(apiStudent.id) : `custom-${Date.now()}`,
      name: apiStudent.full_name || `${apiStudent.first_name} ${apiStudent.last_name}`,
      registerNumber: apiStudent.register_number,
      department: "Artificial Intelligence & Data Science",
      course: "B.Tech AI & Data Science",
      year: apiStudent.year || "II",
      section: apiStudent.section || "A",
      cgpa: 8.00,
      attendance: 100,
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
      skills: ["Python", "FastAPI", "Machine Learning"],
      topAchievement: "Admitted via Faculty Portal",
      email: apiStudent.email,
      phone: apiStudent.phone_number,
      residenceType: (apiStudent.student_type as any) || "Day Scholar",
    };
    setStudentsList((prev) => [formatted, ...prev]);
    const custom = JSON.parse(localStorage.getItem("s360_custom_students") || "[]");
    custom.unshift(formatted);
    localStorage.setItem("s360_custom_students", JSON.stringify(custom));
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const queryClean = searchQuery.trim().toLowerCase();

  // Exact Match Check
  const exactMatch = queryClean
    ? studentsList.find(
        s =>
          s.registerNumber.toLowerCase() === queryClean ||
          s.name.toLowerCase() === queryClean
      )
    : null;

  // Incremental letter-by-letter suggestions
  const searchResults = queryClean
    ? studentsList.filter(s => 
        s.name.toLowerCase().includes(queryClean) || 
        s.registerNumber.toLowerCase().includes(queryClean) ||
        s.department.toLowerCase().includes(queryClean) ||
        s.course.toLowerCase().includes(queryClean) ||
        s.skills.some(sk => sk.toLowerCase().includes(queryClean))
      )
    : studentsList;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (exactMatch) {
      navigate("/faculty/students/" + exactMatch.id);
    } else if (searchResults.length > 0) {
      navigate("/faculty/students/" + searchResults[0].id);
    }
  };

  return (
    <AmbientBackground theme="light">
      {/* Glass Top Header */}
      <header className="sticky top-0 z-40 px-4 sm:px-8 py-3 w-full">
        <div className="max-w-7xl mx-auto px-5 py-3 rounded-2xl bg-white/75 backdrop-blur-xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#042821] via-[#0d4933] to-[#629176] flex items-center justify-center text-white shadow-md shadow-[#0d4933]/25">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-slate-900 text-base tracking-tight block leading-tight">Student 360</span>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-[#629176]/20 text-[#0d4933] border border-[#629176]/40">FACULTY</span>
              </div>
              <span className="text-[11px] text-slate-500 font-semibold">Faculty Information Portal</span>
            </div>
          </div>

          {/* Interactive Live Search Bar */}
          <div className="flex-1 max-w-xl mx-4 relative" ref={searchRef}>
            <form onSubmit={handleSearchSubmit}>
              <div className={`relative transition-all duration-300 ${isSearchFocused ? "scale-[1.01]" : ""}`}>
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Search className={`w-4 h-4 transition-colors ${isSearchFocused ? "text-[#0d4933]" : ""}`} />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-10 py-2.5 rounded-xl text-xs sm:text-sm font-medium bg-slate-100/70 border border-slate-200/60 focus:bg-white focus:border-[#0d4933] focus:outline-none focus:ring-2 focus:ring-[#0d4933]/30 transition-all placeholder-slate-400"
                  placeholder="Search students by register no (e.g. 23AIM001), name, or skills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </form>

            {/* Incremental Suggestion Popover */}
            <AnimatePresence>
              {isSearchFocused && searchQuery.trim() && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute z-50 mt-2 w-full bg-white/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/80 overflow-hidden"
                >
                  {/* Exact Match Banner */}
                  {exactMatch && (
                    <div 
                      onClick={() => navigate("/faculty/students/" + exactMatch.id)}
                      className="p-3.5 bg-gradient-to-r from-[#0d4933]/15 to-[#629176]/15 border-b border-emerald-200 cursor-pointer hover:bg-emerald-100/60 transition-colors flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                        <div>
                          <p className="text-xs font-black text-emerald-900 flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            Exact Student Match Found!
                          </p>
                          <p className="text-[11px] text-slate-600 font-medium">
                            {exactMatch.name} ({exactMatch.registerNumber}) • {exactMatch.department}
                          </p>
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-emerald-600 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm">
                        <span>Open 360</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  )}

                  {/* Suggestion List (Letter-by-Letter) */}
                  {searchResults.length > 0 ? (
                    <div className="max-h-80 overflow-y-auto py-2 custom-scrollbar">
                      <div className="px-3.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {searchResults.length} Matching Profiles Found
                      </div>
                      <ul>
                        {searchResults.map((student) => (
                          <li 
                            key={student.id}
                            className="px-4 py-2.5 hover:bg-[#629176]/15 cursor-pointer transition-colors flex items-center justify-between gap-3 border-b border-slate-50 last:border-0 group"
                            onClick={() => navigate("/faculty/students/" + student.id)}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <img src={student.image} alt={student.name} className="w-9 h-9 rounded-xl object-cover ring-1 ring-slate-200" />
                              <div className="truncate">
                                <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#0d4933] transition-colors flex items-center gap-1.5">
                                  <span>{student.name}</span>
                                  <span className="font-mono text-[10px] text-[#0d4933] bg-[#629176]/15 px-1.5 py-0.2 rounded border border-[#629176]/30">
                                    {student.registerNumber}
                                  </span>
                                </h4>
                                <p className="text-[11px] text-slate-500 truncate">{student.department} • Sec {student.section}</p>
                              </div>
                            </div>

                            <div className="text-right shrink-0">
                              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                                student.attendance < 75 ? "bg-red-50 text-red-600 border border-red-200" : "bg-emerald-50 text-emerald-600 border border-emerald-200"
                              }`}>
                                {student.attendance}% Att
                              </span>
                              <div className="text-[10px] text-slate-500 font-semibold mt-0.5">CGPA: {student.cgpa}</div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <div className="px-4 py-8 text-center text-slate-500 text-sm">
                      No student found matching "{searchQuery}"
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
              <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[#0d4933]"></span>
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
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-xl text-xs font-bold bg-[#629176]/15 text-[#0d4933] border border-[#629176]/30">
              Semester VI • Active Term
            </span>
            <button
              onClick={() => setIsAddStudentOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#042821] via-[#0d4933] to-[#629176] hover:opacity-95 text-white text-xs font-bold shadow-md shadow-[#0d4933]/25 transition-all cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add Student</span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { label: "Enrolled Students", value: "245", icon: Users, color: "text-[#0d4933]", bg: "bg-[#629176]/15", border: "border-[#629176]/30" },
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

        {/* Student Directory with Expanded Profile & Skills */}
        <div className="rounded-3xl bg-white/70 backdrop-blur-xl border border-white/60 shadow-[0_12px_40px_rgb(0,0,0,0.04)] overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/40">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Student Directory & Portfolios</h2>
              <p className="text-xs text-slate-500 font-medium">
                Showing {searchResults.length} of {studentsList.length} students with verified skills & achievements
              </p>
            </div>

            <div className="flex items-center gap-3">
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="self-start text-xs font-bold text-[#0d4933] hover:text-[#042821] bg-[#629176]/15 border border-[#629176]/30 px-3 py-1.5 rounded-xl transition-colors"
                >
                  Clear Search Filter
                </button>
              )}
              <button
                onClick={() => setIsAddStudentOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#0d4933] hover:bg-[#042821] text-white text-xs font-bold transition-colors cursor-pointer shadow-sm"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Add Student</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100/50 text-slate-500 text-[11px] font-bold uppercase tracking-wider border-b border-slate-100">
                  <th className="px-6 py-4">Student Profile & Verified Skills</th>
                  <th className="px-6 py-4">Register No</th>
                  <th className="px-6 py-4">Top Achievement</th>
                  <th className="px-6 py-4">Attendance</th>
                  <th className="px-6 py-4">CGPA</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/80">
                {searchResults.map((student) => (
                  <tr key={student.id} className="hover:bg-[#629176]/10 transition-colors group">
                    {/* Student particulars & skills */}
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-3">
                        <img src={student.image} alt={student.name} className="w-11 h-11 rounded-xl object-cover ring-1 ring-slate-200 shadow-sm shrink-0 mt-0.5" />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 text-sm block leading-tight">{student.name}</span>
                            <span className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                              {student.course}
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-400 font-medium block mt-0.5">
                            {student.department} • Sec {student.section} • Year {student.year}
                          </span>
                          
                          {/* Skills Pills under each student */}
                          <div className="flex flex-wrap gap-1 mt-2">
                            {student.skills.slice(0, 4).map((sk, idx) => (
                              <span key={idx} className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#629176]/15 text-[#0d4933] border border-[#629176]/30">
                                {sk}
                              </span>
                            ))}
                            {student.skills.length > 4 && (
                              <span className="px-1.5 py-0.5 rounded-md text-[9px] font-bold bg-slate-100 text-slate-600">
                                +{student.skills.length - 4}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-700 font-mono font-bold">
                      {student.registerNumber}
                    </td>

                    {/* Top Achievement */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 max-w-xs">
                        <Trophy className="w-4 h-4 text-amber-500 shrink-0" />
                        <span className="text-xs font-semibold text-slate-800 line-clamp-2 leading-snug">
                          {student.topAchievement}
                        </span>
                      </div>
                    </td>

                    {/* Attendance */}
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

                    {/* CGPA */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-800 font-mono">
                        {student.cgpa}
                      </span>
                    </td>

                    {/* Quick Profile + Full View 360 */}
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Profile Quick Preview Button */}
                        <button 
                          onClick={() => setSelectedQuickStudent(student)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-600 hover:text-white rounded-xl transition-all shadow-xs cursor-pointer border border-purple-200/70"
                          title="Quick View Profile Details"
                        >
                          <User className="w-3.5 h-3.5" />
                          <span>Profile</span>
                        </button>

                        {/* View 360 Full Dossier */}
                        <button 
                          onClick={() => navigate("/faculty/students/" + student.id)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-[#0d4933] bg-[#629176]/15 hover:bg-[#0d4933] hover:text-white rounded-xl transition-all shadow-xs cursor-pointer border border-[#629176]/40"
                          title="Open Comprehensive Student 360"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View 360</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Quick "Profile" Preview Modal */}
      <AnimatePresence>
        {selectedQuickStudent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedQuickStudent(null)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-2xl bg-white/95 backdrop-blur-2xl rounded-3xl shadow-[0_20px_70px_rgba(0,0,0,0.3)] border border-white/80 p-6 z-10 max-h-[90vh] overflow-y-auto custom-scrollbar"
            >
              {/* Header with Student Bio */}
              <div className="flex items-start justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-4">
                  <img 
                    src={selectedQuickStudent.image} 
                    alt={selectedQuickStudent.name} 
                    className="w-16 h-16 rounded-2xl object-cover ring-2 ring-[#0d4933]/30 shadow-md"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-extrabold text-slate-900">{selectedQuickStudent.name}</h3>
                      <span className="font-mono text-xs font-bold text-[#0d4933] bg-[#629176]/15 px-2 py-0.5 rounded-md border border-[#629176]/30">
                        {selectedQuickStudent.registerNumber}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 font-medium">
                      {selectedQuickStudent.course} • {selectedQuickStudent.department}
                    </p>
                    <div className="flex items-center gap-3 mt-1.5 text-xs">
                      <span className={`font-bold ${selectedQuickStudent.attendance < 75 ? "text-red-600" : "text-emerald-700"}`}>
                        Attendance: {selectedQuickStudent.attendance}%
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="font-bold text-purple-700">CGPA: {selectedQuickStudent.cgpa}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedQuickStudent(null)}
                  className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Personal Particulars */}
              <div className="py-4 space-y-4">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-purple-600" /> Student Profile & Contact Details
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-400 text-[11px] block">Official Email</span>
                    <span className="font-semibold text-slate-800 font-mono">{selectedQuickStudent.email}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-400 text-[11px] block">Phone Contact</span>
                    <span className="font-semibold text-slate-800 font-mono">{selectedQuickStudent.phone}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-400 text-[11px] block">Parent / Guardian</span>
                    <span className="font-semibold text-slate-800">{selectedQuickStudent.parentName} ({selectedQuickStudent.parentOccupation})</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-400 text-[11px] block">Residence Status</span>
                    <span className="font-bold text-[#0d4933]">{selectedQuickStudent.residenceType}</span>
                  </div>
                  <div className="sm:col-span-2 p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-400 text-[11px] block">Permanent Residential Address</span>
                    <span className="font-medium text-slate-700">{selectedQuickStudent.address}</span>
                  </div>
                </div>

                {/* Skills Section */}
                <div className="pt-2">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-2">
                    <Code2 className="w-3.5 h-3.5 text-[#0d4933]" /> Verified Technical Skills
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedQuickStudent.skills.map((sk, idx) => (
                      <span key={idx} className="px-3 py-1 rounded-xl text-xs font-bold bg-[#629176]/15 text-[#0d4933] border border-[#629176]/30">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Top Achievement */}
                <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/80 flex items-start gap-3">
                  <Trophy className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-amber-900">Key Institutional Achievement</p>
                    <p className="text-xs text-amber-800 mt-0.5">{selectedQuickStudent.topAchievement}</p>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => setSelectedQuickStudent(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Close Preview
                </button>

                <button
                  onClick={() => {
                    navigate("/faculty/students/" + selectedQuickStudent.id);
                  }}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#042821] via-[#0d4933] to-[#629176] hover:from-[#0d4933] hover:to-[#629176] shadow-md shadow-[#0d4933]/30 flex items-center gap-2 transition-all cursor-pointer"
                >
                  <span>Open Full 360 Dossier</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Student Modal */}
      <AddStudentModal
        isOpen={isAddStudentOpen}
        onClose={() => setIsAddStudentOpen(false)}
        onStudentAdded={handleStudentAdded}
      />
    </AmbientBackground>
  );
}
