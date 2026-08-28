import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { GraduationCap, Users, Sparkles, ArrowRight, ShieldCheck, Award, TrendingUp, Code2, Layers, Compass } from "lucide-react";
import { AmbientBackground } from "../../components/layout/AmbientBackground";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <AmbientBackground theme="dark">
      {/* Glass Top Navigation */}
      <header className="sticky top-0 z-50 w-full px-4 sm:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3.5 rounded-2xl bg-white/[0.04] backdrop-blur-2xl border border-white/10 shadow-2xl shadow-black/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold tracking-tight text-white">Student 360</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">PRO</span>
              </div>
              <span className="text-[11px] text-slate-400 block -mt-0.5">Information & Portfolio Management</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a 
              href="https://github.com/Vignesh-SVK24/Student-360" 
              target="_blank" 
              rel="noreferrer"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-white/[0.06] hover:bg-white/10 border border-white/10 transition-all"
            >
              <Code2 className="w-3.5 h-3.5 text-indigo-400" />
              <span>GitHub Repo</span>
            </a>
            <button
              onClick={() => navigate("/login/student")}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 shadow-md shadow-indigo-500/25 transition-all cursor-pointer"
            >
              Sign In
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-24 relative z-10 flex flex-col items-center">
        {/* Release Tag */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.06] backdrop-blur-xl border border-white/15 text-indigo-300 text-xs font-semibold mb-6 shadow-inner"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span>Next-Generation Glassmorphism Experience</span>
        </motion.div>

        {/* Hero Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-center max-w-3xl space-y-4 mb-12"
        >
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.1]">
            A Comprehensive <br />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
              360° Academic Universe
            </span>
          </h1>
          <p className="text-base sm:text-xl text-slate-400 max-w-2xl mx-auto font-normal leading-relaxed">
            Unified student records, real-time attendance compliance, verified skills, and showcase portfolios — engineered with fluid liquid glass aesthetics.
          </p>
        </motion.div>

        {/* Dual Portal Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl w-full mb-16">
          {/* Faculty Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{ y: -8, scale: 1.01 }}
            className="group relative rounded-3xl p-8 bg-gradient-to-b from-blue-900/30 via-slate-900/60 to-slate-950/80 backdrop-blur-2xl border border-blue-500/20 hover:border-blue-500/50 shadow-[0_16px_50px_rgba(0,0,0,0.5)] transition-all cursor-pointer overflow-hidden flex flex-col justify-between"
            onClick={() => navigate("/login/faculty")}
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-blue-500/20 transition-all"></div>
            
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-lg shadow-blue-500/20">
                  <Users className="w-7 h-7" />
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-300 border border-blue-500/20">
                  Staff & Mentors
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 tracking-tight group-hover:text-blue-300 transition-colors">
                Faculty Portal
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                Oversee student academic standing, inspect detailed 360 profiles, analyze attendance warnings, and provide verified faculty remarks.
              </p>

              <div className="space-y-2 mb-8">
                {["Classroom Student Search", "Live Attendance Roster", "Holistic Profile Evaluation"].map((feature, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-xs font-medium text-slate-300">
                    <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <button className="w-full py-3.5 px-6 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all group-hover:gap-3">
              <span>Enter Faculty Portal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>

          {/* Student Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{ y: -8, scale: 1.01 }}
            className="group relative rounded-3xl p-8 bg-gradient-to-b from-purple-900/30 via-slate-900/60 to-slate-950/80 backdrop-blur-2xl border border-purple-500/20 hover:border-purple-500/50 shadow-[0_16px_50px_rgba(0,0,0,0.5)] transition-all cursor-pointer overflow-hidden flex flex-col justify-between"
            onClick={() => navigate("/login/student")}
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-purple-500/20 transition-all"></div>
            
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-110 group-hover:bg-purple-600 group-hover:text-white transition-all duration-300 shadow-lg shadow-purple-500/20">
                  <GraduationCap className="w-7 h-7" />
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-500/10 text-purple-300 border border-purple-500/20">
                  Students & Scholars
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 tracking-tight group-hover:text-purple-300 transition-colors">
                Student Portal
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                Take control of your academic journey. Showcase your projects, track verified skills, monitor course attendance, and celebrate milestones.
              </p>

              <div className="space-y-2 mb-8">
                {["Interactive Project Showcase", "Certificates & Skill Endorsements", "Attendance Forecast & Alerts"].map((feature, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-xs font-medium text-slate-300">
                    <Sparkles className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="mb-3 px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-[11px] text-slate-400 flex items-center justify-between">
                <span>Demo Student ID: <strong className="text-purple-300 font-mono">23AIM001</strong></span>
                <span className="text-slate-500">Pass: <span className="font-mono text-slate-300">student123</span></span>
              </div>
              <button className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 transition-all group-hover:gap-3">
                <span>Enter Student Portal</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="w-full max-w-5xl grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: TrendingUp, title: "Real-time Metrics", desc: "Live attendance & CGPA breakdown" },
            { icon: Award, title: "Portfolio 360", desc: "Verified certifications & hackathons" },
            { icon: Layers, title: "Glassmorphism 2.0", desc: "Backdrop blur & glowing layer hierarchy" },
            { icon: Compass, title: "Fluid Navigation", desc: "Liquid quick menu & instant search" },
          ].map((item, idx) => (
            <div 
              key={idx}
              className="p-5 rounded-2xl bg-white/[0.03] backdrop-blur-md border border-white/[0.08] hover:border-white/20 transition-all text-center flex flex-col items-center"
            >
              <div className="w-10 h-10 rounded-xl bg-white/[0.06] flex items-center justify-center text-indigo-400 mb-3">
                <item.icon className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white mb-1">{item.title}</h3>
              <p className="text-xs text-slate-400 leading-snug">{item.desc}</p>
            </div>
          ))}
        </div>
      </main>
    </AmbientBackground>
  );
}
