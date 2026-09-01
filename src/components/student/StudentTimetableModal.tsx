import { useState, useEffect } from "react";
import {
  X,
  Calendar,
  Clock,
  MapPin,
  User,
  Search
} from "lucide-react";
import { timetableApi, type DayTimetable } from "../../services/apiClient";

interface StudentTimetableModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function StudentTimetableModal({ isOpen, onClose }: StudentTimetableModalProps) {
  const [activeDay, setActiveDay] = useState<string>("Monday");
  const [days, setDays] = useState<DayTimetable[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  // Detect current day
  const todayName = new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(new Date());

  useEffect(() => {
    if (DAYS_OF_WEEK.includes(todayName)) {
      setActiveDay(todayName);
    }
  }, [todayName]);

  useEffect(() => {
    if (isOpen) {
      loadTimetable();
    }
  }, [isOpen]);

  const loadTimetable = async () => {
    setLoading(true);
    try {
      const res = await timetableApi.getWeeklyTimetable();
      if (res.success && res.data?.days) {
        setDays(res.data.days);
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const currentDayData = days.find((d) => d.day === activeDay);
  const slots = currentDayData?.slots || [];

  const filteredSlots = slots.filter((slot) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      slot.subject_name.toLowerCase().includes(q) ||
      (slot.subject_code && slot.subject_code.toLowerCase().includes(q)) ||
      (slot.faculty_name && slot.faculty_name.toLowerCase().includes(q)) ||
      (slot.room && slot.room.toLowerCase().includes(q))
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-white/10 rounded-3xl p-6 sm:p-8 max-w-4xl w-full shadow-2xl relative max-h-[90vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-white tracking-tight">Class Academic Schedule</h3>
                <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-extrabold border border-purple-500/30">
                  Semester 4
                </span>
              </div>
              <p className="text-xs text-slate-400">Official institutional 6-day lecture & laboratory schedule</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Day Selector & Search */}
        <div className="py-4 space-y-3">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
              {DAYS_OF_WEEK.map((day) => {
                const isSelected = activeDay === day;
                const isToday = todayName === day;
                return (
                  <button
                    key={day}
                    onClick={() => setActiveDay(day)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                      isSelected
                        ? "bg-purple-600 text-white shadow-lg shadow-purple-600/30 border border-purple-400/30"
                        : "bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5"
                    }`}
                  >
                    <span>{day}</span>
                    {isToday && (
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="Today"></span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search subject or faculty..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-purple-400"
              />
            </div>
          </div>
        </div>

        {/* Slots Content Area */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-3">
          {loading ? (
            <div className="text-center py-16 text-slate-400 text-xs">Loading schedule...</div>
          ) : filteredSlots.length === 0 ? (
            <div className="text-center py-16 bg-white/5 rounded-2xl border border-white/5 text-slate-400 text-xs">
              No periods scheduled matching your criteria.
            </div>
          ) : (
            filteredSlots.map((slot) => {
              const isBreak =
                slot.subject_name.toLowerCase().includes("break") ||
                slot.subject_name.toLowerCase().includes("lunch") ||
                slot.entry_type === "BREAK" ||
                slot.entry_type === "LUNCH";
              const isLab =
                slot.subject_name.toLowerCase().includes("lab") ||
                slot.subject_name.toLowerCase().includes("studio") ||
                slot.entry_type === "LAB";

              return (
                <div
                  key={slot.id}
                  className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    isBreak
                      ? "bg-amber-500/5 border-amber-500/20 text-amber-200"
                      : isLab
                      ? "bg-purple-500/10 border-purple-500/25 hover:border-purple-500/40 text-white"
                      : "bg-white/5 border-white/10 hover:border-white/20 text-white"
                  }`}
                >
                  <div className="flex items-start sm:items-center gap-3.5">
                    <div
                      className={`w-11 h-11 rounded-xl flex flex-col items-center justify-center shrink-0 font-mono font-bold text-xs ${
                        isBreak
                          ? "bg-amber-500/20 text-amber-300"
                          : isLab
                          ? "bg-purple-500/20 text-purple-300"
                          : "bg-white/10 text-slate-300"
                      }`}
                    >
                      <span className="text-[10px] text-slate-400 uppercase font-sans">Period</span>
                      <span>#{slot.period_number}</span>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-0.5">
                        <h4 className="font-bold text-sm text-white tracking-tight">{slot.subject_name}</h4>
                        {slot.subject_code && (
                          <span className="px-2 py-0.5 rounded-md bg-white/10 text-slate-300 text-[10px] font-mono font-semibold">
                            {slot.subject_code}
                          </span>
                        )}
                        {isLab && (
                          <span className="px-2 py-0.5 rounded-md bg-purple-500/30 text-purple-200 text-[10px] font-extrabold uppercase tracking-wider">
                            Practical Lab
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-4 text-xs text-slate-400 flex-wrap">
                        {slot.faculty_name && (
                          <span className="flex items-center gap-1">
                            <User className="w-3 h-3 text-slate-400" />
                            {slot.faculty_name}
                          </span>
                        )}
                        {slot.room && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            {slot.room}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <div className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 text-xs font-mono font-semibold flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-purple-400" />
                      <span>
                        {slot.start_time} – {slot.end_time}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="pt-4 mt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Classes are conducted according to Institutional Academic Calendar.</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
