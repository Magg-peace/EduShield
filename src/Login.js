import React, { useState } from 'react';
import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth, provider } from './firebase';
import { ShieldAlert, LogIn, Activity, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const Login = ({ setAuthUser }) => {
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState('login'); // login | signup | forgot
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      setAuthUser(result.user);
      navigate('/dashboard');
    } catch (err) {
      setErrorMsg('Google Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      if (view === 'signup') {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        // Optionally update profile with Name here
        setAuthUser(result.user);
        navigate('/dashboard');
      } else if (view === 'login') {
        const result = await signInWithEmailAndPassword(auth, email, password);
        setAuthUser(result.user);
        navigate('/dashboard');
      } else if (view === 'forgot') {
        await sendPasswordResetEmail(auth, email);
        setSuccessMsg('Password reset email sent! Check your inbox.');
        setView('login');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0F1C] flex items-center justify-center relative overflow-hidden">
      {/* Dynamic Background Blurs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-indigo-500/30 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md p-8 md:p-12 bg-[#101625]/80 backdrop-blur-xl border border-white/10 rounded-[2rem] shadow-2xl">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-indigo-500 blur-lg opacity-50 rounded-full"></div>
            <div className="relative bg-gradient-to-br from-indigo-500 to-cyan-500 p-4 rounded-2xl">
              <ShieldAlert className="w-10 h-10 text-white" />
            </div>
          </div>
        </div>

        <h1 className="text-3xl font-extrabold text-white mb-2 text-center tracking-tight">
          {view === 'login' && 'Welcome Back'}
          {view === 'signup' && 'Create Account'}
          {view === 'forgot' && 'Reset Password'}
        </h1>
        <p className="text-gray-400 mb-8 font-medium text-center text-sm">
          EduShield X Behavioral Intelligence
        </p>

        {errorMsg && <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg text-sm mb-6 text-center">{errorMsg}</div>}
        {successMsg && <div className="bg-emerald-500/10 border border-emerald-500/50 text-emerald-400 p-3 rounded-lg text-sm mb-6 text-center">{successMsg}</div>}

        <form onSubmit={handleEmailAuth} className="space-y-4 mb-6">
          {view === 'signup' && (
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input type="text" placeholder="Full Name" required value={name} onChange={(e)=>setName(e.target.value)} className="w-full bg-[#0A0F1C] border border-gray-700 text-white rounded-xl pl-11 px-4 py-3 focus:outline-none focus:border-indigo-500 transition" />
            </div>
          )}
          
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input type="email" placeholder="Email Address" required value={email} onChange={(e)=>setEmail(e.target.value)} className="w-full bg-[#0A0F1C] border border-gray-700 text-white rounded-xl pl-11 px-4 py-3 focus:outline-none focus:border-indigo-500 transition" />
          </div>

          {view !== 'forgot' && (
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input type="password" placeholder="Password" required value={password} onChange={(e)=>setPassword(e.target.value)} className="w-full bg-[#0A0F1C] border border-gray-700 text-white rounded-xl pl-11 px-4 py-3 focus:outline-none focus:border-indigo-500 transition" />
            </div>
          )}

          {view === 'login' && (
            <div className="text-right">
              <button type="button" onClick={() => setView('forgot')} className="text-sm text-indigo-400 hover:text-indigo-300 font-medium">Forgot password?</button>
            </div>
          )}

          <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-3 px-6 rounded-xl transition shadow-[0_0_15px_rgba(99,102,241,0.3)] hover:shadow-[0_0_25px_rgba(99,102,241,0.5)] flex items-center justify-center gap-2">
            {loading ? <Activity className="w-5 h-5 animate-spin" /> : (
              <>
                {view === 'login' ? 'Log In' : view === 'signup' ? 'Sign Up' : 'Send Reset Link'}
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {view !== 'forgot' && (
          <>
            <div className="relative flex py-2 items-center mb-6">
              <div className="flex-grow border-t border-gray-700"></div>
              <span className="flex-shrink-0 mx-4 text-gray-500 text-sm">Or continue with</span>
              <div className="flex-grow border-t border-gray-700"></div>
            </div>

            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              type="button"
              className="w-full relative group overflow-hidden bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-white font-semibold py-3 px-6 rounded-xl flex items-center justify-center gap-3 disabled:opacity-50"
            >
              <LogIn className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
              <span>Google</span>
            </button>
          </>
        )}

        <div className="mt-8 text-center text-sm text-gray-400">
          {view === 'login' ? (
            <p>Don't have an account? <button onClick={() => setView('signup')} className="text-indigo-400 hover:text-indigo-300 font-semibold ml-1">Sign up</button></p>
          ) : (
             <p>Back to login? <button onClick={() => setView('login')} className="text-indigo-400 hover:text-indigo-300 font-semibold ml-1">Log in</button></p>
          )}
        </div>

      </div>
    </div>
  );
};

export default Login;
