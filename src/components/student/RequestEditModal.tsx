import { useState } from "react";
import { X, Lock, ShieldAlert, AlertCircle, Send } from "lucide-react";
import { profileRequestApi, type ProfileEditRequest } from "../../services/apiClient";

interface RequestEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (request: ProfileEditRequest) => void;
  preselectedField?: { section: string; field: string; currentValue: string };
}

export function RequestEditModal({
  isOpen,
  onClose,
  onSuccess,
  preselectedField,
}: RequestEditModalProps) {
  const [formData, setFormData] = useState({
    section_name: preselectedField?.section || "Personal Details",
    field_name: preselectedField?.field || "phone_number",
    current_value: preselectedField?.currentValue || "",
    requested_value: "",
    reason: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const FIELD_OPTIONS = [
    { section: "Personal Details", field: "phone_number", label: "Phone Number" },
    { section: "Personal Details", field: "address", label: "Permanent Residential Address" },
    { section: "Personal Details", field: "gender", label: "Gender" },
    { section: "Personal Details", field: "student_type", label: "Residence Type (Day Scholar / Hosteller)" },
    { section: "Parent / Guardian", field: "parent_name", label: "Parent / Guardian Full Name" },
    { section: "Parent / Guardian", field: "parent_phone", label: "Parent Emergency Contact Phone" },
    { section: "Parent / Guardian", field: "parent_occupation", label: "Parent Occupation" },
    { section: "Academic Background", field: "school_10th", label: "10th School / Board Name" },
    { section: "Academic Background", field: "percentage_10th", label: "10th Marks Percentage" },
    { section: "Academic Background", field: "school_12th", label: "12th School / Junior College" },
    { section: "Academic Background", field: "percentage_12th", label: "12th Marks Percentage" },
    { section: "Official Name", field: "full_name", label: "Official Name (Legal Change)" },
  ];

  const handleFieldChange = (fieldName: string) => {
    const opt = FIELD_OPTIONS.find((o) => o.field === fieldName);
    setFormData((prev) => ({
      ...prev,
      field_name: fieldName,
      section_name: opt?.section || "Personal Details",
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.requested_value.trim() || !formData.reason.trim()) {
      setError("Please provide both the Requested Value and a Reason for verification.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      let res;
      if (formData.field_name === "full_name") {
        res = await profileRequestApi.submitNameChangeRequest({
          requested_name: formData.requested_value.trim(),
          reason: formData.reason.trim(),
        });
      } else {
        res = await profileRequestApi.submitEditRequest({
          section_name: formData.section_name,
          field_name: formData.field_name,
          current_value: formData.current_value,
          requested_value: formData.requested_value.trim(),
          reason: formData.reason.trim(),
        });
      }

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
            <p className="text-xs text-slate-400">Class Advisor review & time-limited edit authorization</p>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-200/90 text-xs flex items-start gap-2.5 mb-5">
          <ShieldAlert className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
          <p className="leading-relaxed">
            Your profile is currently <strong>🔒 Locked</strong> for institutional audit integrity. Once your Class Advisor approves your request, you will receive a temporary <strong>24-hour edit window</strong> for this specific field.
          </p>
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
              Field to Modify
            </label>
            <select
              value={formData.field_name}
              onChange={(e) => handleFieldChange(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-white/10 text-white focus:outline-none focus:border-amber-400"
            >
              {FIELD_OPTIONS.map((opt) => (
                <option key={opt.field} value={opt.field}>
                  {opt.label} ({opt.section})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1.5 uppercase tracking-wider">
              New Requested Value
            </label>
            <input
              type="text"
              required
              value={formData.requested_value}
              onChange={(e) => setFormData({ ...formData, requested_value: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-amber-400 placeholder-slate-500"
              placeholder="Enter the updated value..."
            />
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1.5 uppercase tracking-wider">
              Reason for Request (Required by Advisor)
            </label>
            <textarea
              rows={3}
              required
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-amber-400 placeholder-slate-500"
              placeholder="e.g. Changed contact mobile number; need institutional record update..."
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
              <span>{loading ? "Submitting..." : "Submit to Advisor"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
