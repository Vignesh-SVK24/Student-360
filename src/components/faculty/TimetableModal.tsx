import React, { useState, useEffect } from "react";
import {
  X,
  Calendar,
  Clock,
  Edit2,
  Check,
  RotateCcw,
  MapPin,
  UserCheck
} from "lucide-react";
import {
  timetableApi,
  type WeeklyTimetableResponse,
  type TimetableSlot,
} from "../../services/apiClient";
import type { Student } from "../../mock/data";
import { PeriodAttendanceModal } from "./PeriodAttendanceModal";

interface TimetableModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentsList: Student[];
  onAttendanceSaved?: (stats: { present: number; absent: number; od: number }) => void;
}

const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export const TimetableModal: React.FC<TimetableModalProps> = ({
  isOpen,
  onClose,
  studentsList,
  onAttendanceSaved,
}) => {
  const [selectedDay, setSelectedDay] = useState<string>("Monday");
  const [timetableData, setTimetableData] = useState<WeeklyTimetableResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editSlot, setEditSlot] = useState<TimetableSlot | null>(null);
  const [savingSlot, setSavingSlot] = useState<boolean>(false);
  const [toastMsg, setToastMsg] = useState<string>("");

  // Period Attendance Modal state
  const [selectedPeriodForAttendance, setSelectedPeriodForAttendance] = useState<{
    day: string;
    periodNumber: number;
    subjectName: string;
    startTime: string;
    endTime: string;
    room?: string;
    slotId?: number;
  } | null>(null);

  const fetchTimetable = async () => {
    setLoading(true);
    try {
      const res = await timetableApi.getWeeklyTimetable();
      if (res.success && res.data) {
        setTimetableData(res.data);
      }
    } catch (err) {
      console.error("Failed to load timetable", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchTimetable();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentDayData = timetableData?.days.find((d) => d.day === selectedDay);
  const slots = currentDayData?.slots ?? [];

  const handleOpenEditSlot = (slot: TimetableSlot) => {
    setEditSlot({ ...slot });
    setIsEditing(true);
  };

  const handleSaveSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editSlot) return;

    setSavingSlot(true);
    try {
      const res = await timetableApi.updateSlot(editSlot.id, {
        subject_name: editSlot.subject_name,
        subject_code: editSlot.subject_code,
        start_time: editSlot.start_time,
        end_time: editSlot.end_time,
        room: editSlot.room,
        faculty_name: editSlot.faculty_name,
      });

      if (res.success) {
        setToastMsg(`Period #${editSlot.period_number} updated successfully!`);
        setIsEditing(false);
        setEditSlot(null);
        fetchTimetable();
        setTimeout(() => setToastMsg(""), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSavingSlot(false);
    }
  };

  const handleReset = async () => {
    if (window.confirm("Reset all 6 days timetable schedule back to curriculum defaults?")) {
      setLoading(true);
      try {
        const res = await timetableApi.resetTimetable();
        if (res.success && res.data) {
          setTimetableData(res.data);
          setToastMsg("Timetable reset to default schedule");
          setTimeout(() => setToastMsg(""), 3000);
        }
      } finally {
        setLoading(false);
      }
    }
  };

  const openAttendanceForSlot = (slot: TimetableSlot) => {
    setSelectedPeriodForAttendance({
      day: selectedDay,
      periodNumber: slot.period_number,
      subjectName: slot.subject_name,
      startTime: slot.start_time,
      endTime: slot.end_time,
      room: slot.room,
      slotId: slot.id,
    });
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
        <div className="bg-white/95 backdrop-blur-xl border border-white/80 rounded-3xl w-full max-w-5xl max-h-[92vh] shadow-2xl flex flex-col overflow-hidden animate-scaleIn">
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-[#042821] via-[#0d4933] to-[#629176] text-white flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-white/15 flex items-center justify-center border border-white/20 shadow-sm">
                <Calendar className="w-5 h-5 text-emerald-300" />
              </div>
              <div>
                <h3 className="font-extrabold text-lg leading-tight">Weekly Class Time Table</h3>
                <p className="text-xs text-emerald-100/80">
                  6-Day Schedule (Monday to Saturday) with Period Attendance Taking
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleReset}
                title="Reset schedule to defaults"
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white flex items-center gap-1.5 transition-colors cursor-pointer border border-white/20"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Reset Schedule</span>
              </button>

              <button
                onClick={onClose}
                className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* 6-Day Selector Tabs (Monday to Saturday) */}
          <div className="px-6 py-3 bg-slate-50 border-b border-slate-200/80 flex items-center gap-2 overflow-x-auto custom-scrollbar shrink-0">
            {DAYS_OF_WEEK.map((day) => {
              const isSelected = selectedDay === day;
              return (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all shrink-0 cursor-pointer ${
                    isSelected
                      ? "bg-[#0d4933] text-white shadow-md shadow-[#0d4933]/25"
                      : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {/* Alert / Notification Feedback */}
          {toastMsg && (
            <div className="mx-6 mt-3 p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{toastMsg}</span>
            </div>
          )}

          {/* Periods Table / Grid */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 custom-scrollbar">
            {loading ? (
              <div className="py-20 text-center text-slate-400 text-sm font-semibold">
                Loading {selectedDay} schedule...
              </div>
            ) : slots.length === 0 ? (
              <div className="py-16 text-center text-slate-500 text-sm">
                No periods scheduled for {selectedDay}.
              </div>
            ) : (
              slots.map((slot) => (
                <div
                  key={slot.id}
                  onClick={() => openAttendanceForSlot(slot)}
                  className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md hover:border-[#0d4933] hover:ring-2 hover:ring-[#0d4933]/15 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group cursor-pointer"
                  title="Click to select this period and mark student attendance"
                >
                  {/* Period Badge & Timings */}
                  <div className="flex items-start sm:items-center gap-3.5 min-w-0 flex-1">
                    <div className="w-12 h-12 rounded-2xl bg-[#629176]/15 text-[#0d4933] font-black flex flex-col items-center justify-center border border-[#629176]/30 shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                      <span className="text-[10px] uppercase tracking-wider font-bold">P</span>
                      <span className="text-base leading-none">{slot.period_number}</span>
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-extrabold text-sm text-slate-900 leading-tight group-hover:text-[#0d4933] transition-colors">
                          {slot.subject_name}
                        </h4>
                        {slot.subject_code && (
                          <span className="font-mono text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                            {slot.subject_code}
                          </span>
                        )}
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 opacity-80 group-hover:opacity-100 transition-opacity">
                          Click to Mark
                        </span>
                      </div>

                      <div className="flex items-center gap-4 text-xs text-slate-500 mt-1 flex-wrap font-medium">
                        <span className="flex items-center gap-1 text-[#0d4933] font-semibold">
                          <Clock className="w-3.5 h-3.5" />
                          {slot.start_time} - {slot.end_time}
                        </span>

                        {slot.room && (
                          <span className="flex items-center gap-1 text-slate-500">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            {slot.room}
                          </span>
                        )}

                        {slot.faculty_name && (
                          <span className="text-slate-400">
                            Faculty: <strong className="text-slate-600">{slot.faculty_name}</strong>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions: Edit Subject/Time & Take Attendance */}
                  <div 
                    className="flex items-center gap-2 shrink-0 self-end sm:self-center"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      type="button"
                      onClick={() => handleOpenEditSlot(slot)}
                      className="px-3 py-2 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                      title="Edit subject name or time slot"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit Slot</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => openAttendanceForSlot(slot)}
                      className="px-4 py-2 rounded-xl text-xs font-extrabold bg-[#0d4933] hover:bg-[#042821] text-white shadow-sm shadow-[#0d4933]/25 flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <UserCheck className="w-4 h-4 text-emerald-300" />
                      <span>Mark Attendance</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer note */}
          <div className="px-6 py-3 border-t border-slate-100 bg-slate-50/70 text-xs text-slate-500 flex items-center justify-between">
            <span>
              Click <strong>"Mark Attendance"</strong> on any period to record Present, Absent, or On Duty (OD) for that class.
            </span>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {/* In-Place Edit Slot Modal */}
      {isEditing && editSlot && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl p-6 border border-slate-100 animate-scaleIn space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-[#0d4933]" />
                Edit {selectedDay} • Period #{editSlot.period_number}
              </h4>
              <button
                onClick={() => setIsEditing(false)}
                className="w-7 h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveSlot} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider mb-1">
                  Subject Name
                </label>
                <input
                  type="text"
                  required
                  value={editSlot.subject_name}
                  onChange={(e) => setEditSlot({ ...editSlot, subject_name: e.target.value })}
                  placeholder="e.g. Deep Learning Lab"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0d4933]/30"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider mb-1">
                    Start Time
                  </label>
                  <input
                    type="text"
                    required
                    value={editSlot.start_time}
                    onChange={(e) => setEditSlot({ ...editSlot, start_time: e.target.value })}
                    placeholder="09:00 AM"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0d4933]/30"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider mb-1">
                    End Time
                  </label>
                  <input
                    type="text"
                    required
                    value={editSlot.end_time}
                    onChange={(e) => setEditSlot({ ...editSlot, end_time: e.target.value })}
                    placeholder="10:00 AM"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0d4933]/30"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider mb-1">
                    Subject Code
                  </label>
                  <input
                    type="text"
                    value={editSlot.subject_code || ""}
                    onChange={(e) => setEditSlot({ ...editSlot, subject_code: e.target.value })}
                    placeholder="AI8401"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0d4933]/30"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider mb-1">
                    Room / Lab
                  </label>
                  <input
                    type="text"
                    value={editSlot.room || ""}
                    onChange={(e) => setEditSlot({ ...editSlot, room: e.target.value })}
                    placeholder="LH-301 / Lab 2"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0d4933]/30"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider mb-1">
                  Faculty Name
                </label>
                <input
                  type="text"
                  value={editSlot.faculty_name || ""}
                  onChange={(e) => setEditSlot({ ...editSlot, faculty_name: e.target.value })}
                  placeholder="e.g. Dr. Sarah Jenkins"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0d4933]/30"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingSlot}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-[#0d4933] hover:bg-[#042821] text-white shadow-sm disabled:opacity-50"
                >
                  {savingSlot ? "Saving..." : "Update Period"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Period Attendance Modal */}
      {selectedPeriodForAttendance && (
        <PeriodAttendanceModal
          isOpen={true}
          onClose={() => setSelectedPeriodForAttendance(null)}
          periodData={selectedPeriodForAttendance}
          studentsList={studentsList}
          onAttendanceSaved={onAttendanceSaved}
        />
      )}
    </>
  );
};
