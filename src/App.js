import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';

import Landing from './Landing';
import Login from './Login';
import Dashboard from './Dashboard';
import StudentProfile from './StudentProfile';

function App() {
  const [authUser, setAuthUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAuthUser(user);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0A0F1C] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={!authUser ? <Landing /> : <Navigate to="/dashboard" />} />
          <Route path="/login" element={!authUser ? <Login setAuthUser={setAuthUser} /> : <Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={authUser ? <Dashboard setAuthUser={setAuthUser} /> : <Navigate to="/login" />} />
          <Route path="/student/:id" element={authUser ? <StudentProfile /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
