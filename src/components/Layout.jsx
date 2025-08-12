// src/components/Layout.jsx (DEMO MODE)
import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { motion, AnimatePresence } from 'framer-motion';
import NotificationDisplay from './NotificationDisplay';

// Icons
const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const LogOutIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>;

const Header = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // **FIX: Check for mock user first, then real user**
        const mockUser = sessionStorage.getItem('mockUser');
        if (mockUser) {
            setUser(JSON.parse(mockUser));
            setLoading(false);
            return;
        }

        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
        // **FIX: Clear mock user from session storage**
        sessionStorage.removeItem('mockUser');
        await signOut(auth);
        navigate('/');
        window.location.reload(); // Force a reload to clear all state
    };

    return (
        <header className="bg-slate-800/80 backdrop-blur-sm shadow-md border-b border-slate-700 sticky top-0 z-50">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-20">
                <Link to="/" className="text-2xl font-bold text-white tracking-wider">
                    CourseApp
                </Link>
                <div className="flex items-center gap-4">
                    {loading ? (
                        <div className="w-24 h-8 bg-slate-700 rounded-md animate-pulse"></div>
                    ) : user ? (
                        <>
                            <Link to="/student-home" className="text-sm font-semibold text-slate-300 hover:text-white transition">My Dashboard</Link>
                            <button onClick={handleLogout} className="bg-red-600/80 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg flex items-center gap-2 transition text-sm">
                                <LogOutIcon />
                                <span>Logout</span>
                            </button>
                        </>
                    ) : (
                        <div className="relative">
                            <button 
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-5 rounded-lg flex items-center gap-2 transition text-sm"
                            >
                                <UserIcon />
                                <span>Login</span>
                            </button>
                            <AnimatePresence>
                                {isDropdownOpen && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="absolute right-0 mt-2 w-48 bg-slate-700 border border-slate-600 rounded-md shadow-lg py-1 z-50"
                                        onMouseLeave={() => setIsDropdownOpen(false)}
                                    >
                                        <Link to="/student-login" onClick={() => setIsDropdownOpen(false)} className="block px-4 py-2 text-sm text-slate-200 hover:bg-slate-600">Student Login</Link>
                                        <Link to="/login" onClick={() => setIsDropdownOpen(false)} className="block px-4 py-2 text-sm text-slate-200 hover:bg-slate-600">Admin Login</Link>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    )}
                </div>
            </nav>
        </header>
    );
};

export default function Layout() {
    return (
        <div className="bg-slate-900 min-h-screen">
            <Header />
            <NotificationDisplay />
            <main>
                <Outlet />
            </main>
        </div>
    );
}
