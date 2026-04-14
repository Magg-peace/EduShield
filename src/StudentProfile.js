import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, BrainCircuit, Activity, AlertTriangle, ShieldCheck, Mail } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const dummyTimeline = [
  { week: 'W1', attendance: 95, marks: 85, engagement: 90 },
  { week: 'W2', attendance: 90, marks: 82, engagement: 85 },
  { week: 'W3', attendance: 85, marks: 78, engagement: 70 },
  { week: 'W4', attendance: 75, marks: 70, engagement: 50 },
  { week: 'W5', attendance: 60, marks: 65, engagement: 30 },
];

const StudentProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);

  // Simulated Fetch based on ID
  useEffect(() => {
    // Ideally fetch from Firestore here. Mocking for demo.
    const mock = {
      id,
      name: "Alex Johnson",
      attendance: 60,
      marks: 65,
      engagement: 30,
      risk: 72, // precalculated or calculated on backend
    };
    if (id === '2') {
       mock.name = "Sam Smith"; mock.attendance = 90; mock.engagement = 40; mock.risk=45;
    }
    if (id === '5') {
       mock.name = "Taylor Swift"; mock.attendance = 98; mock.engagement = 90; mock.risk=10;
    }
    setStudent(mock);
  }, [id]);

  if (!student) return <div className="min-h-screen bg-[#0A0F1C] flex justify-center items-center"><Activity className="animate-spin text-indigo-500 w-8 h-8" /></div>;

  const isHighRisk = student.risk >= 50;
  const isSilent = student.attendance >= 70 && student.engagement < 40;

  return (
    <div className="min-h-screen bg-[#0A0F1C] text-gray-200 font-sans p-6">
      <div className="max-w-6xl mx-auto">
        <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-gray-400 hover:text-white transition mb-8">
          <ArrowLeft className="w-5 h-5" /> Back to Dashboard
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Profile & Gauge */}
          <div className="lg:col-span-1 space-y-6">
            <div className={`p-8 rounded-3xl border relative overflow-hidden backdrop-blur-xl ${isHighRisk ? 'bg-red-900/10 border-red-500/20' : isSilent ? 'bg-orange-900/10 border-orange-500/20' : 'bg-indigo-900/10 border-indigo-500/20'}`}>
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-50" style={{color: isHighRisk ? '#ef4444' : isSilent ? '#f97316' : '#6366f1'}}></div>
               <h2 className="text-3xl font-bold text-white mb-1">{student.name}</h2>
               <p className="text-sm text-gray-400 uppercase tracking-widest mb-8">Student ID: #{student.id.padStart(4, '0')}</p>

               {/* Risk Gauge Simulation */}
               <div className="flex flex-col items-center justify-center py-6">
                 <div className="relative w-40 h-40 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-800" />
                      <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={`${student.risk * 2.51} 251.2`} className={`${isHighRisk?'text-red-500':student.risk>=30?'text-orange-500':'text-emerald-500'} transition-all duration-1000`} />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-4xl font-black text-white">{student.risk.toFixed(0)}</span>
                      <span className="text-xs text-gray-500 font-semibold uppercase">Risk Score</span>
                    </div>
                 </div>
                 <div className={`mt-6 px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider ${isHighRisk ? 'bg-red-500/20 text-red-400' : isSilent ? 'bg-orange-500/20 text-orange-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                    {isHighRisk ? 'High Risk Alert' : student.risk >= 30 ? 'Medium Warning' : 'Safe Baseline'}
                 </div>
               </div>
            </div>

            <div className="bg-[#101625] border border-gray-800 p-6 rounded-3xl">
               <h3 className="text-gray-400 font-semibold uppercase tracking-wider text-sm mb-6 flex items-center gap-2">Core Metrics</h3>
               <div className="space-y-4">
                 <div className="flex justify-between items-center"><span className="text-gray-400">Attendance</span><span className="font-bold text-white text-lg">{student.attendance}%</span></div>
                 <div className="flex justify-between items-center"><span className="text-gray-400">Overall Marks</span><span className="font-bold text-white text-lg">{student.marks}%</span></div>
                 <div className="flex justify-between items-center"><span className="text-gray-400">Engagement</span><span className="font-bold text-white text-lg">{student.engagement}%</span></div>
               </div>
            </div>
          </div>

          {/* Right Column: AI Panel & Charts */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* AI Intelligence Engine */}
            <div className="bg-gradient-to-br from-indigo-900/40 via-[#101625] to-[#101625] border border-indigo-500/20 p-8 rounded-3xl relative">
              <div className="absolute top-4 right-4 flex items-center gap-2 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
                <span className="text-xs font-bold tracking-widest text-indigo-400 uppercase">AI Active</span>
              </div>
              <h3 className="text-xl font-bold flex items-center gap-3 text-white mb-6"><BrainCircuit className="text-indigo-400 w-7 h-7" /> Intelligence Engine Report</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                   <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Diagnostic</h4>
                   {isSilent ? (
                     <p className="text-white text-lg leading-relaxed bg-black/20 p-4 rounded-xl border border-white/5">
                        <span className="text-orange-400 font-bold">Silent Dropout Detected:</span> Student maintains acceptable attendance ({student.attendance}%) but micro-engagement is critically low ({student.engagement}%). This indicates psychological detachment.
                     </p>
                   ) : isHighRisk ? (
                     <p className="text-white text-lg leading-relaxed bg-black/20 p-4 rounded-xl border border-white/5">
                        <span className="text-red-400 font-bold">72% Dropout Probability:</span> Sharp decline across all monitored metrics over the past 3 weeks. Urgent stabilization required.
                     </p>
                   ) : (
                     <p className="text-white text-lg leading-relaxed bg-black/20 p-4 rounded-xl border border-white/5">
                        <span className="text-emerald-400 font-bold">Stable Profile:</span> All metrics align with positive historical baselines.
                     </p>
                   )}
                 </div>
                 <div>
                   <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Recommended Action</h4>
                   <div className="bg-black/20 p-4 rounded-xl border border-white/5 space-y-3">
                     {isHighRisk ? (
                        <>
                          <div className="flex items-center gap-3"><AlertTriangle className="text-red-400 w-5 h-5"/> <span>Schedule emergency counseling</span></div>
                          <div className="flex items-center gap-3"><Mail className="text-gray-400 w-5 h-5"/> <span>Assign peer mentor</span></div>
                        </>
                     ) : isSilent ? (
                        <>
                          <div className="flex items-center gap-3"><ShieldCheck className="text-orange-400 w-5 h-5"/> <span>Discreet 1-on-1 check-in</span></div>
                          <div className="flex items-center gap-3"><Mail className="text-gray-400 w-5 h-5"/> <span>Invite to interactive workshop</span></div>
                        </>
                     ) : (
                        <div className="flex items-center gap-3"><ShieldCheck className="text-emerald-400 w-5 h-5"/> <span>No action required</span></div>
                     )}
                   </div>
                 </div>
              </div>
            </div>

            {/* Timeline Graph */}
            <div className="bg-[#101625] border border-gray-800 p-8 rounded-3xl">
              <h3 className="text-white font-semibold mb-6 flex items-center gap-2"><Activity className="w-5 h-5 text-gray-400"/> 5-Week Metric Progression</h3>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dummyTimeline}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" vertical={false} />
                    <XAxis dataKey="week" stroke="#9CA3AF" tick={{fill: '#9CA3AF'}} tickLine={false} axisLine={false} />
                    <YAxis stroke="#9CA3AF" tick={{fill: '#9CA3AF'}} tickLine={false} axisLine={false} domain={[0, 100]} />
                    <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '12px', color: '#fff' }} />
                    <Line type="monotone" dataKey="attendance" stroke="#3b82f6" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
                    <Line type="monotone" dataKey="marks" stroke="#8b5cf6" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
                    <Line type="monotone" dataKey="engagement" stroke="#f43f5e" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-6 mt-4">
                 <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-blue-500"></div><span className="text-sm text-gray-400">Attendance</span></div>
                 <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-purple-500"></div><span className="text-sm text-gray-400">Marks</span></div>
                 <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-rose-500"></div><span className="text-sm text-gray-400">Engagement</span></div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
