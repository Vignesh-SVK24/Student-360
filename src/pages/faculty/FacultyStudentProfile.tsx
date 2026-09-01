import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ChevronLeft, 
  TrendingUp, 
  User, 
  ShieldCheck, 
  Code2, 
  Trophy, 
  Briefcase, 
  Award, 
  Calendar, 
  CheckCircle2, 
  ExternalLink, 
  Mail, 
  Phone, 
  MapPin, 
  BookOpen, 
  Plus, 
  MessageSquare,
  Sparkles,
  KeyRound,
  Layers
} from "lucide-react";

const GithubIcon = () => (
  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
  </svg>
);
import { mockStudents } from "../../mock/data";
import { AmbientBackground } from "../../components/layout/AmbientBackground";
import { FacultyProfileDropdown } from "../../components/faculty/FacultyProfileDropdown";
import { TimetableModal } from "../../components/faculty/TimetableModal";
import { ProfileRequestsModal } from "../../components/faculty/ProfileRequestsModal";

export default function FacultyStudentProfile() {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const student = mockStudents.find(s => s.id === studentId);
  const [activeTab, setActiveTab] = useState("Overview");
  const [isTimetableOpen, setIsTimetableOpen] = useState(false);
  const [isRequestsModalOpen, setIsRequestsModalOpen] = useState(false);

  const [remarksList, setRemarksList] = useState([
    {
      id: "rem-1",
      facultyName: "Dr. Sarah Jenkins",
      designation: "Associate Professor & AI Lab Director",
      date: "Aug 20, 2026",
      grade: "Excellent",
      text: "Demonstrates exceptional analytical acumen in applied Machine Learning models. High initiative during hackathons."
    },
    {
      id: "rem-2",
      facultyName: "Dr. K. Senthil Nathan",
      designation: "Head of Department",
      date: "Jul 12, 2026",
      grade: "Good",
      text: "Regular in laboratory sessions. Well-maintained documentation and consistent collaborative skills in team projects."
    }
  ]);

  const [showAddRemark, setShowAddRemark] = useState(false);
  const [newGrade, setNewGrade] = useState("Excellent");
  const [newRemarkText, setNewRemarkText] = useState("");

  const handleAddRemark = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRemarkText.trim()) return;

    const newEntry = {
      id: "rem-" + Date.now(),
      facultyName: "Dr. Sarah Jenkins",
      designation: "Associate Professor & AI Lab Director",
      date: "Just now",
      grade: newGrade,
      text: newRemarkText.trim()
    };

    setRemarksList([newEntry, ...remarksList]);
    setNewRemarkText("");
    setShowAddRemark(false);
  };

  const tabs = [
    { id: "Overview", label: "Overview", icon: TrendingUp },
    { id: "Profile", label: "Profile", icon: User },
    { id: "Skills", label: "Skills", icon: Code2 },
    { id: "Achievements", label: "Achievements", icon: Trophy },
    { id: "Projects", label: "Projects", icon: Briefcase },
    { id: "Certificates", label: "Certificates", icon: Award },
    { id: "Attendance", label: "Attendance", icon: Calendar },
    { id: "Remarks", label: "Remarks & Mentorship", icon: MessageSquare },
  ];

  if (!student) {
    return (
      <AmbientBackground theme="light">
        <div className="min-h-screen flex flex-col items-center justify-center p-6">
          <div className="p-8 rounded-3xl bg-white/70 backdrop-blur-xl border border-white/60 text-center max-w-md">
            <h2 className="text-xl font-bold text-slate-900 mb-2">Student Not Found</h2>
            <p className="text-slate-500 text-sm mb-6">The requested student profile could not be located.</p>
            <button
              onClick={() => navigate('/faculty/dashboard')}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#042821] via-[#0d4933] to-[#629176] text-white font-bold text-xs shadow-md shadow-[#0d4933]/30"
            >
              Return to Faculty Dashboard
            </button>
          </div>
        </div>
      </AmbientBackground>
    );
  }

  const subjectAttendance = [
    { code: "23AI301", title: "Discrete Mathematics & Linear Algebra", total: 48, attended: 43, pct: 89.5 },
    { code: "23AI302", title: "Data Structures & Algorithms", total: 60, attended: 54, pct: 90.0 },
    { code: "23AI303", title: "Database Management Systems", total: 52, attended: 45, pct: 86.5 },
    { code: "23AI304", title: "Fundamentals of Machine Learning", total: 56, attended: 50, pct: 89.2 },
    { code: "23AI305", title: "Operating Systems & System Programming", total: 46, attended: 36, pct: 78.2 },
    { code: "23AI306", title: "Machine Learning Laboratory", total: 36, attended: 33, pct: 91.6 }
  ];

  return (
    <AmbientBackground theme="light">
      {/* Top Header */}
      <header className="sticky top-0 z-40 px-4 sm:px-8 py-3 w-full">
        <div className="max-w-7xl mx-auto px-5 py-3 rounded-2xl bg-white/75 backdrop-blur-xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate('/faculty/dashboard')}
              className="p-2 hover:bg-slate-100/80 rounded-xl text-slate-700 transition-all flex items-center gap-1.5 text-xs font-bold cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back to Directory</span>
            </button>
            <div className="h-5 w-px bg-slate-300/60"></div>
            <span className="text-xs font-bold text-slate-500">Student 360 Dossier / <strong className="text-slate-900">{student.name}</strong></span>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button
              type="button"
              onClick={() => setIsRequestsModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-900 text-xs font-bold transition-all cursor-pointer shadow-sm"
              title="Review Student Profile Edit Requests"
            >
              <KeyRound className="w-3.5 h-3.5 text-amber-700" />
              <span>Review Requests</span>
            </button>

            <button
              type="button"
              onClick={() => setIsTimetableOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#042821] via-[#0d4933] to-[#629176] hover:from-[#0d4933] hover:to-[#629176] text-white text-xs font-bold transition-all cursor-pointer shadow-md shadow-[#0d4933]/20"
              title="Open Weekly Time Table to Mark Period Attendance"
            >
              <Calendar className="w-3.5 h-3.5 text-emerald-300" />
              <span>Time Table</span>
            </button>

            <span className="text-xs font-bold px-3 py-1 rounded-xl bg-[#629176]/15 text-[#0d4933] border border-[#629176]/30">
              {student.registerNumber}
            </span>
            <div className="h-6 w-px bg-slate-300/60 hidden sm:block"></div>
            <FacultyProfileDropdown />
          </div>
        </div>
      </header>

      {/* Main Profile Dossier */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Hero Card */}
        <div className="rounded-3xl p-8 bg-white/70 backdrop-blur-xl border border-white/60 shadow-[0_12px_40px_rgb(0,0,0,0.04)] flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-center gap-6 z-10 text-center sm:text-left">
            <img 
              src={student.image} 
              alt={student.name} 
              className="w-28 h-28 rounded-2xl object-cover ring-4 ring-white shadow-xl" 
            />
            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-1 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">{student.name}</h1>
                <ShieldCheck className="w-5 h-5 text-[#0d4933]" />
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                  🔒 Locked Dossier
                </span>
              </div>
              <p className="text-sm font-bold text-[#0d4933] font-mono mb-3">{student.registerNumber}</p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs font-semibold text-slate-600">
                <span className="bg-slate-100/80 px-3 py-1 rounded-lg border border-slate-200/50">{student.department}</span>
                <span className="bg-slate-100/80 px-3 py-1 rounded-lg border border-slate-200/50">{student.course}</span>
                <span className="bg-slate-100/80 px-3 py-1 rounded-lg border border-slate-200/50">Year {student.year} • Sec {student.section}</span>
                <span className="bg-purple-50 text-purple-700 px-3 py-1 rounded-lg border border-purple-200 flex items-center gap-1 font-bold">
                  <Layers className="w-3 h-3 text-purple-600" />
                  <span>Cohort: Batch 2024-2028</span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 z-10">
            <div className="p-4 rounded-2xl bg-white/80 border border-white text-center shadow-sm min-w-28">
              <p className="text-slate-400 text-[11px] font-bold uppercase tracking-wider">Attendance</p>
              <p className={`text-2xl font-black mt-1 ${student.attendance < 75 ? "text-red-600" : "text-emerald-600"}`}>
                {student.attendance}%
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-white/80 border border-white text-center shadow-sm min-w-28">
              <p className="text-slate-400 text-[11px] font-bold uppercase tracking-wider">CGPA</p>
              <p className="text-2xl font-black text-purple-600 font-mono mt-1">
                {student.cgpa}
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation (All Sections Available to Faculty) */}
        <div className="flex space-x-2 border-b border-slate-200/60 pb-1 overflow-x-auto custom-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
                  activeTab === tab.id 
                    ? "bg-gradient-to-r from-[#042821] via-[#0d4933] to-[#629176] text-white shadow-md shadow-[#0d4933]/30" 
                    : "text-slate-600 hover:bg-white/60"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Cards */}
        {/* TAB 1: OVERVIEW */}
        {activeTab === "Overview" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <div className="p-6 rounded-3xl bg-white/70 backdrop-blur-xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.03)] space-y-4">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#0d4933]" />
                  <span>360° Academic & Co-Curricular Profile Summary</span>
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {student.name} is currently enrolled in Year {student.year} of {student.course}. 
                  Maintaining a cumulative grade point average of <strong className="text-purple-700">{student.cgpa}</strong> with 
                  an institutional attendance rate of <strong className={student.attendance < 75 ? "text-red-600" : "text-emerald-700"}>{student.attendance}%</strong>.
                </p>

                <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 flex items-start gap-3">
                  <Trophy className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-amber-900">Key Distinguishing Achievement</h4>
                    <p className="text-xs text-amber-800 mt-0.5">{student.topAchievement}</p>
                  </div>
                </div>

                <div className="pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Verified Skill Highlights</h4>
                  <div className="flex flex-wrap gap-2">
                    {student.skills.map((sk, idx) => (
                      <span key={idx} className="px-3 py-1 rounded-xl text-xs font-bold bg-[#629176]/15 text-[#0d4933] border border-[#629176]/30">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick Projects Preview */}
              <div className="p-6 rounded-3xl bg-white/70 backdrop-blur-xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.03)] space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-purple-600" />
                    <span>Featured Showcase Projects ({student.projectsList?.length || 0})</span>
                  </h3>
                  <button onClick={() => setActiveTab("Projects")} className="text-xs font-bold text-[#0d4933] hover:underline cursor-pointer">
                    View All Projects →
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {student.projectsList?.slice(0, 2).map((p, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-white/80 border border-slate-100 shadow-sm space-y-2">
                      <h4 className="text-sm font-bold text-slate-900">{p.title}</h4>
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{p.desc}</p>
                      <div className="flex flex-wrap gap-1 pt-1">
                        {p.tech.map((t, ti) => (
                          <span key={ti} className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar Quick Info */}
            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-white/70 backdrop-blur-xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.03)] space-y-4">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-slate-400">Personal Contact</h3>
                <div className="space-y-3 text-xs">
                  <div className="flex items-center gap-2.5 text-slate-700">
                    <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="font-mono">{student.email}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-slate-700">
                    <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="font-mono">{student.phone}</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-slate-700">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <span>{student.address}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100">
                  <button 
                    onClick={() => setActiveTab("Profile")} 
                    className="w-full py-2.5 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-600 hover:text-white text-xs font-bold transition-colors cursor-pointer border border-purple-200"
                  >
                    Open Complete Student Profile
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PROFILE (STUDENT PROFILE SECTION IN FACULTY PAGE) */}
        {activeTab === "Profile" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-6 rounded-3xl bg-white/70 backdrop-blur-xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.03)] space-y-5">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <User className="w-4 h-4 text-[#0d4933]" />
                <span>Personal Particulars</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-2xl bg-white/80 border border-slate-100">
                  <p className="text-slate-400 text-[11px] font-semibold">Full Name</p>
                  <p className="font-bold text-slate-900 mt-0.5">{student.name}</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-white/80 border border-slate-100">
                  <p className="text-slate-400 text-[11px] font-semibold">Register Number</p>
                  <p className="font-bold text-[#0d4933] font-mono mt-0.5">{student.registerNumber}</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-white/80 border border-slate-100">
                  <p className="text-slate-400 text-[11px] font-semibold">Date of Birth</p>
                  <p className="font-bold text-slate-900 mt-0.5">{student.dob}</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-white/80 border border-slate-100">
                  <p className="text-slate-400 text-[11px] font-semibold">Gender</p>
                  <p className="font-bold text-slate-900 mt-0.5">{student.gender}</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-white/80 border border-slate-100">
                  <p className="text-slate-400 text-[11px] font-semibold">Official Email</p>
                  <p className="font-bold text-slate-900 font-mono mt-0.5">{student.email}</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-white/80 border border-slate-100">
                  <p className="text-slate-400 text-[11px] font-semibold">Primary Contact</p>
                  <p className="font-bold text-slate-900 font-mono mt-0.5">{student.phone}</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-white/80 border border-slate-100">
                  <p className="text-slate-400 text-[11px] font-semibold">Residence Category</p>
                  <p className="font-bold text-purple-700 mt-0.5">{student.residenceType}</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-white/80 border border-slate-100">
                  <p className="text-slate-400 text-[11px] font-semibold">Department & Section</p>
                  <p className="font-bold text-slate-900 mt-0.5">{student.department} (Sec {student.section})</p>
                </div>
                <div className="sm:col-span-2 p-3.5 rounded-2xl bg-white/80 border border-slate-100">
                  <p className="text-slate-400 text-[11px] font-semibold">Permanent Residential Address</p>
                  <p className="font-medium text-slate-800 mt-0.5">{student.address}</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-white/70 backdrop-blur-xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.03)] space-y-4">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Parent / Guardian Information</span>
                </h3>

                <div className="space-y-3 text-xs">
                  <div className="p-3.5 rounded-2xl bg-white/80 border border-slate-100 flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-[11px] font-semibold">Father / Guardian Name</p>
                      <p className="font-bold text-slate-900 mt-0.5">{student.parentName}</p>
                    </div>
                    <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
                      {student.parentOccupation}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white/80 border border-slate-100">
                    <p className="text-slate-400 text-[11px] font-semibold">Guardian Emergency Contact</p>
                    <p className="font-bold text-slate-900 font-mono mt-0.5">{student.parentContact}</p>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-white/70 backdrop-blur-xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.03)] space-y-4">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-purple-600" />
                  <span>Prior Academic Schooling</span>
                </h3>

                <div className="space-y-3 text-xs">
                  <div className="p-3.5 rounded-2xl bg-white/80 border border-slate-100">
                    <p className="text-slate-400 text-[11px] font-semibold">10th Standard Matriculation</p>
                    <p className="font-bold text-slate-900 mt-0.5">{student.school10th}</p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white/80 border border-slate-100">
                    <p className="text-slate-400 text-[11px] font-semibold">12th Standard Higher Secondary</p>
                    <p className="font-bold text-slate-900 mt-0.5">{student.school12th}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: SKILLS SECTION */}
        {activeTab === "Skills" && (
          <div className="p-6 rounded-3xl bg-white/70 backdrop-blur-xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.03)] space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Code2 className="w-5 h-5 text-[#0d4933]" />
                  <span>Verified Skill Inventory & Competencies</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Categorized proficiency verified through lab coursework and project submissions</p>
              </div>
              <span className="px-3 py-1 rounded-xl text-xs font-bold bg-[#629176]/15 text-[#0d4933] border border-[#629176]/30">
                {student.skills.length} Technical Skills Verified
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {student.skills.map((skill, idx) => {
                const proficiency = idx % 3 === 0 ? "Expert" : idx % 3 === 1 ? "Advanced" : "Intermediate";
                const pct = idx % 3 === 0 ? 92 : idx % 3 === 1 ? 84 : 76;
                return (
                  <div key={idx} className="p-4 rounded-2xl bg-white/80 border border-slate-100 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-sm">{skill}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        proficiency === "Expert" 
                          ? "bg-purple-50 text-purple-700 border border-purple-200" 
                          : proficiency === "Advanced" 
                          ? "bg-[#629176]/15 text-[#0d4933] border border-[#629176]/30" 
                          : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      }`}>
                        {proficiency}
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-[11px] text-slate-500 font-semibold mb-1">
                        <span>Proficiency Index</span>
                        <span>{pct}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-[#042821] via-[#0d4933] to-[#629176] h-full rounded-full" 
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 4: ACHIEVEMENTS */}
        {activeTab === "Achievements" && (
          <div className="p-6 rounded-3xl bg-white/70 backdrop-blur-xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.03)] space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-500" />
                  <span>Honors, Hackathons & Co-Curricular Achievements</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Institutional, state, and national competitive recognitions</p>
              </div>
              <span className="px-3 py-1 rounded-xl text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                {student.achievementsList?.length || 0} Recognitions
              </span>
            </div>

            <div className="space-y-4">
              {student.achievementsList?.map((ach, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-white/80 border border-slate-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-600 shrink-0">
                      <Trophy className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-bold text-slate-900">{ach.title}</h4>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                          {ach.rank}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 font-medium mt-1">{ach.event}</p>
                    </div>
                  </div>

                  <div className="sm:text-right shrink-0">
                    <span className="text-xs font-bold text-slate-500 font-mono">{ach.date}</span>
                    <div className="text-[11px] font-bold text-emerald-600 flex items-center gap-1 sm:justify-end mt-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Verified by HOD</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: PROJECTS */}
        {activeTab === "Projects" && (
          <div className="p-6 rounded-3xl bg-white/70 backdrop-blur-xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.03)] space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-purple-600" />
                  <span>Capstone & Open Source Project Showcase</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Faculty evaluation of technical implementations and software architecture</p>
              </div>
              <span className="px-3 py-1 rounded-xl text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">
                {student.projectsList?.length || 0} Submissions
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {student.projectsList?.map((proj, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-white/80 border border-slate-100 shadow-sm flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-base font-bold text-slate-900">{proj.title}</h4>
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        Code Evaluated
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{proj.desc}</p>
                  </div>

                  <div className="space-y-3 pt-2 border-t border-slate-100">
                    <div className="flex flex-wrap gap-1.5">
                      {proj.tech.map((t, ti) => (
                        <span key={ti} className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#629176]/15 text-[#0d4933] border border-[#629176]/30/50">
                          {t}
                        </span>
                      ))}
                    </div>

                    <a 
                      href={proj.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-[#0d4933] transition-colors"
                    >
                      <GithubIcon />
                      <span>{proj.githubUrl}</span>
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: CERTIFICATES */}
        {activeTab === "Certificates" && (
          <div className="p-6 rounded-3xl bg-white/70 backdrop-blur-xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.03)] space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Award className="w-5 h-5 text-[#0d4933]" />
                  <span>Verified External Industry Certifications</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Third-party accredited credentials from AWS, Google, and Coursera</p>
              </div>
              <span className="px-3 py-1 rounded-xl text-xs font-bold bg-[#629176]/15 text-[#0d4933] border border-[#629176]/30">
                {student.certsList?.length || 0} Credentials
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {student.certsList?.map((cert, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-white/80 border border-slate-100 shadow-sm flex flex-col justify-between space-y-3">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-[#629176]/15 flex items-center justify-center text-[#0d4933] mb-3 border border-[#629176]/30">
                      <Award className="w-5 h-5" />
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 leading-snug">{cert.title}</h4>
                    <p className="text-xs text-slate-500 mt-1 font-medium">{cert.org}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] font-mono text-slate-400 font-semibold">{cert.date}</span>
                    <a 
                      href={cert.verifyUrl} 
                      target="_blank" 
                      rel="noreferrer"
                      className="text-xs font-bold text-[#0d4933] hover:underline flex items-center gap-1"
                    >
                      <span>Verify</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 7: ATTENDANCE */}
        {activeTab === "Attendance" && (
          <div className="p-6 rounded-3xl bg-white/70 backdrop-blur-xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.03)] space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[#0d4933]" />
                  <span>Course-Wise Attendance Compliance Log</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Statutory regulatory minimum requirement: 75% attendance</p>
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                <button
                  type="button"
                  onClick={() => setIsTimetableOpen(true)}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#0d4933] hover:bg-[#042821] text-white flex items-center gap-1.5 shadow-sm shadow-[#0d4933]/25 transition-colors cursor-pointer"
                >
                  <Calendar className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Time Table</span>
                </button>

                <span className={`px-3 py-1 rounded-xl text-xs font-bold ${
                  student.attendance < 75 ? "bg-red-50 text-red-600 border border-red-200" : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                }`}>
                  Overall: {student.attendance}% ({student.attendance < 75 ? "Debarment Risk" : "Compliant"})
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100/50 text-slate-500 text-[11px] font-bold uppercase tracking-wider border-b border-slate-100">
                    <th className="px-4 py-3">Course Code & Subject</th>
                    <th className="px-4 py-3 text-center">Conducted</th>
                    <th className="px-4 py-3 text-center">Attended</th>
                    <th className="px-4 py-3 text-center">Absent</th>
                    <th className="px-4 py-3 text-right">Percentage</th>
                    <th className="px-4 py-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {subjectAttendance.map((sub, i) => (
                    <tr key={i} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-4 py-3.5">
                        <span className="font-mono font-bold text-[#0d4933] mr-2">{sub.code}</span>
                        <span className="font-bold text-slate-800">{sub.title}</span>
                      </td>
                      <td className="px-4 py-3.5 text-center text-slate-600 font-mono">{sub.total} hrs</td>
                      <td className="px-4 py-3.5 text-center text-emerald-700 font-mono font-bold">{sub.attended} hrs</td>
                      <td className="px-4 py-3.5 text-center text-red-600 font-mono">{sub.total - sub.attended} hrs</td>
                      <td className="px-4 py-3.5 text-right font-black font-mono">
                        {sub.pct}%
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          sub.pct < 75 ? "bg-red-50 text-red-600 border border-red-200" : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        }`}>
                          {sub.pct < 75 ? "Deficient" : "Satisfactory"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 8: REMARKS & MENTORSHIP */}
        {activeTab === "Remarks" && (
          <div className="p-6 rounded-3xl bg-white/70 backdrop-blur-xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.03)] space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-[#0d4933]" />
                  <span>Faculty Mentorship & Conduct Remarks</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Official mentorship feedback registered in student permanent institutional transcript</p>
              </div>

              <button
                onClick={() => setShowAddRemark(!showAddRemark)}
                className="px-4 py-2 bg-gradient-to-r from-[#042821] via-[#0d4933] to-[#629176] hover:from-[#0d4933] hover:to-[#629176] text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md shadow-[#0d4933]/25 transition-all cursor-pointer self-start"
              >
                <Plus className="w-4 h-4" />
                <span>Add Faculty Remark</span>
              </button>
            </div>

            {/* Interactive Add Remark Box */}
            {showAddRemark && (
              <form onSubmit={handleAddRemark} className="p-5 rounded-2xl bg-[#629176]/10 border border-[#629176]/30 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#0d4933]">New Mentorship Assessment</h4>
                  <div className="flex items-center gap-2">
                    <label className="text-xs font-semibold text-slate-600">Grade Assessment:</label>
                    <select 
                      value={newGrade} 
                      onChange={(e) => setNewGrade(e.target.value)}
                      className="px-3 py-1 rounded-lg bg-white border border-[#629176]/30 text-xs font-bold text-[#0d4933] focus:outline-none"
                    >
                      <option value="Excellent">Excellent</option>
                      <option value="Good">Good</option>
                      <option value="Average">Average</option>
                      <option value="Needs Improvement">Needs Improvement</option>
                    </select>
                  </div>
                </div>

                <textarea
                  rows={3}
                  value={newRemarkText}
                  onChange={(e) => setNewRemarkText(e.target.value)}
                  placeholder="Enter detailed academic or behavioral assessment for this student..."
                  className="w-full p-3 rounded-xl bg-white border border-[#629176]/30 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#629176]/30"
                />

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddRemark(false)}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-200/60 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-[#042821] via-[#0d4933] to-[#629176] hover:from-[#0d4933] hover:to-[#629176] cursor-pointer"
                  >
                    Save Endorsement
                  </button>
                </div>
              </form>
            )}

            {/* Remarks Timeline */}
            <div className="space-y-4">
              {remarksList.map((rem) => (
                <div key={rem.id} className="p-5 rounded-2xl bg-white/80 border border-slate-100 shadow-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{rem.facultyName}</h4>
                      <p className="text-[11px] text-slate-500">{rem.designation}</p>
                    </div>
                    <div className="text-right">
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        rem.grade === "Excellent" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-[#629176]/15 text-[#0d4933] border border-[#629176]/30"
                      }`}>
                        {rem.grade}
                      </span>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">{rem.date}</p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed pt-2 border-t border-slate-100">
                    "{rem.text}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Weekly Time Table & Period Attendance Modal */}
      <TimetableModal
        isOpen={isTimetableOpen}
        onClose={() => setIsTimetableOpen(false)}
        studentsList={mockStudents}
      />

      {/* Review Profile Requests Modal */}
      <ProfileRequestsModal
        isOpen={isRequestsModalOpen}
        onClose={() => setIsRequestsModalOpen(false)}
      />
    </AmbientBackground>
  );
}
