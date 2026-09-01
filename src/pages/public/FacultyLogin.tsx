import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  Users,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  X,
  UserPlus,
  KeyRound,
  Check
} from "lucide-react";
import { AmbientBackground } from "../../components/layout/AmbientBackground";
import { useFacultyAuth } from "../../context/FacultyAuthContext";
import { authApi } from "../../services/apiClient";

export default function FacultyLogin() {
  const navigate = useNavigate();
  const { login, register } = useFacultyAuth();

  const [selectedRole, setSelectedRole] = useState("Class Advisor");
  const [identifier, setIdentifier] = useState("FAC-AIML-01");
  const [password, setPassword] = useState("Faculty@360");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Modals
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isForgotOpen, setIsForgotOpen] = useState(false);

  // Register Form State
  const [regData, setRegData] = useState({
    name: "",
    faculty_id: "",
    email: "",
    phone_number: "",
    designation: "Assistant Professor",
    assigned_role: "CLASS_ADVISOR",
    password: "",
    confirm_password: "",
  });
  const [regError, setRegError] = useState("");
  const [regLoading, setRegLoading] = useState(false);

  // Forgot Password Form State
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotStatus, setForgotStatus] = useState<string | null>(null);
  const [forgotLoading, setForgotLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim() || !password) {
      setErrorMsg("Please enter both Faculty ID/Email and Password.");
      return;
    }
    setErrorMsg("");
    setLoading(true);

    try {
      const res = await login(identifier.trim(), password, rememberMe);
      if (res.success) {
        navigate("/faculty/dashboard");
      } else {
        setErrorMsg(res.error || "Invalid faculty ID or password.");
      }
    } catch {
      setErrorMsg("Unable to connect to the authentication server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (regData.password !== regData.confirm_password) {
      setRegError("Passwords do not match.");
      return;
    }
    if (regData.password.length < 6) {
      setRegError("Password must be at least 6 characters.");
      return;
    }
    setRegError("");
    setRegLoading(true);

    try {
      const res = await register(regData);
      if (res.success) {
        setIsRegisterOpen(false);
        navigate("/faculty/dashboard");
      } else {
        setRegError(res.error || "Failed to create faculty account.");
      }
    } catch {
      setRegError("An unexpected error occurred during registration.");
    } finally {
      setRegLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) return;
    setForgotLoading(true);
    setForgotStatus(null);

    const res = await authApi.forgotPassword(forgotEmail.trim());
    setForgotLoading(false);
    setForgotStatus(res.data?.message || "If this email is registered, instructions have been prepared.");
  };

  return (
    <AmbientBackground theme="dark">
      <div className="min-h-screen flex flex-col justify-center items-center p-4 sm:p-6 relative z-10">
        {/* Back Link */}
        <div className="w-full max-w-4xl mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white bg-white/[0.05] hover:bg-white/10 border border-white/10 transition-all backdrop-blur-md"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Portal Select</span>
          </Link>
        </div>

        <div className="w-full max-w-4xl grid lg:grid-cols-12 rounded-3xl overflow-hidden bg-slate-900/60 backdrop-blur-2xl border border-white/10 shadow-[0_20px_70px_rgba(0,0,0,0.6)]">
          {/* Left Visual Column */}
          <div className="lg:col-span-5 bg-gradient-to-br from-[#042821] via-[#0d4933]/60 to-slate-950 p-8 sm:p-10 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-white/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#629176]/20 rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-[#0d4933]/50 border border-[#629176]/40 flex items-center justify-center text-[#629176]">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-extrabold text-white text-lg tracking-tight block leading-tight">Student 360</span>
                  <span className="text-[11px] text-[#629176] font-bold uppercase tracking-wider">Faculty Portal</span>
                </div>
              </div>

              <h2 className="text-3xl font-extrabold text-white tracking-tight leading-snug mb-3">
                Empowering Faculty Oversight
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-6">
                Direct access to class attendance tracking, 360 student profiles, performance evaluation, student creation, and mentorship notes.
              </p>

              <div className="space-y-3">
                {[
                  "Complete Student 360 dossiers",
                  "Direct student onboarding & account provisioning",
                  "Automated attendance warnings & flags",
                  "Verified faculty feedback entries",
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-xs text-slate-300 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-[#629176] shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative z-10 mt-8 pt-6 border-t border-white/10">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <ShieldCheck className="w-4 h-4 text-[#629176]" />
                <span>Protected by Institutional Argon2 & JWT Security</span>
              </div>
            </div>
          </div>

          {/* Right Form Column */}
          <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-center bg-white/[0.02]">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-white tracking-tight mb-1">Faculty Sign In</h3>
              <p className="text-xs sm:text-sm text-slate-400">Enter your Faculty ID or Email to access your portal.</p>
            </div>

            {errorMsg && (
              <div className="mb-5 p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              {/* Step 1: Role Selection UX Component */}
              <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-extrabold text-[#629176] uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Step 1: Select Your Faculty Role</span>
                  </label>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Role-Based Access Control
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { label: "Class Advisor", value: "CLASS_ADVISOR", icon: "⭐", demoId: "FAC-AIML-01", desc: "Creates classrooms, registers students & approves profile edit requests" },
                    { label: "Class Tutor", value: "CLASS_TUTOR", icon: "📋", demoId: "FAC-TUTOR-01", desc: "Manages student cohorts, reviews attendance & mentors students" },
                    { label: "HOD", value: "HOD", icon: "👑", demoId: "HOD-AIML-01", desc: "Head of Department — Full departmental & classroom oversight" },
                    { label: "Associate Professor", value: "ASSOCIATE_PROFESSOR", icon: "🎓", demoId: "FAC-ASSOC-01", desc: "Senior academic evaluations & department reviews" },
                    { label: "Subject Faculty", value: "SUBJECT_FACULTY", icon: "📚", demoId: "FAC-SUBJ-01", desc: "Timetable-scoped attendance taking & course evaluations" },
                  ].map((r) => {
                    const isSelected = selectedRole === r.label;
                    return (
                      <button
                        key={r.value}
                        type="button"
                        onClick={() => {
                          setSelectedRole(r.label);
                          setIdentifier(r.demoId);
                        }}
                        className={`px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer flex items-center gap-2 ${
                          isSelected
                            ? "bg-gradient-to-r from-[#0d4933] to-[#629176] text-white shadow-lg shadow-[#0d4933]/50 border border-emerald-400/40"
                            : "bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 border border-white/5"
                        }`}
                      >
                        <span className="text-base">{r.icon}</span>
                        <span className="truncate">{r.label}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-200 text-xs flex items-start gap-2">
                  <span className="text-sm">💡</span>
                  <p className="leading-relaxed">
                    <strong>{selectedRole}:</strong> {
                      [
                        { label: "Class Advisor", desc: "Authorized to create classrooms, enroll students & approve 24-hour profile edit permissions." },
                        { label: "Class Tutor", desc: "Authorized to mentor student cohorts & monitor daily attendance status." },
                        { label: "HOD", desc: "Head of Department — Full administrative authority across all departmental classrooms and faculty." },
                        { label: "Associate Professor", desc: "Senior faculty member — Conducts academic appraisals & department reviews." },
                        { label: "Subject Faculty", desc: "Authorized to mark timetable-based period attendance (Present / Absent / OD)." },
                      ].find(r => r.label === selectedRole)?.desc
                    }
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Faculty ID or Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/[0.06] border border-white/10 focus:border-[#629176] text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#629176]/25 transition-all font-medium"
                    placeholder="FAC-AIML-01 or faculty@college.edu"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setForgotStatus(null);
                      setForgotEmail("");
                      setIsForgotOpen(true);
                    }}
                    className="text-xs text-[#629176] hover:text-emerald-300 transition-colors font-medium cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-10 pr-11 py-3 rounded-xl bg-white/[0.06] border border-white/10 focus:border-[#629176] text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#629176]/25 transition-all font-medium"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded bg-white/10 border-white/20 text-[#0d4933] focus:ring-[#629176]"
                  />
                  <span>Remember Me (Persistent Session)</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#042821] via-[#0d4933] to-[#629176] hover:from-[#0d4933] hover:to-[#629176] text-white font-bold text-sm shadow-lg shadow-[#0d4933]/40 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <span>Signing In...</span>
                ) : (
                  <>
                    <span>Access Faculty Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="pt-4 text-center border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                <span>New Faculty Member?</span>
                <button
                  type="button"
                  onClick={() => {
                    setRegError("");
                    setIsRegisterOpen(true);
                  }}
                  className="font-bold text-[#629176] hover:text-emerald-300 flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Register Account</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Faculty Registration Modal */}
      {isRegisterOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsRegisterOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-[#0d4933] text-[#629176] flex items-center justify-center">
                <UserPlus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Faculty Registration</h3>
                <p className="text-xs text-slate-400">Create your verified faculty account</p>
              </div>
            </div>

            {regError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{regError}</span>
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={regData.name}
                    onChange={(e) => setRegData({ ...regData, name: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#629176]"
                    placeholder="Dr. Rajesh Kumar"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Faculty ID</label>
                  <input
                    type="text"
                    required
                    value={regData.faculty_id}
                    onChange={(e) => setRegData({ ...regData, faculty_id: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono uppercase focus:outline-none focus:border-[#629176]"
                    placeholder="FAC-CSE-05"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Faculty Role</label>
                  <select
                    value={regData.assigned_role}
                    onChange={(e) => setRegData({ ...regData, assigned_role: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-white/10 text-white focus:outline-none focus:border-[#629176]"
                  >
                    <option value="CLASS_ADVISOR">Class Advisor</option>
                    <option value="CLASS_TUTOR">Class Tutor</option>
                    <option value="HOD">HOD</option>
                    <option value="ASSOCIATE_PROFESSOR">Associate Professor</option>
                    <option value="SUBJECT_FACULTY">Subject Faculty</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Academic Designation</label>
                  <input
                    type="text"
                    required
                    value={regData.designation}
                    onChange={(e) => setRegData({ ...regData, designation: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#629176]"
                    placeholder="Assistant / Associate Professor"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Institutional Email</label>
                  <input
                    type="email"
                    required
                    value={regData.email}
                    onChange={(e) => setRegData({ ...regData, email: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#629176]"
                    placeholder="rajesh.k@college.edu"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={regData.phone_number}
                    onChange={(e) => setRegData({ ...regData, phone_number: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#629176]"
                    placeholder="+91 98400 12345"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Academic Designation</label>
                <input
                  type="text"
                  required
                  value={regData.designation}
                  onChange={(e) => setRegData({ ...regData, designation: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#629176]"
                  placeholder="Assistant Professor / Associate Professor"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Password</label>
                  <input
                    type="password"
                    required
                    value={regData.password}
                    onChange={(e) => setRegData({ ...regData, password: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#629176]"
                    placeholder="At least 6 characters"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Confirm Password</label>
                  <input
                    type="password"
                    required
                    value={regData.confirm_password}
                    onChange={(e) => setRegData({ ...regData, confirm_password: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#629176]"
                    placeholder="Re-enter password"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsRegisterOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={regLoading}
                  className="px-5 py-2 rounded-xl bg-[#0d4933] hover:bg-[#0d4933]/80 text-white font-bold cursor-pointer disabled:opacity-50"
                >
                  {regLoading ? "Registering..." : "Create Account"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Forgot Password Modal */}
      {isForgotOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative">
            <button
              onClick={() => setIsForgotOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#629176]/20 text-[#629176] flex items-center justify-center">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Reset Faculty Password</h3>
                <p className="text-xs text-slate-400">Enter your registered institutional email</p>
              </div>
            </div>

            {forgotStatus ? (
              <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs space-y-2">
                <div className="flex items-center gap-2 font-bold">
                  <Check className="w-4 h-4" />
                  <span>Request Received</span>
                </div>
                <p>{forgotStatus}</p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setIsForgotOpen(false)}
                    className="w-full py-2 rounded-xl bg-[#0d4933] text-white font-bold"
                  >
                    Back to Login
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Registered Faculty Email</label>
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#629176]"
                    placeholder="ramanujam.s@college.edu"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsForgotOpen(false)}
                    className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="px-5 py-2 rounded-xl bg-[#0d4933] hover:bg-[#0d4933]/80 text-white font-bold cursor-pointer disabled:opacity-50"
                  >
                    {forgotLoading ? "Sending..." : "Submit Request"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </AmbientBackground>
  );
}