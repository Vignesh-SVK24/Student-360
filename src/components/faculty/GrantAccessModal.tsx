import React, { useState, useEffect } from "react";
import {
  X,
  ShieldCheck,
  ShieldAlert,
  KeyRound,
  Check,
  Copy,
  UserCheck,
  UserX,
  Eye,
  EyeOff,
  Lock
} from "lucide-react";
import { studentApi } from "../../services/apiClient";
import type { Student } from "../../mock/data";

interface GrantAccessModalProps {
  student: Student | null;
  isOpen: boolean;
  onClose: () => void;
  onAccessUpdated?: (updatedStatus: boolean) => void;
}

export const GrantAccessModal: React.FC<GrantAccessModalProps> = ({
  student,
  isOpen,
  onClose,
  onAccessUpdated,
}) => {
  const [isActive, setIsActive] = useState<boolean>(true);
  const [newPassword, setNewPassword] = useState<string>("Student@360");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");

  useEffect(() => {
    if (student && isOpen) {
      setSavedSuccess(false);
      setErrorMsg("");
      setLoading(true);
      studentApi
        .getStudentAccess(student.id)
        .then((res) => {
          if (res.success && res.data) {
            setIsActive(res.data.is_active ?? true);
          }
        })
        .finally(() => setLoading(false));
    }
  }, [student, isOpen]);

  if (!isOpen || !student) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const res = await studentApi.updateStudentAccess(student.id, {
        is_active: isActive,
        new_password: newPassword ? newPassword : undefined,
      });

      if (res.success) {
        setSavedSuccess(true);
        if (onAccessUpdated) {
          onAccessUpdated(isActive);
        }
        setTimeout(() => {
          setSavedSuccess(false);
        }, 3000);
      } else {
        setErrorMsg(res.error || "Failed to update student access");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to save");
    } finally {
      setLoading(false);
    }
  };

  const copyCredentials = () => {
    const creds = `🎓 STUDENT 360 — PORTAL ACCESS GRANTED
Student Name: ${student.name}
Register Number: ${student.registerNumber}
Department: ${student.department} (Sec ${student.section})
Login URL: ${window.location.origin}/#/login/student
Username: ${student.registerNumber}
Password: ${newPassword || "Student@360"}
Status: ${isActive ? "ACTIVE & AUTHORIZED" : "ACCESS REVOKED"}`;

    navigator.clipboard.writeText(creds);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white/95 backdrop-blur-xl border border-white/80 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-scaleIn">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-[#042821] via-[#0d4933] to-[#629176] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center border border-white/20">
              <KeyRound className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <h3 className="font-bold text-base">Student Portal Access</h3>
              <p className="text-xs text-emerald-100/80">Manage login credentials & authorization</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSave} className="p-6 space-y-5">
          {/* Student Profile Overview */}
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/70">
            <img
              src={student.image}
              alt={student.name}
              className="w-14 h-14 rounded-2xl object-cover ring-2 ring-[#0d4933]/20 shadow-sm shrink-0"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-slate-900 text-sm truncate">{student.name}</h4>
                <span className="font-mono text-xs font-bold text-[#0d4933] bg-[#629176]/15 px-2 py-0.5 rounded border border-[#629176]/30">
                  {student.registerNumber}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {student.course} • {student.department} • Sec {student.section}
              </p>
            </div>
          </div>

          {/* Access Status Switcher */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider">
              Student Login Authorization
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setIsActive(true)}
                className={`py-3 px-4 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  isActive
                    ? "bg-emerald-50 border-emerald-400 text-emerald-800 shadow-sm ring-1 ring-emerald-400/40"
                    : "bg-slate-50/70 border-slate-200 text-slate-500 hover:bg-slate-100"
                }`}
              >
                <UserCheck className="w-4 h-4 text-emerald-600" />
                <span>Access Granted</span>
              </button>

              <button
                type="button"
                onClick={() => setIsActive(false)}
                className={`py-3 px-4 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  !isActive
                    ? "bg-rose-50 border-rose-400 text-rose-800 shadow-sm ring-1 ring-rose-400/40"
                    : "bg-slate-50/70 border-slate-200 text-slate-500 hover:bg-slate-100"
                }`}
              >
                <UserX className="w-4 h-4 text-rose-600" />
                <span>Access Revoked</span>
              </button>
            </div>
          </div>

          {/* Set / Reset Password */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Reset / Change Password
              </label>
              <button
                type="button"
                onClick={() => setNewPassword("Student@360")}
                className="text-[11px] font-bold text-[#0d4933] hover:underline cursor-pointer"
              >
                Default (Student@360)
              </button>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new temporary password"
                className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0d4933]/30 focus:border-[#0d4933]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[11px] text-slate-400">
              Student can log in using either their Register Number (<span className="font-mono font-semibold">{student.registerNumber}</span>) or registered email.
            </p>
          </div>

          {/* Copy Card Preview */}
          <div className="p-3.5 rounded-2xl bg-emerald-50/50 border border-emerald-200/60 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Ready to share credentials with student</span>
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                Click to copy pre-formatted access message for WhatsApp / Email
              </p>
            </div>
            <button
              type="button"
              onClick={copyCredentials}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shrink-0 cursor-pointer ${
                copied
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-white text-[#0d4933] border border-emerald-300 hover:bg-emerald-100"
              }`}
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Copied!" : "Copy Card"}</span>
            </button>
          </div>

          {/* Status feedback */}
          {savedSuccess && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-semibold flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Student portal authorization updated successfully!</span>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-300 text-rose-800 text-xs font-semibold flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-[#0d4933] hover:bg-[#042821] text-white transition-all shadow-md shadow-[#0d4933]/20 disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
            >
              {loading ? "Saving..." : "Save Access Settings"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
