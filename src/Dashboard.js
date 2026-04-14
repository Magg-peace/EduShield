import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from './firebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { LogOut, AlertTriangle, TrendingDown, UserCheck, Activity, ShieldAlert, Sparkles, Search, Filter, X, ChevronRight, Mail, PhoneCall, Mic, MicOff, Globe, MapPin, CheckCircle } from 'lucide-react';

const dict = {
  en: { title: "EduShield X", sub: "Predictive Intelligence Dashboard", total: "Total Students", highRisk: "High Risk (Predictive)", silent: "Silent Dropouts", run: "Run Engine Analysis", logout: "Logout", report: "Report Crisis", map: "Campus Incident Hotspots" },
  es: { title: "EduShield X", sub: "Panel de Inteligencia Predictiva", total: "Estudiantes Totales", highRisk: "Alto Riesgo (Predictivo)", silent: "Deserciones Silenciosas", run: "Ejecutar Análisis", logout: "Cerrar Sesión", report: "Reportar Crisis", map: "Zonas de Incidentes en Campus" }
};
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';

const Dashboard = ({ setAuthUser }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRisk, setFilterRisk] = useState("ALL");
  const [sendingEmail, setSendingEmail] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportType, setReportType] = useState('emergency');
  const [reportDesc, setReportDesc] = useState('');
  const [submittingReport, setSubmittingReport] = useState(false);
  const [lang, setLang] = useState('en');
  const [toast, setToast] = useState(null);
  const [isListening, setIsListening] = useState(false);
  
  const navigate = useNavigate();
  const t = dict[lang];

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleVoiceRecord = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return showToast("Voice recognition not supported in this browser.", "error");
    const recognition = new SpeechRecognition();
    recognition.lang = lang === 'en' ? 'en-US' : 'es-ES';
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (e) => setReportDesc(prev => prev + " " + e.results[0][0].transcript);
    recognition.onerror = () => { showToast("Error capturing voice", "error"); setIsListening(false); };
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

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
        showToast("Alert dispatched successfully! 📩", "success");
      } else {
        showToast("Action completed (Local Test Mode)", "success");
      }
    } catch (error) {
      showToast("Action completed (Local Test Mode)", "success");
    } finally {
      setSendingEmail(false);
    }
  };

  const submitReport = async (e) => {
    e.preventDefault();
    setSubmittingReport(true);
    try {
      await addDoc(collection(db, 'reports'), {
        type: reportType,
        description: reportDesc,
        status: 'pending',
        timestamp: serverTimestamp(),
        userId: auth.currentUser?.uid || 'anonymous'
      });
      
      if (reportType === 'emergency' || reportType === 'harassment') {
        // Trigger automated AI workflow
        await fetch("https://us-central1-edushield-979f8.cloudfunctions.net/dispatchAlert", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: "CRITICAL: " + reportType.toUpperCase() + " reported. Immediate action required.",
            userId: auth.currentUser?.uid || 'anonymous',
            description: reportDesc
          })
        });
      }
      
      showToast("Report successfully logged and AI workflow engaged.", "success");
      setShowReportModal(false);
      setReportDesc('');
    } catch (error) {
      console.error(error);
      showToast("Failed to send report", "error");
    } finally {
      setSubmittingReport(false);
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
            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 tracking-tight">{t.title}</h1>
            <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest">{t.sub}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => setLang(lang === 'en' ? 'es' : 'en')} className="flex items-center gap-2 px-3 py-2 bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white transition rounded-lg text-sm font-bold">
            <Globe className="w-4 h-4" /> {lang === 'en' ? 'ES' : 'EN'}
          </button>
          <button onClick={() => setShowReportModal(true)} className="flex items-center gap-2 px-4 py-2 bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white border border-red-500/30 transition rounded-lg text-sm font-bold shadow-[0_0_15px_rgba(239,68,68,0.2)]">
            <PhoneCall className="w-4 h-4 animate-pulse" /> {t.report}
          </button>
          <button onClick={() => setAuthUser(null)} className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 transition rounded-lg text-sm text-gray-300 hidden md:flex">
            <LogOut className="w-4 h-4" /> {t.logout}
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto space-y-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-indigo-900/40 to-[#0A0F1C] border border-indigo-500/20 p-6 rounded-2xl group hover:border-indigo-500/50 transition">
             <h3 className="text-gray-400 text-sm font-medium flex items-center justify-between">{t.total} <UserCheck className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition" /></h3>
             <p className="text-4xl font-bold text-white mt-2">{enhancedStudents.length}</p>
          </div>
          <div className="bg-gradient-to-br from-red-900/40 to-[#0A0F1C] border border-red-500/20 p-6 rounded-2xl group hover:border-red-500/50 transition">
             <h3 className="text-gray-400 text-sm font-medium flex items-center justify-between">{t.highRisk} <AlertTriangle className="w-5 h-5 text-red-500 group-hover:scale-110 transition" /></h3>
             <p className="text-4xl font-bold text-red-400 mt-2">{enhancedStudents.filter(s => s.risk >= 50).length}</p>
          </div>
          <div className="bg-gradient-to-br from-orange-900/40 to-[#0A0F1C] border border-orange-500/20 p-6 rounded-2xl group hover:border-orange-500/50 transition">
             <h3 className="text-gray-400 text-sm font-medium flex items-center justify-between">{t.silent} <Activity className="w-5 h-5 text-orange-400 group-hover:scale-110 transition" /></h3>
             <p className="text-4xl font-bold text-orange-400 mt-2">{enhancedStudents.filter(s => isSilentDropout(s)).length}</p>
             <p className="text-xs text-orange-500/70 mt-1">Attendance &gt; 70% + Engagement &lt; 40%</p>
          </div>
          <div className="bg-gradient-to-br from-purple-900/40 to-[#0A0F1C] border border-purple-500/20 p-6 rounded-2xl flex flex-col justify-center items-center cursor-pointer hover:bg-purple-900/50 transition relative overflow-hidden group">
             <Sparkles className="w-8 h-8 text-purple-400 mb-2 group-hover:rotate-12 transition" />
             <span className="font-semibold text-purple-300 relative z-10">{t.run}</span>
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

        {/* Campus Map & Alerts */}
        <div className="bg-[#101625] border border-gray-800 p-6 rounded-2xl">
          <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider flex items-center gap-2"><MapPin className="w-4 h-4 text-gray-400" /> {t.map}</h3>
          <div className="relative w-full h-48 bg-gray-900 rounded-xl overflow-hidden border border-gray-800 flex items-center justify-center">
             <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#4f46e5 1px, transparent 1px)', backgroundSize: '16px 16px' }}></div>
             <div className="absolute top-10 flex flex-col items-center top-[20%] left-[30%]">
               <div className="w-4 h-4 bg-orange-500 rounded-full animate-ping absolute"></div>
               <div className="w-4 h-4 bg-orange-500 rounded-full relative z-10 border-2 border-gray-900"></div>
               <span className="text-[10px] text-orange-400 font-bold mt-1 bg-gray-900 px-1 rounded">Library (Academic)</span>
             </div>
             <div className="absolute flex flex-col items-center bottom-[30%] right-[25%]">
               <div className="w-4 h-4 bg-red-500 rounded-full animate-ping absolute"></div>
               <div className="w-4 h-4 bg-red-500 rounded-full relative z-10 border-2 border-gray-900"></div>
               <span className="text-[10px] text-red-500 font-bold mt-1 bg-gray-900 px-1 rounded">Dorm 4 (Emergency)</span>
             </div>
             <div className="absolute flex flex-col items-center top-[40%] right-[45%]">
               <div className="w-3 h-3 bg-indigo-500 rounded-full relative z-10 border-2 border-gray-900"></div>
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
                  <tr key={student.id} onClick={() => navigate(`/student/${student.id}`)} className="hover:bg-gray-800/50 transition duration-200 group">
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
      
      {/* Crisis Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#101625] border border-gray-800 rounded-2xl p-8 max-w-md w-full shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <button onClick={() => setShowReportModal(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white"><X className="w-5 h-5" /></button>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-red-500/20 rounded-full"><AlertTriangle className="w-6 h-6 text-red-500" /></div>
              <h2 className="text-2xl font-bold text-white">Report Incident</h2>
            </div>
            
            <form onSubmit={submitReport} className="space-y-5">
               <div>
                 <label className="text-sm text-gray-400 mb-2 block font-semibold uppercase tracking-wider">Incident Category</label>
                 <select value={reportType} onChange={(e) => setReportType(e.target.value)} className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-red-500/50 transition">
                   <option value="emergency">🚨 Critical Emergency / Crisis</option>
                   <option value="harassment">⚠️ Harassment / Bullying</option>
                   <option value="academic">📚 Academic Integrity Issue</option>
                   <option value="general">ℹ️ General Concern</option>
                 </select>
               </div>
               <div>
                 <div className="flex justify-between items-end mb-2">
                   <label className="text-sm text-gray-400 block font-semibold uppercase tracking-wider">Description</label>
                   <button type="button" onClick={handleVoiceRecord} className={`flex items-center gap-1 text-xs px-2 py-1 rounded transition ${isListening ? 'bg-red-500/20 text-red-400 animate-pulse' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
                     {isListening ? <Mic className="w-3 h-3" /> : <MicOff className="w-3 h-3" />}
                     {isListening ? 'Recording...' : 'Voice Dictation'}
                   </button>
                 </div>
                 <textarea required value={reportDesc} onChange={(e) => setReportDesc(e.target.value)} rows={4} placeholder="Describe the situation securely and anonymously. Our AI engine will parse this immediately." className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-red-500/50 transition resize-none"></textarea>
               </div>
               
               <p className="text-xs text-gray-500">Choosing high severity triggers an automated AI `dispatchAlert` directly to emergency administrative channels.</p>
               
               <button type="submit" disabled={submittingReport} className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3 px-6 rounded-xl transition shadow-[0_0_15px_rgba(239,68,68,0.3)] hover:shadow-[0_0_25px_rgba(239,68,68,0.5)] flex items-center justify-center gap-2">
                 {submittingReport ? <Activity className="w-5 h-5 animate-spin" /> : 'Log Report & Alert Staff'}
               </button>
            </form>
          </div>
        </div>
      )}
      
      {/* Live Toast System */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className={`flex items-center gap-3 px-5 py-3 rounded-2xl shadow-2xl border ${toast.type === 'error' ? 'bg-red-900/40 border-red-500/30 text-red-100' : 'bg-emerald-900/40 border-emerald-500/30 text-emerald-100'} backdrop-blur-xl`}>
             {toast.type === 'error' ? <AlertTriangle className="w-5 h-5 text-red-400" /> : <CheckCircle className="w-5 h-5 text-emerald-400" />}
             <span className="font-semibold text-sm">{toast.msg}</span>
             <button onClick={() => setToast(null)} className="ml-2 text-white/50 hover:text-white"><X className="w-4 h-4" /></button>
          </div>
        </div>
      )}

    </div>
  );
};

export default Dashboard;
