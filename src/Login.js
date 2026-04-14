import React, { useState } from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from './firebase';
import { ShieldAlert, LogIn, Activity } from 'lucide-react';

const Login = ({ setAuthUser }) => {
  const [loading, setLoading] = useState(false);

  const login = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      setAuthUser(result.user);
    } catch (err) {
      console.error(err);
      alert('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0F1C] flex items-center justify-center relative overflow-hidden">
      {/* Dynamic Background Blurs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-indigo-500/30 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md p-8 md:p-12 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl text-center">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-indigo-500 blur-lg opacity-50 rounded-full"></div>
            <div className="relative bg-gradient-to-br from-indigo-500 to-purple-600 p-4 rounded-2xl">
              <ShieldAlert className="w-12 h-12 text-white" />
            </div>
          </div>
        </div>

        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 mb-2 tracking-tight">
          EduShield X
        </h1>
        <p className="text-gray-400 mb-8 font-medium">Behavioral Intelligence System</p>

        <button
          onClick={login}
          disabled={loading}
          className="w-full relative group overflow-hidden bg-white/10 hover:bg-white/15 border border-white/20 transition-all duration-300 ease-out text-white font-semibold py-3 px-6 rounded-xl flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(99,102,241,0.15)] hover:shadow-[0_0_25px_rgba(99,102,241,0.3)]"
        >
          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-indigo-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
          {loading ? (
            <Activity className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <LogIn className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform" />
              <span>Continue with Google</span>
            </>
          )}
        </button>

        <p className="mt-8 text-xs text-gray-500 text-center">
          Predicting risks before they happen. Empowering educators with invisible signals.
        </p>
      </div>
    </div>
  );
};

export default Login;
