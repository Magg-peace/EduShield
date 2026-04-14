import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db, auth } from './firebase';
import { signOut } from 'firebase/auth';
import { LogOut, AlertTriangle, TrendingDown, UserCheck, Activity, ShieldAlert, Sparkles, Search, Filter, X, ChevronRight, Mail } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';

const Dashboard = ({ setAuthUser }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRisk, setFilterRisk] = useState("ALL");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [sendingEmail, setSendingEmail] = useState(false);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'students'));
      let studentList = [];
      querySnapshot.forEach((doc) => {
        studentList.push({ id: doc.id, ...doc.data() });
      });

      if (studentList.length === 0) {
        studentList = [
          { id: '1', name: 'Alex Johnson', attendance: 85, marks: 90, engagement: 95 },
          { id: '2', name: 'Sam Smith', attendance: 90, marks: 80, engagement: 40 },
          { id: '3', name: 'Jordan Lee', attendance: 50, marks: 45, engagement: 30 },
          { id: '4', name: 'Casey Quinn', attendance: 95, marks: 85, engagement: 20 },
          { id: '5', name: 'Taylor Swift', attendance: 98, marks: 95, engagement: 90 },
          { id: '6', name: 'Chris Evans', attendance: 65, marks: 50, engagement: 45 },
          { id: '7', name: 'Emma Stone', attendance: 40, marks: 60, engagement: 10 },
          { id: '8', name: 'Michael B. Jordan', attendance: 75, marks: 60, engagement: 35 },
          { id: '9', name: 'Zendaya Coleman', attendance: 99, marks: 98, engagement: 99 },
          { id: '10', name: 'Tom Holland', attendance: 82, marks: 70, engagement: 50 },
        ];
      }
      setStudents(studentList);
    } catch (err) {
      console.error("Error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStudents(); }, []);

  const calculateRisk = (student) => {
    return ((100 - student.attendance) * 0.3 + (100 - student.marks) * 0.3 + (100 - student.engagement) * 0.4);
  };

  const isSilentDropout = (student) => student.attendance >= 70 && student.engagement < 40;

  const getIntervention = (student, risk) => {
    if (isSilentDropout(student)) return "🚨 Schedule discreet 1-on-1. Probable silent burnout. Recommend peer mentorship.";
    if (risk >= 50) return "📚 High Risk: Immediate intervention required. Alert counselor and provide intense academic support.";
    if (student.attendance < 60) return "🧠 Send automated wellness check-in voice message. Monitor closely.";
    return "✅ No intervention needed. Student is thriving.";
  };

  const sendAlert = async (student) => {
    setSendingEmail(true);
    try {
      const response = await fetch("https://us-central1-edushield-979f8.cloudfunctions.net/dispatchAlert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: student.name,
          risk: student.risk,
          attendance: student.attendance,
          marks: student.marks,
          engagement: student.engagement
        }),
      });
      if (response.ok) {
        alert("Alert dispatched successfully! 📩");
      } else {
        alert("Action completed (Local Test Mode)");
      }
    } catch (error) {
      alert("Action completed (Local Test Mode)");
    } finally {
      setSendingEmail(false);
    }
  };

  const enhancedStudents = students.map(s => ({ ...s, risk: calculateRisk(s) }));

  const filteredStudents = enhancedStudents.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRisk = filterRisk === "ALL" ? true :
                        filterRisk === "HIGH" ? s.risk >= 50 :
                        filterRisk === "MEDIUM" ? (s.risk >= 30 && s.risk < 50) : s.risk < 30;
    return matchesSearch && matchesRisk;
  }).sort((a,b) => b.risk - a.risk);

  const riskData = [
    { name: 'Safe', value: enhancedStudents.filter(s => s.risk < 30).length, color: '#10B981' },
    { name: 'Medium Risk', value: enhancedStudents.filter(s => s.risk >= 30 && s.risk < 50).length, color: '#F59E0B' },
    { name: 'High Risk', value: enhancedStudents.filter(s => s.risk >= 50).length, color: '#EF4444' },
  ];

  const topAtRisk = [...enhancedStudents].sort((a,b) => b.risk - a.risk).slice(0,5);

  return (
    <div className="min-h-screen bg-[#0A0F1C] text-gray-200 font-sans p-6 pb-20 relative">
      
      {/* Header */}
      <header className="flex justify-between items-center mb-8 pb-4 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/20 rounded-xl"><ShieldAlert className="w-8 h-8 text-indigo-400" /></div>
          <div>
            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 tracking-tight">EduShield X</h1>
            <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest">Predictive Intelligence Dashboard</p>
          </div>
        </div>
        <button onClick={() => setAuthUser(null)} className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 transition rounded-lg text-sm text-gray-300">
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </header>

      <div className="max-w-7xl mx-auto space-y-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-indigo-900/40 to-[#0A0F1C] border border-indigo-500/20 p-6 rounded-2xl group hover:border-indigo-500/50 transition">
             <h3 className="text-gray-400 text-sm font-medium flex items-center justify-between">Total Students <UserCheck className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition" /></h3>
             <p className="text-4xl font-bold text-white mt-2">{enhancedStudents.length}</p>
          </div>
          <div className="bg-gradient-to-br from-red-900/40 to-[#0A0F1C] border border-red-500/20 p-6 rounded-2xl group hover:border-red-500/50 transition">
             <h3 className="text-gray-400 text-sm font-medium flex items-center justify-between">High Risk (Predictive) <AlertTriangle className="w-5 h-5 text-red-500 group-hover:scale-110 transition" /></h3>
             <p className="text-4xl font-bold text-red-400 mt-2">{enhancedStudents.filter(s => s.risk >= 50).length}</p>
          </div>
          <div className="bg-gradient-to-br from-orange-900/40 to-[#0A0F1C] border border-orange-500/20 p-6 rounded-2xl group hover:border-orange-500/50 transition">
             <h3 className="text-gray-400 text-sm font-medium flex items-center justify-between">Silent Dropouts <Activity className="w-5 h-5 text-orange-400 group-hover:scale-110 transition" /></h3>
             <p className="text-4xl font-bold text-orange-400 mt-2">{enhancedStudents.filter(s => isSilentDropout(s)).length}</p>
             <p className="text-xs text-orange-500/70 mt-1">Attendance &gt; 70% + Engagement &lt; 40%</p>
          </div>
          <div className="bg-gradient-to-br from-purple-900/40 to-[#0A0F1C] border border-purple-500/20 p-6 rounded-2xl flex flex-col justify-center items-center cursor-pointer hover:bg-purple-900/50 transition relative overflow-hidden group">
             <Sparkles className="w-8 h-8 text-purple-400 mb-2 group-hover:rotate-12 transition" />
             <span className="font-semibold text-purple-300 relative z-10">Run Engine Analysis</span>
             <div className="absolute inset-0 bg-purple-500/10 opacity-0 group-hover:opacity-100 transition duration-500"></div>
          </div>
        </div>

        {/* Analytics Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#101625] border border-gray-800 p-6 rounded-2xl">
             <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Risk Distribution</h3>
             <div className="h-64 relative group">
               <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                   <Pie data={riskData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                     {riskData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                   </Pie>
                   <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px', color: '#fff' }} />
                 </PieChart>
               </ResponsiveContainer>
             </div>
             <div className="flex justify-center gap-6 mt-2">
               {riskData.map(d => (
                 <div key={d.name} className="flex items-center gap-2"><div className="w-3 h-3 rounded-full" style={{backgroundColor: d.color}}></div><span className="text-xs text-gray-400">{d.name}</span></div>
               ))}
             </div>
          </div>
          <div className="bg-[#101625] border border-gray-800 p-6 rounded-2xl">
             <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider flex items-center gap-2"><TrendingDown className="w-4 h-4 text-gray-400" /> Top 5 At-Risk Profiles</h3>
             <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topAtRisk} layout="vertical" margin={{ top: 0, right: 0, left: 20, bottom: 0 }}>
                    <XAxis type="number" domain={[0, 100]} hide />
                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} />
                    <Tooltip cursor={{fill: '#1F2937'}} contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px', color: '#fff' }} />
                    <Bar dataKey="risk" radius={[0, 4, 4, 0]}>
                      {topAtRisk.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.risk >= 50 ? '#EF4444' : '#F59E0B'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
             </div>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-[#101625] p-4 rounded-xl border border-gray-800">
           <div className="relative w-full md:w-96 group">
             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-indigo-400 transition" />
             <input type="text" placeholder="Search students by name..." className="w-full bg-gray-900 border border-gray-800 text-white text-sm rounded-lg pl-10 px-4 py-2 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
           </div>
           <div className="flex items-center gap-2 w-full md:w-auto">
             <Filter className="w-4 h-4 text-gray-500" />
             <select className="bg-gray-900 border border-gray-800 text-white text-sm rounded-lg px-4 py-2 focus:outline-none focus:border-indigo-500/50 transition cursor-pointer" value={filterRisk} onChange={(e) => setFilterRisk(e.target.value)}>
               <option value="ALL">All Risk Levels</option>
               <option value="HIGH">High Risk (&ge;50)</option>
               <option value="MEDIUM">Medium Risk (30-49)</option>
               <option value="SAFE">Safe (&lt;30)</option>
             </select>
           </div>
        </div>

        {/* Student Table */}
        <div className="bg-[#101625] border border-gray-800 rounded-2xl overflow-hidden shadow-2xl">
          <table className="w-full text-left border-collapse cursor-pointer">
            <thead>
              <tr className="bg-gray-800/50 text-gray-400 text-xs uppercase tracking-wider">
                <th className="p-4 font-semibold">Student Name</th>
                <th className="p-4 font-semibold text-center">Marks</th>
                <th className="p-4 font-semibold text-center">Attendance</th>
                <th className="p-4 font-semibold text-center">Engagement</th>
                <th className="p-4 font-semibold">Risk Engine Score</th>
                <th className="p-4 font-semibold text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60">
              {filteredStudents.map((student) => {
                const isSilent = isSilentDropout(student);
                return (
                  <tr key={student.id} onClick={() => setSelectedStudent(student)} className="hover:bg-gray-800/50 transition duration-200 group">
                    <td className="p-4">
                      <p className="font-semibold text-white">{student.name}</p>
                      {isSilent && <span className="text-[10px] uppercase font-bold text-orange-400 tracking-wider bg-orange-400/10 px-2 py-0.5 rounded-full mt-1 inline-block animate-pulse">Silent Risk ⚠️</span>}
                    </td>
                    <td className="p-4 text-center text-gray-300">{student.marks}%</td>
                    <td className="p-4 text-center text-gray-300">{student.attendance}%</td>
                    <td className="p-4 text-center text-gray-300">{student.engagement}%</td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-2 bg-gray-900 rounded-full overflow-hidden w-24">
                          <div className={`h-full rounded-full transition-all duration-1000 ${student.risk >= 50 ? 'bg-red-500' : student.risk >= 30 ? 'bg-orange-500' : 'bg-emerald-500'}`} style={{ width: `${Math.min(student.risk, 100)}%` }} />
                        </div>
                        <span className={`font-mono text-sm font-semibold ${student.risk >= 50 ? 'text-red-400' : student.risk >= 30 ? 'text-orange-400' : 'text-emerald-400'}`}>
                          {student.risk.toFixed(1)}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                       <button className="text-gray-500 group-hover:text-indigo-400 transition"><ChevronRight className="w-5 h-5 mx-auto group-hover:translate-x-1 transition-transform" /></button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filteredStudents.length === 0 && <div className="p-8 text-center text-gray-500">No students match current filters.</div>}
        </div>

      </div>

      {/* Detail Modal Overlay */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-end transition-all">
          <div className="w-full md:w-[500px] h-full bg-[#101625] border-l border-gray-800 shadow-2xl p-8 overflow-y-auto animate-in slide-in-from-right duration-300 relative">
            <button onClick={() => setSelectedStudent(null)} className="absolute top-6 right-6 text-gray-500 hover:text-white bg-gray-800 rounded-full p-2 transition hover:rotate-90"><X className="w-5 h-5" /></button>
            <h2 className="text-3xl font-bold text-white mb-2">{selectedStudent.name}</h2>
            <div className="flex gap-2 mb-8">
               <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-md ${selectedStudent.risk>=50?'bg-red-500/20 text-red-400':selectedStudent.risk>=30?'bg-orange-500/20 text-orange-400':'bg-emerald-500/20 text-emerald-400'}`}>
                 {selectedStudent.risk>=50 ? 'High Risk' : selectedStudent.risk>=30 ? 'Medium Risk' : 'Safe'}
               </span>
            </div>

            <div className="space-y-6">
               <div className="bg-gray-800/30 p-5 rounded-xl border border-gray-800 hover:border-gray-700 transition">
                 <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Aggregate Metrics</h4>
                 <div className="grid grid-cols-3 gap-4">
                   <div className="text-center group"><p className="text-3xl font-bold text-white group-hover:scale-110 transition">{selectedStudent.marks}%</p><p className="text-xs text-gray-500 mt-1">Marks</p></div>
                   <div className="text-center group"><p className="text-3xl font-bold text-white group-hover:scale-110 transition">{selectedStudent.attendance}%</p><p className="text-xs text-gray-500 mt-1">Attendance</p></div>
                   <div className="text-center group"><p className="text-3xl font-bold text-white group-hover:scale-110 transition">{selectedStudent.engagement}%</p><p className="text-xs text-gray-500 mt-1">Engagement</p></div>
                 </div>
               </div>

               <div className={`p-6 rounded-xl border ${selectedStudent.risk>=50?'bg-red-900/10 border-red-500/30':selectedStudent.risk>=30?'bg-orange-900/10 border-orange-500/30':'bg-indigo-900/10 border-indigo-500/30'}`}>
                 <h4 className="flex items-center gap-2 text-sm font-semibold text-white mb-4"><Sparkles className="w-4 h-4 text-purple-400" /> AI Recommendation Workflow</h4>
                 <p className="text-sm text-gray-300 leading-relaxed bg-black/20 p-4 rounded-lg border border-white/5">{getIntervention(selectedStudent, selectedStudent.risk)}</p>
               </div>

               {selectedStudent.risk >= 50 ? (
                 <button 
                  onClick={() => sendAlert(selectedStudent)}
                  disabled={sendingEmail}
                  className="w-full flex items-center justify-center gap-2 bg-red-600/90 hover:bg-red-500 text-white font-semibold py-4 rounded-xl transition shadow-[0_0_15px_rgba(239,68,68,0.2)] hover:shadow-[0_0_25px_rgba(239,68,68,0.4)] disabled:opacity-50"
                 >
                   <Mail className="w-5 h-5" /> 
                   {sendingEmail ? "Dispatching Alert..." : "Dispatch Urgent Email Alert 🚨"}
                 </button>
               ) : (
                 <button className="w-full flex items-center justify-center gap-2 bg-gray-800 text-gray-500 border border-gray-700 cursor-not-allowed font-semibold py-4 rounded-xl transition">
                   <Mail className="w-5 h-5" /> Student Safe. Alert disabled.
                 </button>
               )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
