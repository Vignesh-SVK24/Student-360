import { useState, useEffect } from "react";
import {
  X,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ShieldCheck,
  User,
  Lock,
  Unlock,
  MessageSquare
} from "lucide-react";
import { profileRequestApi, type ProfileEditRequest } from "../../services/apiClient";

interface ProfileRequestsModalProps {
  isOpen: boolean;
  onClose: () => void;
  classroomId?: number;
}

export function ProfileRequestsModal({ isOpen, onClose, classroomId }: ProfileRequestsModalProps) {
  const [requests, setRequests] = useState<ProfileEditRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [commentModal, setCommentModal] = useState<{ id: number; action: "APPROVE" | "REJECT" } | null>(null);
  const [commentText, setCommentText] = useState("");
  const [durationHours, setDurationHours] = useState(24);

  const fetchRequests = async () => {
    setLoading(true);
    setError("");
    try {
      if (classroomId) {
        const res = await profileRequestApi.getClassroomRequests(classroomId);
        if (res.success && res.data) {
          setRequests(res.data);
        }
      } else {
        const res = await profileRequestApi.getMyRequests();
        if (res.success && res.data) {
          setRequests(res.data);
        }
      }
    } catch {
      setError("Failed to load profile edit requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchRequests();
    }
  }, [isOpen, classroomId]);

  if (!isOpen) return null;

  const handleReview = async () => {
    if (!commentModal) return;
    setActionLoading(commentModal.id);
    try {
      if (commentModal.action === "APPROVE") {
        await profileRequestApi.approveRequest(commentModal.id, {
          advisor_comment: commentText || "Approved by Class Advisor",
          permission_duration_hours: durationHours,
        });
      } else {
        await profileRequestApi.rejectRequest(commentModal.id, {
          advisor_comment: commentText || "Rejected by Class Advisor",
        });
      }
      setCommentModal(null);
      setCommentText("");
      await fetchRequests();
    } catch {
      setError("Failed to update request state.");
    } finally {
      setActionLoading(null);
    }
  };

  const pendingCount = requests.filter(r => r.status === "PENDING").length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-white/10 rounded-3xl p-6 sm:p-8 max-w-4xl w-full shadow-2xl relative max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0d4933] to-[#629176] text-white flex items-center justify-center shadow-lg shadow-[#0d4933]/50">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-white tracking-tight">Student Profile Edit Approvals</h3>
                {pendingCount > 0 && (
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold text-xs border border-amber-500/30">
                    {pendingCount} Pending
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">Review and grant time-limited, field-level edit permissions</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors cursor-pointer p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto py-5 space-y-4 pr-1">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {loading ? (
            <div className="text-center py-12 text-slate-400 text-sm">Loading edit requests...</div>
          ) : requests.length === 0 ? (
            <div className="text-center py-16 bg-white/[0.02] border border-white/5 rounded-3xl">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2 opacity-60" />
              <h4 className="text-white font-bold text-sm">No Pending Profile Requests</h4>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                All student profiles are locked and up-to-date. When a student requests a field change, it will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {requests.map((req) => (
                <div
                  key={req.id}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                    req.status === "PENDING"
                      ? "bg-amber-500/[0.04] border-amber-500/30 shadow-md shadow-amber-500/5"
                      : req.status === "APPROVED"
                      ? "bg-emerald-500/[0.03] border-emerald-500/20"
                      : "bg-white/[0.02] border-white/5 opacity-70"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center text-slate-300">
                        <User className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-sm">{req.student_name || "Student"}</span>
                          <span className="text-[11px] font-mono text-[#629176] font-bold bg-[#0d4933]/40 px-2 py-0.5 rounded-md">
                            {req.student_register_number || `#${req.student_id}`}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3 text-slate-500" />
                          Requested {new Date(req.requested_at).toLocaleDateString()} at {new Date(req.requested_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                          req.status === "PENDING"
                            ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                            : req.status === "APPROVED"
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                            : req.status === "USED"
                            ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                            : "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                        }`}
                      >
                        {req.status === "PENDING" && <Clock className="w-3.5 h-3.5" />}
                        {req.status === "APPROVED" && <Unlock className="w-3.5 h-3.5" />}
                        {req.status === "USED" && <Lock className="w-3.5 h-3.5" />}
                        {req.status === "REJECTED" && <XCircle className="w-3.5 h-3.5" />}
                        {req.status}
                      </span>
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 p-3 rounded-xl bg-slate-950/40 border border-white/5 text-xs mb-3">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Target Field</span>
                      <span className="text-white font-semibold font-mono text-[11px]">{req.field_name}</span>
                      <span className="text-slate-500 text-[10px] block">({req.section_name})</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Current Value</span>
                      <span className="text-slate-400 font-medium">{req.current_value || "—"}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Requested Value</span>
                      <span className="text-emerald-300 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded">
                        {req.requested_value}
                      </span>
                    </div>
                  </div>

                  {/* Reason & Reviewer Notes */}
                  <div className="text-xs space-y-1.5 text-slate-300">
                    <p>
                      <span className="text-slate-400 font-semibold">Student Reason: </span>
                      <span className="italic">"{req.reason}"</span>
                    </p>
                    {req.advisor_comment && (
                      <p className="text-slate-400 text-[11px] flex items-center gap-1">
                        <MessageSquare className="w-3 h-3 text-[#629176]" />
                        <span className="font-semibold text-slate-300">Advisor Note: </span>
                        <span>{req.advisor_comment}</span>
                      </p>
                    )}
                    {req.permission && (
                      <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[11px] flex items-center justify-between">
                        <span>🔒 24h Edit Access Granted</span>
                        <span>Expires: {new Date(req.permission.expires_at).toLocaleString()}</span>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons for Pending */}
                  {req.status === "PENDING" && (
                    <div className="flex items-center justify-end gap-2 pt-3 mt-3 border-t border-white/5">
                      <button
                        type="button"
                        onClick={() => {
                          setCommentModal({ id: req.id, action: "REJECT" });
                          setCommentText("");
                        }}
                        disabled={actionLoading === req.id}
                        className="px-3 py-1.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 text-xs font-bold border border-rose-500/30 cursor-pointer transition-colors"
                      >
                        Reject
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setCommentModal({ id: req.id, action: "APPROVE" });
                          setCommentText("Approved for 24h single-field update");
                          setDurationHours(24);
                        }}
                        disabled={actionLoading === req.id}
                        className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-[#0d4933] to-[#629176] hover:from-[#0d4933]/90 text-white text-xs font-bold shadow-md shadow-[#0d4933]/40 cursor-pointer transition-all flex items-center gap-1.5"
                      >
                        <Unlock className="w-3.5 h-3.5" />
                        <span>Approve Edit Window</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-white/10 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold cursor-pointer transition-colors"
          >
            Close
          </button>
        </div>

        {/* Review Comment Sub-Modal */}
        {commentModal && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-md w-full shadow-2xl">
              <h4 className="text-base font-bold text-white mb-1">
                {commentModal.action === "APPROVE" ? "Approve Edit Request" : "Reject Edit Request"}
              </h4>
              <p className="text-xs text-slate-400 mb-4">
                {commentModal.action === "APPROVE"
                  ? "Grant student temporary permission to update only this specified locked field."
                  : "Provide a reason for rejecting this profile modification request."}
              </p>

              {commentModal.action === "APPROVE" && (
                <div className="mb-3 text-xs">
                  <label className="block text-slate-300 font-bold mb-1">Permission Duration</label>
                  <select
                    value={durationHours}
                    onChange={(e) => setDurationHours(parseInt(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-white/10 text-white focus:outline-none"
                  >
                    <option value={12}>12 Hours</option>
                    <option value={24}>24 Hours (Standard)</option>
                    <option value={48}>48 Hours</option>
                    <option value={72}>72 Hours</option>
                  </select>
                </div>
              )}

              <div className="mb-4 text-xs">
                <label className="block text-slate-300 font-bold mb-1">Advisor Comment / Note</label>
                <textarea
                  rows={3}
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Optional comment to student..."
                  className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#629176]"
                />
              </div>

              <div className="flex justify-end gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setCommentModal(null)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleReview}
                  className={`px-5 py-2 rounded-xl text-white font-bold cursor-pointer transition-all ${
                    commentModal.action === "APPROVE"
                      ? "bg-[#0d4933] hover:bg-[#0d4933]/80"
                      : "bg-rose-600 hover:bg-rose-700"
                  }`}
                >
                  Confirm {commentModal.action === "APPROVE" ? "Approval" : "Rejection"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
