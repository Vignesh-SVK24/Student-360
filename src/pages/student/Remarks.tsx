import {
  MessageSquare,
  ShieldCheck,
  Calendar
} from "lucide-react";
import StudentLayout from "../../components/student/StudentLayout";
import { useStudentAuth } from "../../context/StudentAuthContext";

export default function Remarks() {
  const { student } = useStudentAuth();

  const getGradeBadge = (grade: string) => {
    switch (grade) {
      case "Excellent":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "Good":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Better":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "Average":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "Poor":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <StudentLayout
      pageTitle="Faculty Remarks"
      subtitle="Official faculty evaluations, academic mentorship & conduct appraisals"
      showBack={true}
    >
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-between text-xs text-indigo-900">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
            <span className="font-semibold">
              Faculty remarks are confidential institutional appraisals and are strictly read-only for students.
            </span>
          </div>
          <span className="font-bold text-[10px] uppercase bg-indigo-200/60 px-2 py-0.5 rounded text-indigo-800 hidden sm:inline">
            Official Record
          </span>
        </div>

        {student.remarks.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-slate-200/60 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <MessageSquare className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-800">No faculty remarks logged yet</h3>
            <p className="text-slate-500 text-sm">
              Faculty appraisals after semester reviews and project evaluations will appear here.
            </p>
          </div>
        ) : (
          <div className="relative border-l-2 border-slate-200 pl-6 ml-4 space-y-8 my-6">
            {student.remarks.map((rem) => (
              <div key={rem.id} className="relative group">
                <div className="absolute -left-[35px] top-1 w-6 h-6 rounded-full bg-white border-2 border-purple-500 flex items-center justify-center shadow-sm">
                  <div className="w-2 h-2 rounded-full bg-purple-600"></div>
                </div>

                <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-slate-200/70 hover:shadow-md hover:border-purple-200 transition-all space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                    <div>
                      <h4 className="text-base font-bold text-slate-900 leading-snug">{rem.facultyName}</h4>
                      <p className="text-xs text-slate-500 font-medium">{rem.facultyDesignation}</p>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-center">
                      <span className={`text-xs font-extrabold uppercase px-3 py-1 rounded-full border ${getGradeBadge(rem.grade)}`}>
                        {rem.grade}
                      </span>
                    </div>
                  </div>

                  <p className="text-slate-700 text-sm leading-relaxed italic">
                    "{rem.remark}"
                  </p>

                  <div className="pt-2 flex items-center justify-between text-xs text-slate-400 font-medium">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" /> Date: {rem.date}
                    </span>
                    <span className="text-[11px] text-slate-400">Institutional Ref: #{rem.id}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </StudentLayout>
  );
}
