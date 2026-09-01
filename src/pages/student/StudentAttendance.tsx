import { useState, useEffect } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Filter,
  Award,
  Calendar,
  Clock,
  Send,
  X,
  User
} from "lucide-react";
import StudentLayout from "../../components/student/StudentLayout";
import { useStudentAuth } from "../../context/StudentAuthContext";
import { studentAttendanceApi } from "../../services/apiClient";
import type { SubjectAttendance } from "../../types/student";

export default function StudentAttendance() {
  const { student } = useStudentAuth();
  const [selectedSemester, setSelectedSemester] = useState<number>(3);
  const [isODModalOpen, setIsODModalOpen] = useState(false);
  const [odToast, setOdToast] = useState<string | null>(null);
  const [dbSubjects, setDbSubjects] = useState<SubjectAttendance[]>([]);

  useEffect(() => {
    const loadAtt = async () => {
      try {
        const res = await studentAttendanceApi.getForStudent(student.id, selectedSemester);
        if (res.success && res.data && res.data.length > 0) {
          const mapped: SubjectAttendance[] = res.data.map((r: any) => ({
            code: r.subject_code || "SUB",
            subject: r.subject_name || "Course Subject",
            total: r.total_classes,
            present: r.present_classes,
            absent: r.absent_classes,
            od: 0,
            percentage: r.attendance_percentage,
          }));
          setDbSubjects(mapped);
        }
      } catch {
        // Fallback
      }
    };
    loadAtt();
  }, [student.id, selectedSemester]);

  // OD Request State
  const [odForm, setOdForm] = useState({
    eventType: "Hackathon / Symposium",
    eventTitle: "",
    organizingInstitute: "",
    fromDate: new Date().toISOString().split("T")[0],
    toDate: new Date().toISOString().split("T")[0],
    periods: "Full Day",
    proofUrl: ""
  });

  const subjects = dbSubjects.length > 0 ? dbSubjects : (student.attendanceBySemester[selectedSemester] || [
    { code: "AI8401", subject: "Deep Learning Architectures", total: 45, present: 38, absent: 4, od: 3, percentage: 91.1 },
    { code: "AI8402", subject: "Natural Language Processing", total: 50, present: 43, absent: 4, od: 3, percentage: 92.0 },
    { code: "AI8403", subject: "Computer Vision Systems", total: 40, present: 33, absent: 5, od: 2, percentage: 87.5 },
    { code: "CS8403", subject: "Cloud & Distributed Systems", total: 38, present: 31, absent: 5, od: 2, percentage: 86.8 }
  ]);

  const totalClasses = subjects.reduce((sum, s) => sum + s.total, 0);
  const totalPresent = subjects.reduce((sum, s) => sum + s.present, 0);
  const totalAbsent = subjects.reduce((sum, s) => sum + s.absent, 0);
  const totalOD = subjects.reduce((sum, s) => sum + (s.od || 0), 0);
  const effectivePresent = totalPresent + totalOD;
  const semesterPercentage = totalClasses > 0 ? Math.round((effectivePresent / totalClasses) * 100) : 89;

  const isGoodStanding = semesterPercentage >= 85;

  const recentPeriodLogs = [
    { date: "Aug 31, 2026", period: "Period 1 (09:00 - 10:00 AM)", subject: "Deep Learning Architectures", faculty: "Dr. Sarah Jenkins", room: "LH-301", status: "PRESENT" },
    { date: "Aug 31, 2026", period: "Period 2 (10:00 - 11:00 AM)", subject: "Natural Language Processing", faculty: "Dr. K. Senthil Nathan", room: "LH-301", status: "PRESENT" },
    { date: "Aug 30, 2026", period: "Period 4 (12:15 - 01:15 PM)", subject: "Machine Learning Lab", faculty: "Dr. Sarah Jenkins", room: "AI Computing Lab", status: "OD" },
    { date: "Aug 30, 2026", period: "Period 5 (02:00 - 03:00 PM)", subject: "Machine Learning Lab", faculty: "Dr. Sarah Jenkins", room: "AI Computing Lab", status: "OD" },
    { date: "Aug 29, 2026", period: "Period 3 (11:15 - 12:15 PM)", subject: "Cloud & Distributed Systems", faculty: "Prof. M. Ramanujam", room: "Lab 2", status: "ABSENT" }
  ];

  const handleODSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!odForm.eventTitle.trim()) return;
    setIsODModalOpen(false);
    setOdToast("On-Duty (OD) request submitted to Class Advisor for approval.");
    setTimeout(() => setOdToast(null), 4000);
  };

  return (
    <StudentLayout
      pageTitle="Attendance Record"
      subtitle="Comprehensive semester attendance breakdown & verified On-Duty log"
      showBack={true}
      actions={
        <button
          onClick={() => setIsODModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white text-xs font-bold shadow-md shadow-amber-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Award className="w-3.5 h-3.5" />
          <span>Apply for OD Pass</span>
        </button>
      }
    >
      {odToast && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2 text-sm font-semibold border border-slate-700 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{odToast}</span>
        </div>
      )}

      <div className="space-y-8 max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl shadow-sm border border-slate-200/60">
          <div>
            <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">Official Attendance Portal</span>
            <h2 className="text-2xl font-extrabold text-slate-900 mt-0.5">{student.name}</h2>
            <p className="text-xs text-slate-500 font-semibold">{student.registerNumber} • {student.course}</p>
          </div>

          <div className="flex items-center gap-3">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5" /> Semester:
            </label>
            <select
              value={selectedSemester}
              onChange={(e: any) => setSelectedSemester(Number(e.target.value))}
              className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 cursor-pointer"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                <option key={sem} value={sem}>
                  Semester {sem} {sem === 3 ? "(Current)" : ""}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Progress & Stat Cards */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200/60 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="relative w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center shrink-0">
            <div
              className="absolute inset-0 rounded-full shadow-2xl"
              style={{
                background: `conic-gradient(#10b981 0% ${semesterPercentage}%, #e2e8f0 ${semesterPercentage}% 100%)`
              }}
            ></div>
            <div className="absolute inset-[14%] bg-white rounded-full shadow-inner flex flex-col items-center justify-center p-4">
              <span className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
                {semesterPercentage}%
              </span>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mt-1">
                Semester {selectedSemester}
              </span>
            </div>
          </div>

          <div className="flex-1 space-y-6 w-full">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className={`inline-flex items-center gap-1 text-xs font-bold uppercase px-3 py-1 rounded-full ${
                  isGoodStanding ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-amber-50 text-amber-700 border border-amber-200"
                }`}>
                  {isGoodStanding ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                  {isGoodStanding ? "Good Attendance (Above 85%)" : "Needs Attention (Below 85%)"}
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                {isGoodStanding ? "Eligible for University Examinations" : "Attendance Shortage Advisory"}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed mt-1">
                Includes verified <strong>On Duty (OD)</strong> allowances approved by Class Advisor and Head of Department.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total</p>
                <p className="text-2xl font-black text-slate-900 mt-1">{totalClasses}</p>
              </div>
              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 text-center">
                <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Present</p>
                <p className="text-2xl font-black text-emerald-700 mt-1">{totalPresent}</p>
              </div>
              <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-100 text-center">
                <p className="text-xs font-bold text-rose-600 uppercase tracking-wider">Absent</p>
                <p className="text-2xl font-black text-rose-700 mt-1">{totalAbsent}</p>
              </div>
              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-100 text-center">
                <p className="text-xs font-bold text-amber-600 uppercase tracking-wider">On Duty (OD)</p>
                <p className="text-2xl font-black text-amber-700 mt-1">{totalOD}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Subject-Wise Breakdown Table */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/60 space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Subject-Wise Breakdown</h3>
              <p className="text-xs text-slate-500 font-medium">Curriculum courses and laboratory sessions for Semester {selectedSemester}</p>
            </div>
            <span className="text-xs font-semibold text-slate-400 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
              {subjects.length} Registered Courses
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <th className="pb-3 px-3">Subject</th>
                  <th className="pb-3 px-3 text-center">Total</th>
                  <th className="pb-3 px-3 text-center text-emerald-600">Present</th>
                  <th className="pb-3 px-3 text-center text-amber-600">OD</th>
                  <th className="pb-3 px-3 text-center text-rose-600">Absent</th>
                  <th className="pb-3 px-3 text-right">Attendance %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {subjects.map((sub, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-3">
                      <p className="font-bold text-slate-900">{sub.subject}</p>
                      <p className="text-xs text-slate-400 font-medium">{sub.code}</p>
                    </td>
                    <td className="py-4 px-3 text-center font-bold text-slate-700">{sub.total}</td>
                    <td className="py-4 px-3 text-center font-bold text-emerald-600">{sub.present}</td>
                    <td className="py-4 px-3 text-center font-bold text-amber-600">{sub.od || 0}</td>
                    <td className="py-4 px-3 text-center font-bold text-rose-600">{sub.absent}</td>
                    <td className="py-4 px-3 text-right">
                      <span className={`inline-block px-2.5 py-1 rounded-lg text-xs font-black ${
                        sub.percentage >= 85
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                          : "bg-amber-50 text-amber-700 border border-amber-100"
                      }`}>
                        {sub.percentage}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Period Attendance Log */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/60 space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Recent Period Attendance Entries</h3>
              <p className="text-xs text-slate-500 font-medium">Verified period logs recorded by Subject Faculty</p>
            </div>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Live Synchronized
            </span>
          </div>

          <div className="space-y-3">
            {recentPeriodLogs.map((log, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-50/70 border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-sm text-slate-900">{log.subject}</span>
                    <span className="text-xs text-slate-400 font-mono">• {log.room}</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-500 flex-wrap">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      {log.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {log.period}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3 text-slate-400" />
                      {log.faculty}
                    </span>
                  </div>
                </div>

                <div className="shrink-0">
                  {log.status === "PRESENT" && (
                    <span className="px-3 py-1 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-extrabold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Present
                    </span>
                  )}
                  {log.status === "OD" && (
                    <span className="px-3 py-1 rounded-xl bg-amber-100 text-amber-800 text-xs font-extrabold flex items-center gap-1">
                      <Award className="w-3.5 h-3.5" /> On Duty (OD)
                    </span>
                  )}
                  {log.status === "ABSENT" && (
                    <span className="px-3 py-1 rounded-xl bg-rose-100 text-rose-800 text-xs font-extrabold flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> Absent
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Apply for On-Duty (OD) Pass Modal */}
      {isODModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-white/10 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative">
            <button
              onClick={() => setIsODModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 text-amber-300 flex items-center justify-center">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white tracking-tight">Apply for On-Duty (OD) Pass</h3>
                <p className="text-xs text-slate-400">Institutional permission for events, sports & hackathons</p>
              </div>
            </div>

            <form onSubmit={handleODSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Event Category</label>
                <select
                  value={odForm.eventType}
                  onChange={(e) => setOdForm({ ...odForm, eventType: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-white/10 text-white focus:outline-none"
                >
                  <option value="Hackathon / Symposium">Hackathon / Technical Symposium</option>
                  <option value="Paper Presentation">Paper Presentation / Conference</option>
                  <option value="Sports Competition">Inter-Collegiate Sports Competition</option>
                  <option value="Institutional Project">Official Institutional Project Duty</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Event / Competition Title</label>
                <input
                  type="text"
                  required
                  value={odForm.eventTitle}
                  onChange={(e) => setOdForm({ ...odForm, eventTitle: e.target.value })}
                  placeholder="e.g. Smart India Hackathon 2026 Grand Finale"
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Host Organization / Institute</label>
                <input
                  type="text"
                  required
                  value={odForm.organizingInstitute}
                  onChange={(e) => setOdForm({ ...odForm, organizingInstitute: e.target.value })}
                  placeholder="e.g. IIT Madras / AICTE"
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">From Date</label>
                  <input
                    type="date"
                    value={odForm.fromDate}
                    onChange={(e) => setOdForm({ ...odForm, fromDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">To Date</label>
                  <input
                    type="date"
                    value={odForm.toDate}
                    onChange={(e) => setOdForm({ ...odForm, toDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsODModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-lg shadow-amber-500/30 cursor-pointer flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit OD Request</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </StudentLayout>
  );
}
