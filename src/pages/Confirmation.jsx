// src/pages/Confirmation.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { motion } from 'framer-motion';

export default function Confirmation() {
  const navigate = useNavigate();

  useEffect(() => {
    const duration = 2 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute top-0 -left-36 w-96 h-96 bg-purple-500/20 rounded-full filter blur-3xl opacity-50 animate-blob"></div>
        <div className="absolute bottom-0 -right-36 w-96 h-96 bg-indigo-500/20 rounded-full filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>

        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="w-full max-w-lg p-8 space-y-6 bg-slate-800/50 border border-slate-700 rounded-2xl shadow-2xl shadow-purple-900/20 relative z-10 text-center"
        >
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 120, delay: 0.3 }}
                className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-green-500/20"
            >
                <svg className="h-16 w-16 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
            </motion.div>

            <div>
                <h1 className="text-3xl font-bold text-white mt-4">Registration Submitted!</h1>
                <p className="text-slate-300 mt-3 leading-relaxed">
                    Thank you! We’ve received your details and your registration is now pending review. You will be notified upon confirmation.
                </p>
            </div>

            <div className="pt-4">
                <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate('/student-home')}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors shadow-lg shadow-purple-500/20"
                >
                    Go to Your Dashboard
                </motion.button>
            </div>
        </motion.div>
    </div>
  );
}
