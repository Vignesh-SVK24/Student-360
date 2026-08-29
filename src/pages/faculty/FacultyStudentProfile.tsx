import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, TrendingUp, User, ShieldCheck } from "lucide-react";
import { mockStudents } from "../../mock/data";
import { AmbientBackground } from "../../components/layout/AmbientBackground";
import { FacultyProfileDropdown } from "../../components/faculty/FacultyProfileDropdown";

export default function FacultyStudentProfile() {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const student = mockStudents.find(s => s.id === studentId);
  const [activeTab, setActiveTab] = useState("Overview");

  if (!student) {
    return (
      <AmbientBackground theme="light">
        <div className="min-h-screen flex flex-col items-center justify-center p-6">
          <div className="p-8 rounded-3xl bg-white/70 backdrop-blur-xl border border-white/60 text-center max-w-md">
            <h2 className="text-xl font-bold text-slate-900 mb-2">Student Not Found</h2>
            <p className="text-slate-500 text-sm mb-6">The requested student profile could not be located.</p>
            <button
              onClick={() => navigate('/faculty/dashboard')}
              className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs"
            >
              Return to Faculty Dashboard
            </button>
          </div>
        </div>
      </AmbientBackground>
    );
  }

  const tabs = ["Overview", "Academics", "Attendance", "Remarks & Mentorship"];

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

          <div className="flex items-center gap-3">
            <span className="text-xs font-bold px-3 py-1 rounded-xl bg-blue-50 text-blue-700 border border-blue-200">
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
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">{student.name}</h1>
                <ShieldCheck className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-sm font-bold text-blue-600 font-mono mb-3">{student.registerNumber}</p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs font-semibold text-slate-600">
                <span className="bg-slate-100/80 px-3 py-1 rounded-lg border border-slate-200/50">{student.department}</span>
                <span className="bg-slate-100/80 px-3 py-1 rounded-lg border border-slate-200/50">{student.course}</span>
                <span className="bg-slate-100/80 px-3 py-1 rounded-lg border border-slate-200/50">Year {student.year} • Sec {student.section}</span>
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

        {/* Tab Navigation */}
        <div className="flex space-x-2 border-b border-slate-200/60 pb-1">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                activeTab === tab 
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/25" 
                  : "text-slate-600 hover:bg-white/60"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content Cards */}
        {activeTab === "Overview" && (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 rounded-3xl bg-white/70 backdrop-blur-xl border border-white/60 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <User className="w-4 h-4 text-blue-600" /> Student Particulars
              </h3>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500">Official Email</span>
                  <span className="font-semibold text-slate-900 font-mono">{student.email || 'student@college.edu'}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500">Contact Number</span>
                  <span className="font-semibold text-slate-900 font-mono">{student.phone || '+91 98765 43210'}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500">Date of Birth</span>
                  <span className="font-semibold text-slate-900">{student.dob || '01 Jan 2005'}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-slate-500">Academic Mentor</span>
                  <span className="font-semibold text-blue-600">Dr. Sarah Jenkins</span>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white/70 backdrop-blur-xl border border-white/60 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-600" /> Performance Status
              </h3>
              <div className="space-y-4 text-xs">
                <div>
                  <div className="flex justify-between mb-1.5">
                    <span className="text-slate-600 font-semibold">Attendance Compliance (Target: 75%)</span>
                    <span className="font-bold text-slate-900">{student.attendance}%</span>
                  </div>
                  <div className="w-full bg-slate-200/80 rounded-full h-2.5 overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${student.attendance < 75 ? "bg-red-500" : "bg-emerald-500"}`} 
                      style={{ width: `${student.attendance}%` }}
                    />
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-blue-50/60 border border-blue-100 text-slate-700">
                  <p className="font-bold text-blue-900 mb-1">Faculty Advisory Note</p>
                  <p className="leading-relaxed">Student is maintaining excellent academic velocity with zero pending standing arrears.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "Academics" && (
          <div className="p-6 rounded-3xl bg-white/70 backdrop-blur-xl border border-white/60 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 mb-4">Semester-wise Grade Point Average</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { sem: "Semester I", gpa: "8.20" },
                { sem: "Semester II", gpa: "8.45" },
                { sem: "Semester III", gpa: "8.10" },
                { sem: "Semester IV", gpa: student.cgpa.toString() },
              ].map((s, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-white/80 border border-white text-center shadow-xs">
                  <span className="text-xs text-slate-400 font-bold block">{s.sem}</span>
                  <span className="text-2xl font-black text-slate-900 font-mono mt-1 block">{s.gpa}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "Attendance" && (
          <div className="p-6 rounded-3xl bg-white/70 backdrop-blur-xl border border-white/60 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900">Course-wise Attendance Breakdown</h3>
            <div className="space-y-3">
              {[
                { course: "CS601: Deep Learning & Neural Architectures", hours: "42/48", pct: 87.5 },
                { course: "CS602: Cloud Native Microservices", hours: "38/40", pct: 95.0 },
                { course: "CS603: Distributed Database Systems", hours: "30/36", pct: 83.3 },
                { course: "CS604: Applied Natural Language Processing", hours: "32/36", pct: 88.8 },
              ].map((c, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-white/80 border border-white flex items-center justify-between">
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">{c.course}</h4>
                    <p className="text-[11px] text-slate-400 font-medium">{c.hours} Attended Hours</p>
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-emerald-700 font-mono bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                    {c.pct}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "Remarks & Mentorship" && (
          <div className="p-6 rounded-3xl bg-white/70 backdrop-blur-xl border border-white/60 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">Institutional Faculty Endorsements</h3>
              <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2.5 py-1 rounded-lg">Official Record</span>
            </div>
            <div className="p-4 rounded-2xl bg-white/80 border border-white space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">Dr. Sarah Jenkins (Head of AI Research)</span>
                <span className="text-[11px] text-slate-400">12 Feb 2026</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Consistently exhibits outstanding problem-solving proficiency. Commendable performance in the Smart Campus AI Hackathon and continuous research initiative.
              </p>
            </div>
          </div>
        )}
      </main>
    </AmbientBackground>
  );
}
