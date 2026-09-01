import { useState } from "react";
import { X, Lock, ShieldAlert, AlertCircle, Send, CheckCircle2 } from "lucide-react";
import { profileRequestApi, type ProfileEditRequest } from "../../services/apiClient";

interface RequestEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (request: ProfileEditRequest) => void;
}

export function RequestEditModal({
  isOpen,
  onClose,
  onSuccess,
}: RequestEditModalProps) {
  const [reason, setReason] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      setError("Please provide a reason for modifying your profile for Class Advisor review.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const fullReason = summary.trim()
        ? `${reason.trim()} (Planned Updates: ${summary.trim()})`
        : reason.trim();

      const res = await profileRequestApi.submitEditRequest({
        section_name: "My Profile",
        field_name: "MY_PROFILE",
        current_value: "Locked",
        requested_value: "Full 'MY PROFILE' Edit Access",
        reason: fullReason,
      });

      if (res.success && res.data) {
        onSuccess(res.data);
        onClose();
      } else {
        setError(res.error || "Failed to submit request.");
      }
    } catch {
      setError("An unexpected error occurred while submitting.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-white/10 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight">Request Profile Modification</h3>
            <p className="text-xs text-slate-400">Class Advisor review & 24h full profile edit window</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-200/90 text-xs flex items-start gap-3 mb-5">
          <ShieldAlert className="w-5 h-5 shrink-0 text-amber-400 mt-0.5" />
          <div className="space-y-1.5 leading-relaxed">
            <p className="font-semibold text-amber-300">
              Institutional Profile Lock Policy
            </p>
            <p className="text-slate-300 text-[11px]">
              Your student profile is currently <strong>🔒 Locked</strong>. Submitting this single request allows your Class Advisor to grant you a temporary <strong>24-hour edit window</strong> to modify your entire <strong>"MY PROFILE"</strong> dossier.
            </p>
          </div>
        </div>

        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-3.5 mb-5 space-y-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Scope of Modification Granted Upon Approval:
          </span>
          <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Personal & Contact Info</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Parent / Guardian Details</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Residential Address</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Social & Portfolio Links</span>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-bold mb-1.5 uppercase tracking-wider">
              Reason for Requesting Profile Modification <span className="text-rose-400">*</span>
            </label>
            <textarea
              rows={3}
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-amber-400 placeholder-slate-500 text-xs"
              placeholder="e.g. Changed primary phone number, permanent address, and need to update parent emergency contact..."
            />
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1.5 uppercase tracking-wider">
              Planned Changes Summary <span className="text-slate-500 font-normal">(Optional)</span>
            </label>
            <input
              type="text"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-amber-400 placeholder-slate-500 text-xs"
              placeholder="e.g. Phone number, Mother's occupation, GitHub profile link"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-bold shadow-lg shadow-amber-500/30 cursor-pointer disabled:opacity-50 flex items-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{loading ? "Submitting..." : "Submit Request to Advisor"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
