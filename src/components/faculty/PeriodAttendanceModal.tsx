import React, { useState, useEffect } from "react";
import {
  X,
  CheckCircle2,
  XCircle,
  Award,
  Calendar,
  Clock,
  BookOpen,
  Users,
  Check,
  Save,
  Search,
  AlertCircle
} from "lucide-react";
import { attendanceApi, type PeriodAttendanceMark } from "../../services/apiClient";
import type { Student } from "../../mock/data";

interface PeriodAttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  periodData: {
    day: string;
    periodNumber: number;
    subjectName: string;
    startTime: string;
    endTime: string;
    room?: string;
    slotId?: number;
  } | null;
  studentsList: Student[];
  onAttendanceSaved?: (stats: { present: number; absent: number; od: number }) => void;
}

export const PeriodAttendanceModal: React.FC<PeriodAttendanceModalProps> = ({
  isOpen,
  onClose,
  periodData,
  studentsList,
  onAttendanceSaved,
}) => {
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [attendanceMap, setAttendanceMap] = useState<Record<string, "PRESENT" | "ABSENT" | "OD">>({});
  const [notesMap, setNotesMap] = useState<Record<string, string>>({});
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");

  // Initialize all students to PRESENT by default when opened
  useEffect(() => {
    if (isOpen && studentsList.length > 0 && periodData) {
      setErrorMsg("");
      setSavedSuccess(false);

      // Check if backend already has records for this date and period
      attendanceApi
        .getPeriodAttendance(selectedDate, periodData.periodNumber)
        .then((res) => {
          if (res.success && res.data?.records && res.data.records.length > 0) {
            const newMap: Record<string, "PRESENT" | "ABSENT" | "OD"> = {};
            const newNotes: Record<string, string> = {};
            res.data.records.forEach((r: any) => {
              newMap[String(r.student_id)] = r.status;
              if (r.notes) newNotes[String(r.student_id)] = r.notes;
            });
            setAttendanceMap(newMap);
            setNotesMap(newNotes);
          } else {
            // Default everyone to PRESENT
            const defaultMap: Record<string, "PRESENT" | "ABSENT" | "OD"> = {};
            studentsList.forEach((s) => {
              defaultMap[s.id] = "PRESENT";
            });
            setAttendanceMap(defaultMap);
          }
        })
        .catch(() => {
          const defaultMap: Record<string, "PRESENT" | "ABSENT" | "OD"> = {};
          studentsList.forEach((s) => {
            defaultMap[s.id] = "PRESENT";
          });
          setAttendanceMap(defaultMap);
        });
    }
  }, [isOpen, periodData, selectedDate, studentsList]);

  if (!isOpen || !periodData) return null;

  const setStatusForStudent = (studentId: string, status: "PRESENT" | "ABSENT" | "OD") => {
    setAttendanceMap((prev) => ({ ...prev, [studentId]: status }));
  };

  const markAll = (status: "PRESENT" | "ABSENT" | "OD") => {
    const updated: Record<string, "PRESENT" | "ABSENT" | "OD"> = {};
    studentsList.forEach((s) => {
      updated[s.id] = status;
    });
    setAttendanceMap(updated);
  };

  // Counts
  const presentCount = studentsList.filter((s) => (attendanceMap[s.id] ?? "PRESENT") === "PRESENT").length;
  const absentCount = studentsList.filter((s) => attendanceMap[s.id] === "ABSENT").length;
  const odCount = studentsList.filter((s) => attendanceMap[s.id] === "OD").length;

  const filteredStudents = studentsList.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.registerNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = async () => {
    setLoading(true);
    setErrorMsg("");

    const payloadMarks: PeriodAttendanceMark[] = studentsList.map((s) => ({
      student_id: Number(s.id) || 1,
      status: attendanceMap[s.id] || "PRESENT",
      notes: notesMap[s.id] || undefined,
    }));

    try {
      const res = await attendanceApi.recordPeriodAttendance({
        date: selectedDate,
        day_of_week: periodData.day,
        period_number: periodData.periodNumber,
        subject_name: periodData.subjectName,
        timetable_slot_id: periodData.slotId,
        attendance: payloadMarks,
      });

      if (res.success) {
        setSavedSuccess(true);
        if (onAttendanceSaved) {
          onAttendanceSaved({
            present: presentCount,
            absent: absentCount,
            od: odCount,
          });
        }
        setTimeout(() => {
          setSavedSuccess(false);
          onClose();
        }, 1500);
      } else {
        setErrorMsg(res.error || "Failed to record attendance");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to save attendance");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white/95 backdrop-blur-xl border border-white/80 rounded-3xl w-full max-w-4xl max-h-[92vh] shadow-2xl flex flex-col overflow-hidden animate-scaleIn">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-[#042821] via-[#0d4933] to-[#629176] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/15 flex items-center justify-center border border-white/20 shadow-sm">
              <BookOpen className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-lg bg-emerald-400/20 text-emerald-200 border border-emerald-300/30 text-[11px] font-mono font-bold uppercase tracking-wider">
                  {periodData.day} • Period {periodData.periodNumber}
                </span>
                <span className="text-xs text-emerald-100 font-medium flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {periodData.startTime} - {periodData.endTime}
                </span>
              </div>
              <h3 className="font-extrabold text-lg leading-tight mt-0.5">
                {periodData.subjectName}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar & Filter Bar */}
        <div className="p-4 sm:px-6 bg-slate-50/90 border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-3 shrink-0">
          {/* Date Picker & Search */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-xs">
              <Calendar className="w-4 h-4 text-[#0d4933]" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="text-xs font-bold text-slate-800 focus:outline-none bg-transparent cursor-pointer"
              />
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Filter student..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0d4933]/30 w-44"
              />
            </div>
          </div>

          {/* Quick Bulk Actions */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider hidden sm:inline">
              Bulk:
            </span>
            <button
              type="button"
              onClick={() => markAll("PRESENT")}
              className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-100 hover:bg-emerald-200 text-emerald-800 border border-emerald-300 transition-colors cursor-pointer"
            >
              All Present
            </button>
            <button
              type="button"
              onClick={() => markAll("ABSENT")}
              className="px-2.5 py-1 rounded-lg text-xs font-bold bg-rose-100 hover:bg-rose-200 text-rose-800 border border-rose-300 transition-colors cursor-pointer"
            >
              All Absent
            </button>
          </div>
        </div>

        {/* Attendance Summary Counter Badges */}
        <div className="px-6 py-2.5 bg-white border-b border-slate-100 flex items-center gap-4 text-xs font-bold shrink-0 flex-wrap">
          <div className="flex items-center gap-1.5 text-slate-600">
            <Users className="w-4 h-4 text-slate-400" />
            <span>Total Enrolled: {studentsList.length}</span>
          </div>
          <div className="h-4 w-px bg-slate-200"></div>
          <div className="flex items-center gap-1.5 text-emerald-700">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span>Present: {presentCount}</span>
          </div>
          <div className="h-4 w-px bg-slate-200"></div>
          <div className="flex items-center gap-1.5 text-rose-600">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
            <span>Absent: {absentCount}</span>
          </div>
          <div className="h-4 w-px bg-slate-200"></div>
          <div className="flex items-center gap-1.5 text-amber-700">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span>On Duty (OD): {odCount}</span>
          </div>
        </div>

        {/* Scrollable Students Attendance Roster */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-2.5 custom-scrollbar">
          {filteredStudents.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-sm">
              No students match "{searchQuery}"
            </div>
          ) : (
            filteredStudents.map((student) => {
              const currentStatus = attendanceMap[student.id] ?? "PRESENT";

              return (
                <div
                  key={student.id}
                  className={`p-3 sm:p-3.5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    currentStatus === "PRESENT"
                      ? "bg-emerald-50/40 border-emerald-200/80 hover:border-emerald-300"
                      : currentStatus === "ABSENT"
                      ? "bg-rose-50/50 border-rose-200/80 hover:border-rose-300"
                      : "bg-amber-50/50 border-amber-200/80 hover:border-amber-300"
                  }`}
                >
                  {/* Student particulars: Profile Pic, Name, Register Number */}
                  <div className="flex items-center gap-3.5 min-w-0">
                    <img
                      src={student.image}
                      alt={student.name}
                      className="w-12 h-12 rounded-2xl object-cover ring-2 ring-white shadow-sm shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-bold text-sm text-slate-900 truncate">
                          {student.name}
                        </h4>
                        <span className="font-mono text-xs font-bold text-[#0d4933] bg-[#629176]/15 px-2 py-0.5 rounded border border-[#629176]/30">
                          {student.registerNumber}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {student.department} • Sec {student.section} • Year {student.year}
                      </p>
                    </div>
                  </div>

                  {/* 3-State Segmented Control: PRESENT | ABSENT | OD */}
                  <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center bg-white/90 p-1 rounded-xl border border-slate-200/80 shadow-xs">
                    {/* PRESENT Button */}
                    <button
                      type="button"
                      onClick={() => setStatusForStudent(student.id, "PRESENT")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer ${
                        currentStatus === "PRESENT"
                          ? "bg-emerald-600 text-white shadow-sm ring-1 ring-emerald-600"
                          : "text-slate-600 hover:text-emerald-700 hover:bg-emerald-50"
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Present</span>
                    </button>

                    {/* ABSENT Button */}
                    <button
                      type="button"
                      onClick={() => setStatusForStudent(student.id, "ABSENT")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer ${
                        currentStatus === "ABSENT"
                          ? "bg-rose-600 text-white shadow-sm ring-1 ring-rose-600"
                          : "text-slate-600 hover:text-rose-700 hover:bg-rose-50"
                      }`}
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Absent</span>
                    </button>

                    {/* OD (On Duty) Button */}
                    <button
                      type="button"
                      onClick={() => setStatusForStudent(student.id, "OD")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer ${
                        currentStatus === "OD"
                          ? "bg-amber-600 text-white shadow-sm ring-1 ring-amber-600"
                          : "text-slate-600 hover:text-amber-700 hover:bg-amber-50"
                      }`}
                      title="On Duty (Approved college event / symposium / sports)"
                    >
                      <Award className="w-3.5 h-3.5" />
                      <span>OD</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:px-6 border-t border-slate-100 bg-white flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            {savedSuccess && (
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-600" />
                Attendance saved successfully!
              </span>
            )}
            {errorMsg && (
              <span className="text-xs font-bold text-rose-700 bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-200 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-rose-600" />
                {errorMsg}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={handleSubmit}
              className="px-6 py-2.5 rounded-xl text-xs font-extrabold bg-[#0d4933] hover:bg-[#042821] text-white transition-all shadow-md shadow-[#0d4933]/25 disabled:opacity-50 flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{loading ? "Saving Attendance..." : "Save Attendance"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
