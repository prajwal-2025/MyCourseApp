import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { motion } from 'framer-motion';

// --- Import Firebase, Context, and Components ---
import { auth } from '../firebase';
import { useNotification } from '../context/NotificationContext';
import { MailIcon, LockIcon } from '../components/Icons';

/**
 * A page component for administrators to log in using email and password.
 */
export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  /**
   * Handles the admin login process using Firebase email/password authentication.
   * @param {React.FormEvent} e - The form submission event.
   */
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      showNotification('Login successful! Redirecting...', 'success');
      navigate('/admin'); // Navigate to the admin dashboard on successful login
    } catch (error) {
      console.error("Admin login failed:", error);
      showNotification("Invalid email or password. Please try again.", 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md p-8 space-y-8 bg-slate-800/50 border border-slate-700 rounded-2xl shadow-2xl shadow-purple-900/20"
        >
            <div className="text-center">
                <h2 className="text-3xl font-bold text-white">
                    Admin Panel Login
                </h2>
                <p className="mt-2 text-slate-400">Welcome back, please enter your details.</p>
            </div>
            <form className="space-y-6" onSubmit={handleLogin}>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1">
                        Email address
                    </label>
                    <div className="relative">
                        <MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full pl-10 p-3 bg-slate-700/50 border-2 border-slate-600 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 transition text-white"
                            placeholder="you@example.com"
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-1">
                        Password
                    </label>
                    <div className="relative">
                        <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full pl-10 p-3 bg-slate-700/50 border-2 border-slate-600 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 transition text-white"
                            placeholder="••••••••"
                        />
                    </div>
                </div>

                <div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-lg text-lg font-semibold text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-purple-500 disabled:bg-slate-600 disabled:cursor-not-allowed transition-all transform"
                    >
                        {loading ? 'Signing in...' : 'Sign in'}
                    </button>
                </div>
            </form>
        </motion.div>
    </div>
  );
}
