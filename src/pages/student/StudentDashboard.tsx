import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Trophy,
  Award,
  Briefcase,
  Code2,
  TrendingUp,
  Sparkles,
  ArrowUpRight,
  Calendar,
  Clock,
  ChevronRight,
  Star
} from "lucide-react";
import StudentLayout from "../../components/student/StudentLayout";
import { useStudentAuth } from "../../context/StudentAuthContext";

export default function StudentDashboard() {
  const navigate = useNavigate();
  const { student } = useStudentAuth();

  const summaryCards = [
    {
      title: "Attendance",
      value: student.overallAttendance + "%",
      sub: student.overallAttendance >= 85 ? "Good Standing" : "Needs Attention",
      icon: TrendingUp,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      border: "border-emerald-100",
      path: "/student/attendance"
    },
    {
      title: "Cumulative GPA",
      value: student.academic.cgpa.toString(),
      sub: "No Active Arrears",
      icon: Star,
      color: "text-[#0d4933]",
      bg: "bg-[#629176]/15",
      border: "border-[#629176]/30",
      path: "/student/profile"
    },
    {
      title: "Achievements",
      value: student.achievements.length.toString(),
      sub: "National & Regional",
      icon: Trophy,
      color: "text-purple-600",
      bg: "bg-purple-50",
      border: "border-purple-100",
      path: "/student/achievements"
    },
    {
      title: "Verified Skills",
      value: student.skills.length.toString(),
      sub: "Across 4 Disciplines",
      icon: Code2,
      color: "text-[#0d4933]",
      bg: "bg-[#629176]/15",
      border: "border-[#629176]/30",
      path: "/student/skills"
    },
    {
      title: "Projects",
      value: student.projects.length.toString(),
      sub: "Production & Research",
      icon: Briefcase,
      color: "text-pink-600",
      bg: "bg-pink-50",
      border: "border-pink-100",
      path: "/student/projects"
    },
    {
      title: "Certificates",
      value: student.certificates.length.toString(),
      sub: "AWS, DeepLearning.AI",
      icon: Award,
      color: "text-amber-600",
      bg: "bg-amber-50",
      border: "border-amber-100",
      path: "/student/certificates"
    }
  ];

  return (
    <StudentLayout>
      <div className="space-y-8">
        {/* Welcome Greeting */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100/70 text-purple-700 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" /> Academic Overview
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Good Morning, {student.name.split(" ")[0]}
            </h1>
            <p className="text-slate-500 font-medium text-sm sm:text-base mt-1">
              Here is your comprehensive academic performance, portfolio, and milestones.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/student/profile"
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold shadow-sm border border-slate-200/80 transition-all flex items-center gap-1.5"
            >
              View Full Profile
            </Link>
          </div>
        </div>

        {/* Hero Profile & Attendance Feature Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/60 relative overflow-hidden flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="absolute right-0 top-0 w-1/3 h-full bg-gradient-to-l from-purple-50/70 to-transparent pointer-events-none"></div>

          {/* Left: Student Identity */}
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="relative">
              <img
                src={student.profileImage}
                alt={student.name}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover shadow-lg ring-4 ring-purple-50"
              />
              <span className="absolute -bottom-2 -right-2 px-2.5 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-bold shadow-sm border-2 border-white">
                Active
              </span>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {student.name}
                </h2>
                <span className="px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 text-xs font-bold border border-purple-100">
                  {student.registerNumber}
                </span>
              </div>

              <p className="text-slate-600 font-semibold text-sm mb-3">
                {student.course} • {student.department}
              </p>

              <div className="flex flex-wrap gap-2 text-xs font-medium text-slate-500">
                <span className="bg-slate-100 px-3 py-1 rounded-lg">Year {student.year}</span>
                <span className="bg-slate-100 px-3 py-1 rounded-lg">Section {student.section}</span>
                <span className="bg-[#629176]/15 text-[#0d4933] px-3 py-1 rounded-lg font-semibold border border-[#629176]/30">
                  {student.personal.residenceType}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Prominent Pulsing Attendance Button */}
          <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6 lg:border-l lg:border-slate-100 lg:pl-8">
            <div className="text-center sm:text-right hidden sm:block">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Overall Record</p>
              <p className="text-slate-700 text-sm font-semibold mt-0.5">Classes Attended</p>
              <span className="text-xs text-emerald-600 font-bold">Good Attendance Rate</span>
            </div>

            <motion.button
              onClick={() => navigate("/student/attendance")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative group cursor-pointer"
              title="Click to view full attendance breakdown"
            >
              <div className="absolute -inset-2 bg-emerald-400/30 rounded-full blur-xl group-hover:bg-emerald-400/50 transition-all animate-pulse"></div>
              
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex flex-col items-center justify-center text-white shadow-xl shadow-emerald-500/30 border-4 border-white">
                <span className="text-2xl sm:text-3xl font-black tracking-tight leading-none">
                  {student.overallAttendance}%
                </span>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-100 mt-1">
                  Attendance
                </span>
                <span className="text-[9px] font-semibold text-emerald-200 mt-0.5 group-hover:underline flex items-center gap-0.5">
                  View <ArrowUpRight className="w-2.5 h-2.5" />
                </span>
              </div>
            </motion.button>
          </div>
        </div>

        {/* Profile Completion Indicator */}
        <div className="bg-gradient-to-r from-[#042821] via-[#0d4933] to-[#629176] rounded-3xl p-6 text-white shadow-lg relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1 max-w-xl">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-300" />
              <span className="text-xs font-bold tracking-wider uppercase text-purple-200">
                Profile Readiness
              </span>
            </div>
            <h3 className="text-xl font-bold text-white">Profile Completion — 88%</h3>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Complete your profile by adding your latest verified certifications and publishing your live project demos.
            </p>
          </div>

          <div className="w-full md:w-64 space-y-2">
            <div className="flex justify-between text-xs font-bold text-purple-200">
              <span>Overall Progress</span>
              <span>88%</span>
            </div>
            <div className="w-full h-2.5 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-emerald-400 to-purple-300 rounded-full w-[88%] transition-all"></div>
            </div>
            <Link
              to="/student/profile"
              className="inline-block text-xs font-bold text-purple-200 hover:text-white hover:underline mt-1"
            >
              Update Profile Details →
            </Link>
          </div>
        </div>

        {/* Summary Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {summaryCards.map((card, i) => (
            <motion.div
              key={i}
              onClick={() => navigate(card.path)}
              whileHover={{ y: -4, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`bg-white rounded-2xl p-5 shadow-sm border ${card.border} hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl ${card.bg} ${card.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <card.icon className="w-5 h-5" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 transition-colors" />
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-500 mb-1">{card.title}</p>
                <h4 className="text-2xl font-black text-slate-900 tracking-tight mb-1">{card.value}</h4>
                <p className="text-[11px] font-medium text-slate-400 truncate">{card.sub}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Two-Column Showcase: Recent Projects & Recent Achievements */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Projects Preview */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/60 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-pink-600" /> Featured Projects
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">Engineered solutions & live demonstrations</p>
                </div>
                <Link
                  to="/student/projects"
                  className="text-xs font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1 hover:underline"
                >
                  View All ({student.projects.length}) <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="space-y-4">
                {student.projects.slice(0, 2).map((proj) => (
                  <div
                    key={proj.id}
                    className="p-4 rounded-2xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50/50 transition-all flex items-start gap-4"
                  >
                    <img
                      src={proj.image}
                      alt={proj.title}
                      className="w-16 h-16 rounded-xl object-cover shrink-0 shadow-sm"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-slate-900 truncate mb-1">{proj.title}</h4>
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-2">
                        {proj.shortDescription}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {proj.technologies.slice(0, 3).map((t, idx) => (
                          <span key={idx} className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 mt-4 border-t border-slate-100 text-center">
              <Link
                to="/student/projects"
                className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold inline-flex items-center justify-center gap-2 transition-colors"
              >
                Explore All Projects <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Achievements Preview */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/60 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-purple-600" /> Recent Achievements
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">Awards, leadership & competitive milestones</p>
                </div>
                <Link
                  to="/student/achievements"
                  className="text-xs font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1 hover:underline"
                >
                  View All ({student.achievements.length}) <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="space-y-4">
                {student.achievements.slice(0, 2).map((ach) => (
                  <div
                    key={ach.id}
                    className="p-4 rounded-2xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50/50 transition-all flex items-start gap-4"
                  >
                    <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                      <Trophy className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="text-sm font-bold text-slate-900 truncate">{ach.title}</h4>
                        <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full shrink-0">
                          {ach.position}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                        {ach.description}
                      </p>
                      <p className="text-[11px] text-slate-400 font-medium mt-1.5 flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {ach.date} • {ach.organization}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 mt-4 border-t border-slate-100 text-center">
              <Link
                to="/student/achievements"
                className="w-full py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold inline-flex items-center justify-center gap-2 transition-colors"
              >
                View Full Honors & Awards <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Faculty Remarks Highlight */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/60">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Latest Faculty Feedback</h3>
              <p className="text-xs text-slate-500 font-medium">Official mentor and department appraisals</p>
            </div>
            <Link
              to="/student/remarks"
              className="text-xs font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1 hover:underline"
            >
              View Remarks Timeline ({student.remarks.length}) <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {student.remarks.length > 0 && (
            <div className="bg-slate-50/70 rounded-2xl p-5 border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1 max-w-3xl">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-900">{student.remarks[0].facultyName}</span>
                  <span className="text-[11px] text-slate-400">• {student.remarks[0].facultyDesignation}</span>
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-700">
                    {student.remarks[0].grade}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 italic leading-relaxed pt-1">
                  "{student.remarks[0].remark}"
                </p>
              </div>
              <span className="text-[11px] text-slate-400 shrink-0 font-medium flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> {student.remarks[0].date}
              </span>
            </div>
          )}
        </div>
      </div>
    </StudentLayout>
  );
}
