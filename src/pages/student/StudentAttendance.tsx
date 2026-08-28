import { useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Filter
} from "lucide-react";
import StudentLayout from "../../components/student/StudentLayout";
import { useStudentAuth } from "../../context/StudentAuthContext";

export default function StudentAttendance() {
  const { student } = useStudentAuth();
  const [selectedSemester, setSelectedSemester] = useState<number>(3);

  const subjects = student.attendanceBySemester[selectedSemester] || [
    { code: "23AI401", subject: "Artificial Intelligence Principles", total: 45, present: 40, absent: 5, percentage: 88.8 },
    { code: "23AI402", subject: "Deep Learning Architectures", total: 50, present: 45, absent: 5, percentage: 90.0 },
    { code: "23AI403", subject: "Computer Vision Systems", total: 40, present: 35, absent: 5, percentage: 87.5 },
    { code: "23AI404", subject: "Cloud Computing & DevOps", total: 38, present: 32, absent: 6, percentage: 84.2 }
  ];

  const totalClasses = subjects.reduce((sum, s) => sum + s.total, 0);
  const totalPresent = subjects.reduce((sum, s) => sum + s.present, 0);
  const totalAbsent = subjects.reduce((sum, s) => sum + s.absent, 0);
  const semesterPercentage = totalClasses > 0 ? Math.round((totalPresent / totalClasses) * 100) : 87;

  const isGoodStanding = semesterPercentage >= 85;

  return (
    <StudentLayout
      pageTitle="Attendance Record"
      subtitle="Comprehensive semester attendance breakdown & subject log"
      showBack={true}
    >
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
                Minimum mandatory attendance threshold prescribed by University Academic Council is 75.0%.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Classes</p>
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
            </div>
          </div>
        </div>

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
      </div>
    </StudentLayout>
  );
}
