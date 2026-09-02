import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { GraduationCap, Users, Sparkles, ArrowRight, ShieldCheck, Award, TrendingUp, Layers, Compass } from "lucide-react";
import { AmbientBackground } from "../../components/layout/AmbientBackground";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <AmbientBackground theme="emerald-gold">
      {/* Glass Top Navigation */}
      <header className="sticky top-0 z-50 w-full px-4 sm:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3.5 rounded-2xl bg-[#0d4933]/30 backdrop-blur-2xl border border-[#c1912a]/30 shadow-2xl shadow-black/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#0d4933] via-[#629176] to-[#c1912a] flex items-center justify-center text-[#f2ebde] shadow-lg shadow-[#c1912a]/20 border border-[#c1912a]/40">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold tracking-tight text-[#f2ebde]">Student 360</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#c1912a]/20 text-[#c1912a] border border-[#c1912a]/40">PRO</span>
              </div>
              <span className="text-[11px] text-[#629176] block -mt-0.5 font-medium">Information & Portfolio Management</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/login/student")}
              className="px-5 py-2 rounded-xl text-xs font-black text-[#0d4933] bg-gradient-to-r from-[#c1912a] via-[#dfa938] to-[#c1912a] hover:from-[#b08323] hover:to-[#c1912a] shadow-lg shadow-[#c1912a]/30 transition-all cursor-pointer border border-[#f2ebde]/30 active:scale-95"
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
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0d4933]/60 backdrop-blur-xl border border-[#c1912a]/40 text-[#f2ebde] text-xs font-semibold mb-6 shadow-lg shadow-[#0d4933]/40"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#c1912a] animate-pulse" />
          <span className="tracking-wide">Emerald & Gold Edition • Glassmorphism System</span>
        </motion.div>

        {/* Hero Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-center max-w-3xl space-y-4 mb-12"
        >
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-[#f2ebde] tracking-tight leading-[1.1]">
            A Comprehensive <br />
            <span className="bg-gradient-to-r from-[#f2ebde] via-[#c1912a] to-[#629176] bg-clip-text text-transparent">
              360° Academic Universe
            </span>
          </h1>
          <p className="text-base sm:text-xl text-[#f2ebde]/85 max-w-2xl mx-auto font-normal leading-relaxed">
            Unified student records, real-time attendance compliance, verified skills, and showcase portfolios — engineered with fluid emerald & gold liquid glass aesthetics.
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
            className="group relative rounded-3xl p-8 bg-gradient-to-b from-[#0d4933]/60 via-[#092218]/80 to-[#040e0b]/95 backdrop-blur-2xl border border-[#629176]/35 hover:border-[#c1912a]/60 shadow-[0_20px_60px_rgba(13,73,51,0.4)] transition-all cursor-pointer overflow-hidden flex flex-col justify-between"
            onClick={() => navigate("/login/faculty")}
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#629176]/15 rounded-full blur-3xl pointer-events-none group-hover:bg-[#c1912a]/20 transition-all"></div>
            
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-14 h-14 rounded-2xl bg-[#0d4933]/80 border border-[#629176]/50 flex items-center justify-center text-[#f2ebde] group-hover:scale-110 group-hover:bg-[#c1912a] group-hover:text-[#0d4933] group-hover:border-[#c1912a] transition-all duration-300 shadow-lg shadow-[#0d4933]/50">
                  <Users className="w-7 h-7" />
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#629176]/20 text-[#f2ebde] border border-[#629176]/40">
                  Staff & Mentors
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold text-[#f2ebde] mb-2 tracking-tight group-hover:text-[#c1912a] transition-colors">
                Faculty Portal
              </h2>
              <p className="text-[#f2ebde]/75 text-sm leading-relaxed mb-6 font-normal">
                Oversee student academic standing, inspect detailed 360 profiles, analyze attendance warnings, and provide verified faculty remarks.
              </p>

              <div className="space-y-2 mb-8">
                {["Classroom Student Search", "Live Attendance Roster", "Holistic Profile Evaluation"].map((feature, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-xs font-medium text-[#f2ebde]/90">
                    <ShieldCheck className="w-4 h-4 text-[#c1912a] shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="mb-3 px-3.5 py-2 rounded-xl bg-[#0d4933]/80 border border-[#629176]/40 text-[11px] text-[#f2ebde]/80 flex items-center justify-between shadow-inner">
                <span>Demo Faculty ID: <strong className="text-emerald-300 font-mono">ramanujam115</strong></span>
                <span className="text-[#f2ebde]/60">Pass: <span className="font-mono text-[#f2ebde]">Faculty@360</span></span>
              </div>
              <button className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#0d4933] to-[#629176] hover:from-[#0a3827] hover:to-[#507a62] text-[#f2ebde] border border-[#629176]/50 text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#0d4933]/50 transition-all group-hover:gap-3 cursor-pointer">
                <span>Enter Faculty Portal</span>
                <ArrowRight className="w-4 h-4 text-[#c1912a]" />
              </button>
            </div>
          </motion.div>

          {/* Student Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{ y: -8, scale: 1.01 }}
            className="group relative rounded-3xl p-8 bg-gradient-to-b from-[#c1912a]/20 via-[#0d4933]/65 to-[#040e0b]/95 backdrop-blur-2xl border border-[#c1912a]/40 hover:border-[#c1912a]/80 shadow-[0_20px_60px_rgba(193,145,42,0.25)] transition-all cursor-pointer overflow-hidden flex flex-col justify-between"
            onClick={() => navigate("/login/student")}
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#c1912a]/20 rounded-full blur-3xl pointer-events-none group-hover:bg-[#c1912a]/30 transition-all"></div>
            
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-14 h-14 rounded-2xl bg-[#c1912a]/20 border border-[#c1912a]/50 flex items-center justify-center text-[#c1912a] group-hover:scale-110 group-hover:bg-[#c1912a] group-hover:text-[#0d4933] transition-all duration-300 shadow-lg shadow-[#c1912a]/25">
                  <GraduationCap className="w-7 h-7" />
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#c1912a]/20 text-[#c1912a] border border-[#c1912a]/40">
                  Students & Scholars
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold text-[#f2ebde] mb-2 tracking-tight group-hover:text-[#c1912a] transition-colors">
                Student Portal
              </h2>
              <p className="text-[#f2ebde]/75 text-sm leading-relaxed mb-6 font-normal">
                Take control of your academic journey. Showcase your projects, track verified skills, monitor course attendance, and celebrate milestones.
              </p>

              <div className="space-y-2 mb-8">
                {["Interactive Project Showcase", "Certificates & Skill Endorsements", "Attendance Forecast & Alerts"].map((feature, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-xs font-medium text-[#f2ebde]/90">
                    <Sparkles className="w-4 h-4 text-[#c1912a] shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="mb-3 px-3.5 py-2 rounded-xl bg-[#0d4933]/80 border border-[#c1912a]/30 text-[11px] text-[#f2ebde]/80 flex items-center justify-between shadow-inner">
                <span>Demo Student ID: <strong className="text-[#c1912a] font-mono">720725115001</strong></span>
                <span className="text-[#f2ebde]/60">Pass: <span className="font-mono text-[#f2ebde]">Student@360</span></span>
              </div>
              <button className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#c1912a] via-[#dfa938] to-[#c1912a] hover:from-[#b08323] hover:to-[#c1912a] text-[#0d4933] text-sm font-black flex items-center justify-center gap-2 shadow-lg shadow-[#c1912a]/35 transition-all group-hover:gap-3 cursor-pointer border border-[#f2ebde]/30">
                <span>Enter Student Portal</span>
                <ArrowRight className="w-4 h-4 text-[#0d4933]" />
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
              className="p-5 rounded-2xl bg-[#0d4933]/35 backdrop-blur-md border border-[#629176]/25 hover:border-[#c1912a]/50 shadow-md shadow-[#0d4933]/20 transition-all text-center flex flex-col items-center group"
            >
              <div className="w-10 h-10 rounded-xl bg-[#c1912a]/15 border border-[#c1912a]/30 flex items-center justify-center text-[#c1912a] mb-3 group-hover:scale-110 transition-transform">
                <item.icon className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-[#f2ebde] mb-1">{item.title}</h3>
              <p className="text-xs text-[#f2ebde]/70 leading-snug">{item.desc}</p>
            </div>
          ))}
        </div>
      </main>
    </AmbientBackground>
  );
}
