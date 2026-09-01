import { useState } from "react";
import { X, Sparkles, CheckCircle2, AlertCircle, Lock } from "lucide-react";
import { profileRequestApi } from "../../services/apiClient";

interface CompleteProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CompleteProfileModal({ isOpen, onClose, onSuccess }: CompleteProfileModalProps) {
  const [formData, setFormData] = useState({
    phone_number: "",
    gender: "Male",
    address: "",
    student_type: "DAY SCHOLAR",
    parent_name: "",
    parent_phone: "",
    parent_occupation: "",
    parent_relationship: "Father",
    school_10th: "",
    percentage_10th: 90.0,
    school_12th: "",
    percentage_12th: 90.0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.phone_number.trim() || !formData.address.trim() || !formData.parent_name.trim()) {
      setError("Please complete all required fields.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const res = await profileRequestApi.completeProfile(formData);
      if (res.success) {
        onSuccess();
        onClose();
      } else {
        setError(res.error || "Failed to complete profile.");
      }
    } catch {
      setError("An error occurred while saving profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-white/10 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-[#0d4933] text-white flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight">Complete Student Dossier</h3>
            <p className="text-xs text-slate-400">First-time profile setup & institutional onboarding</p>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-200 text-xs flex items-start gap-2.5 mb-5">
          <Lock className="w-4 h-4 shrink-0 text-blue-400 mt-0.5" />
          <p className="leading-relaxed">
            Please fill in your authentic contact, guardian, and school background details. Once saved, your profile will be <strong>🔒 Permanently Locked</strong> and changes will require advisor permission.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Personal Info */}
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-2.5">
              Personal & Contact Information
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Mobile Phone</label>
                <input
                  type="text"
                  required
                  value={formData.phone_number}
                  onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-emerald-400"
                  placeholder="+91 98765 43210"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Gender</label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-white/10 text-white focus:outline-none"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Residence Status</label>
                <select
                  value={formData.student_type}
                  onChange={(e) => setFormData({ ...formData, student_type: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-white/10 text-white focus:outline-none"
                >
                  <option value="DAY SCHOLAR">Day Scholar</option>
                  <option value="HOSTELLER">Hosteller</option>
                </select>
              </div>
            </div>

            <div className="mt-3">
              <label className="block text-slate-300 font-bold mb-1">Permanent Residential Address</label>
              <input
                type="text"
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-emerald-400"
                placeholder="Door No, Street Name, City, State, PIN"
              />
            </div>
          </div>

          {/* Parent / Guardian */}
          <div className="pt-2 border-t border-slate-800">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-2.5">
              Parent / Guardian Details
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Parent Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.parent_name}
                  onChange={(e) => setFormData({ ...formData, parent_name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-emerald-400"
                  placeholder="Mr. S. Ramasamy"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Relationship</label>
                <select
                  value={formData.parent_relationship}
                  onChange={(e) => setFormData({ ...formData, parent_relationship: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-white/10 text-white focus:outline-none"
                >
                  <option value="Father">Father</option>
                  <option value="Mother">Mother</option>
                  <option value="Guardian">Legal Guardian</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Parent Phone</label>
                <input
                  type="text"
                  required
                  value={formData.parent_phone}
                  onChange={(e) => setFormData({ ...formData, parent_phone: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-emerald-400"
                  placeholder="+91 98400 12345"
                />
              </div>
            </div>
          </div>

          {/* School Background */}
          <div className="pt-2 border-t border-slate-800">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-2.5">
              Prior Academic Record
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-bold mb-1">10th School / Board</label>
                <input
                  type="text"
                  value={formData.school_10th}
                  onChange={(e) => setFormData({ ...formData, school_10th: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none"
                  placeholder="DAV Matric Higher Secondary"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-bold mb-1">10th Percentage (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.percentage_10th}
                  onChange={(e) => setFormData({ ...formData, percentage_10th: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none"
                />
              </div>
            </div>
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
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-[#0d4933] hover:from-emerald-500 hover:to-[#0d4933]/80 text-white font-bold shadow-lg shadow-emerald-500/30 cursor-pointer disabled:opacity-50 flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{loading ? "Locking Profile..." : "Save & Lock Profile"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
