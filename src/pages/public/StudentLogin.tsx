import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, Lock, User, GraduationCap, ArrowLeft, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
import { useStudentAuth } from "../../context/StudentAuthContext";
import { AmbientBackground } from "../../components/layout/AmbientBackground";

export default function StudentLogin() {
  const navigate = useNavigate();
  const { login } = useStudentAuth();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setErrorMsg("Please enter your register number or email.");
      return;
    }
    setErrorMsg("");
    setLoading(true);

    try {
      const res = await login(identifier, password, rememberMe);
      if (res.success) {
        navigate("/student/dashboard");
      } else {
        setErrorMsg(res.error || "Invalid register number or password.");
      }
    } catch {
      setErrorMsg("Something went wrong during sign in. Please try again.");
    } finally {
      setLoading(false);
    }
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
          <div className="lg:col-span-5 bg-gradient-to-br from-purple-900/40 via-[#042821]/70 to-slate-950 p-8 sm:p-10 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-white/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/15 rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-extrabold text-white text-lg tracking-tight block leading-tight">Student 360</span>
                  <span className="text-[11px] text-purple-400 font-bold uppercase tracking-wider">Student Portal</span>
                </div>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold mb-4 border border-purple-400/30">
                <Sparkles className="w-3.5 h-3.5" /> Self-Service Intelligence
              </div>

              <h2 className="text-3xl font-extrabold text-white tracking-tight leading-snug mb-3">
                Your Academic & Portfolio Hub
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-6">
                Showcase your development projects, track attendance compliance, earn skill badges, and review mentorship feedback.
              </p>

              <div className="space-y-3">
                {[
                  "Personalized 360 Student Dashboard",
                  "Live Course Attendance Breakdown",
                  "Project Portfolio & GitHub Showcase",
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-xs text-slate-300 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative z-10 mt-8 pt-6 border-t border-white/10">
              <p className="text-xs text-slate-400">
                Need account assistance? Contact your department coordinator or advisor.
              </p>
            </div>
          </div>

          {/* Right Form Column */}
          <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-center bg-white/[0.02]">
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-white tracking-tight mb-2">Student Sign In</h3>
              <p className="text-xs sm:text-sm text-slate-400">Enter your college registration number and password.</p>
            </div>

            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-medium mb-6"
              >
                {errorMsg}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Register Number (12 Digits) or Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    required
                    maxLength={12}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/[0.06] border border-white/10 focus:border-purple-500 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all font-medium font-mono"
                    placeholder="e.g. 720725115000"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Password
                  </label>
                  <Link
                    to="/student/forgot-password"
                    className="text-xs text-purple-400 hover:text-purple-300 font-semibold"
                  >
                    Forgot Password?
                  </Link>
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
                    className="w-full pl-10 pr-11 py-3 rounded-xl bg-white/[0.06] border border-white/10 focus:border-purple-500 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all font-medium"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded bg-white/10 border-white/20 text-purple-600 focus:ring-purple-500"
                  />
                  <span>Remember my session</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#042821] via-[#0d4933] to-[#629176] hover:from-[#0d4933] hover:to-[#629176] text-white font-bold text-sm shadow-lg shadow-[#0d4933]/40 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                <span>{loading ? "Signing in..." : "Access Student Portal"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="pt-4 text-center border-t border-white/10 text-xs text-slate-400">
                <span>Quick Fill Demo: </span>
                <button
                  type="button"
                  onClick={() => {
                    setIdentifier("720725115001");
                    setPassword("Student@360");
                  }}
                  className="font-bold text-purple-400 hover:text-purple-300 underline ml-1 cursor-pointer"
                >
                  720725115001 / Student@360
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AmbientBackground>
  );
}
