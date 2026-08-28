import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail, Users, ArrowLeft, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";
import { AmbientBackground } from "../../components/layout/AmbientBackground";

export default function FacultyLogin() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("prof.sarah@college.edu");
  const [password, setPassword] = useState("faculty123");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/faculty/dashboard");
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
          <div className="lg:col-span-5 bg-gradient-to-br from-blue-900/40 via-slate-900/80 to-slate-950 p-8 sm:p-10 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-white/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/15 rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-extrabold text-white text-lg tracking-tight block leading-tight">Student 360</span>
                  <span className="text-[11px] text-blue-400 font-bold uppercase tracking-wider">Faculty Portal</span>
                </div>
              </div>

              <h2 className="text-3xl font-extrabold text-white tracking-tight leading-snug mb-3">
                Empowering Faculty Oversight
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-6">
                Direct access to class attendance tracking, 360 student profiles, performance evaluation, and mentorship notes.
              </p>

              <div className="space-y-3">
                {[
                  "Complete Student 360 dossiers",
                  "Automated attendance warnings & flags",
                  "Verified faculty feedback entries",
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-xs text-slate-300 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative z-10 mt-8 pt-6 border-t border-white/10">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <ShieldCheck className="w-4 h-4 text-blue-400" />
                <span>Protected by Institutional SSO Verification</span>
              </div>
            </div>
          </div>

          {/* Right Form Column */}
          <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-center bg-white/[0.02]">
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-white tracking-tight mb-2">Faculty Sign In</h3>
              <p className="text-xs sm:text-sm text-slate-400">Enter your college credentials to access your faculty dashboard.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Faculty Email or ID
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/[0.06] border border-white/10 focus:border-blue-500 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium"
                    placeholder="prof.sarah@college.edu"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-10 pr-11 py-3 rounded-xl bg-white/[0.06] border border-white/10 focus:border-blue-500 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium"
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

              <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-300 flex items-center justify-between">
                <span>Demo Faculty Login Ready</span>
                <span className="font-semibold text-blue-200">Pre-filled</span>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>Access Faculty Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </AmbientBackground>
  );
}
