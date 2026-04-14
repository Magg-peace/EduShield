import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldAlert, Activity, Brain, Bell, ArrowRight, ChevronRight, BarChart2 } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#060e20] text-white font-sans overflow-x-hidden selection:bg-indigo-500/30">
      {/* Dynamic Backgrounds */}
      <div className="fixed top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-indigo-600/20 rounded-full blur-[150px] pointer-events-none" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[40vw] h-[40vw] bg-purple-600/20 rounded-full blur-[150px] pointer-events-none" />

      {/* Navbar */}
      <nav className="relative z-10 flex justify-between items-center p-6 md:px-12 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/20 rounded-xl">
            <ShieldAlert className="w-8 h-8 text-indigo-400" />
          </div>
          <span className="font-bold text-2xl tracking-tight">EduShield <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">X</span></span>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/login')} className="text-gray-300 hover:text-white transition font-medium">Log In</button>
          <button onClick={() => navigate('/login')} className="bg-white/10 hover:bg-white/20 border border-white/10 px-5 py-2.5 rounded-xl font-semibold transition backdrop-blur-md hidden md:block">
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32 flex flex-col items-center text-center">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-medium mb-8">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
            Predict Student Dropouts Before They Happen
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6">
            AI-powered behavioral intelligence for <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400">student success.</span>
          </h1>
          
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Stop relying on clinical spreadsheets. EduShield X actively monitors engagement, predicts dropouts organically, and safeguards student wellness.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => navigate('/login')} className="relative group overflow-hidden bg-indigo-600 hover:bg-indigo-500 px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition shadow-[0_0_30px_rgba(79,70,229,0.3)] hover:shadow-[0_0_50px_rgba(79,70,229,0.5)]">
              <span>Start Monitoring Now</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button onClick={() => navigate('/login')} className="bg-white/5 hover:bg-white/10 border border-white/10 px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition backdrop-blur-md">
              <BarChart2 className="w-5 h-5 text-gray-400" />
              <span>View Demo</span>
            </button>
          </div>
        </motion.div>

        {/* Feature Cards Grid (Solution Section) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-32">
          {[{
            icon: Activity,
            title: "Behavior Tracking",
            desc: "Continuous organic monitoring of attendance, marks, and micro-engagement.",
            color: "text-cyan-400",
            bg: "bg-cyan-400/10"
          }, {
            icon: Brain,
            title: "AI Risk Prediction",
            desc: "Our Ethereal Engine analyzes risk probabilities and spots 'silent dropouts'.",
            color: "text-purple-400",
            bg: "bg-purple-400/10"
          }, {
            icon: Bell,
            title: "Auto Interventions",
            desc: "Immediate smart workflows dispatch alerts to mentors when signals turn red.",
            color: "text-indigo-400",
            bg: "bg-indigo-400/10"
          }].map((feat, i) => (
            <motion.div 
              key={feat.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2, duration: 0.6 }}
              className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-sm hover:bg-white/10 transition"
            >
              <div className={`w-14 h-14 rounded-2xl ${feat.bg} flex items-center justify-center mb-6`}>
                <feat.icon className={`w-7 h-7 ${feat.color}`} />
              </div>
              <h3 className="text-xl font-bold mb-3">{feat.title}</h3>
              <p className="text-gray-400 leading-relaxed">{feat.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Impact Section */}
        <div className="w-full mt-32 bg-indigo-900/20 border border-indigo-500/20 rounded-[2rem] p-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10" />
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-10">
            <div className="text-left max-w-lg">
              <h2 className="text-3xl md:text-5xl font-extrabold mb-4 shrink-0">Reduce dropout rates by <span className="text-indigo-400">40%</span></h2>
              <p className="text-gray-400 text-lg">Harness real-time analytics and an early intervention system to save students who fall through the cracks.</p>
            </div>
            <div className="flex flex-wrap gap-4 justify-center md:justify-end">
               <div className="bg-white/10 backdrop-blur border border-white/10 p-6 rounded-2xl w-40 text-center">
                 <p className="text-4xl font-bold text-white mb-1">98%</p>
                 <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold">Prediction Acc.</p>
               </div>
               <div className="bg-white/10 backdrop-blur border border-white/10 p-6 rounded-2xl w-40 text-center">
                 <p className="text-4xl font-bold text-cyan-400 mb-1">24/7</p>
                 <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold">Monitoring</p>
               </div>
            </div>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 mt-20 p-10 text-center text-gray-500">
        <p className="mb-4">Tech Stack: React • Firebase • Cloud Functions • TailwindCSS</p>
        <p className="text-sm">Built for the Hackathon Demo. Crafted with ❤️ for actionable insight in education.</p>
      </footer>
    </div>
  );
};

export default Landing;
