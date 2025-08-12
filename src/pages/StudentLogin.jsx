// src/pages/StudentLogin.jsx (FULL DEMO MODE)
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../context/NotificationContext';
import { motion } from 'framer-motion';

export default function StudentLogin() {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  const handleMockLogin = async () => {
    if (phone.length !== 10 || !/^\d{10}$/.test(phone)) {
      showNotification('Please enter a valid 10-digit phone number.', 'error');
      return;
    }
    setLoading(true);
    try {
      // Create a fake user object that looks like a Firebase user
      const mockUser = {
          uid: `mock-uid-${phone}`,
          phoneNumber: `+91${phone}`,
      };

      // **FIX:** Save the fake user to session storage
      // This allows other parts of the app to know about the demo session.
      sessionStorage.setItem('mockUser', JSON.stringify(mockUser));

      showNotification('Login successful!', 'success');
      
      const intendedPath = localStorage.getItem('intendedPath');
      localStorage.removeItem('intendedPath');
      
      // Navigate to the intended page or the homepage
      setTimeout(() => {
        navigate(intendedPath || '/');
      }, 500);

    } catch (err) {
      console.error(err);
      showNotification('Mock login failed.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="w-full max-w-md p-8 space-y-8 bg-slate-800/50 border border-slate-700 rounded-2xl shadow-2xl shadow-purple-900/20 z-10">
            <div className="text-center">
                <h2 className="text-3xl font-bold text-white">Student Login</h2>
                <p className="mt-2 text-slate-400">Enter your phone number to proceed.</p>
            </div>
            <motion.div key="phone" initial={{opacity: 0}} animate={{opacity: 1}} className="space-y-6">
                <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-slate-300 mb-1">Phone Number</label>
                    <div className="flex">
                        <span className="inline-flex items-center px-3 rounded-l-md border-2 border-r-0 border-slate-600 bg-slate-700/80 text-slate-300">+91</span>
                        <input
                            type="tel"
                            id="phone"
                            placeholder="98765 43210"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="flex-1 block w-full rounded-none rounded-r-md p-3 bg-slate-700/50 border-2 border-slate-600 placeholder-slate-400 focus:ring-purple-500 focus:border-purple-500 text-white"
                            disabled={loading}
                        />
                    </div>
                </div>
                <button onClick={handleMockLogin} disabled={loading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-lg text-lg font-semibold text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-purple-500 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors">
                    {loading ? 'Logging in...' : 'Login / Continue'}
                </button>
            </motion.div>
        </div>
    </div>
  );
}
