// src/pages/Home.jsx
import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { motion } from 'framer-motion';
import { useNotification } from '../context/NotificationContext';
import CourseCard from '../components/CourseCard';

const SkeletonCard = () => (
    <div className="bg-slate-800/50 rounded-2xl overflow-hidden animate-pulse">
        <div className="bg-slate-700 w-full h-48"></div>
        <div className="p-5">
            <div className="h-6 bg-slate-700 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-slate-700 rounded w-1/2 mb-4"></div>
            <div className="flex justify-between items-center">
                <div className="h-8 bg-slate-700 rounded w-1/4"></div>
                <div className="h-10 bg-slate-700 rounded-lg w-1/3"></div>
            </div>
        </div>
    </div>
);

export default function Home() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const { showNotification } = useNotification();

    useEffect(() => {
        const loadCourses = async () => {
            setLoading(true);
            try {
                const snap = await getDocs(collection(db, 'courses'));
                setCourses(snap.docs.map(d => ({ id: d.id, ...d.data() })));
            } catch (e) { 
                console.error("Failed to load courses:", e);
                showNotification("Could not fetch available courses.", "error");
            } finally { 
                setLoading(false); 
            }
        };
        loadCourses();
    }, [showNotification]);

    return (
        <div>
            {/* Hero Section */}
            <section className="relative overflow-hidden pt-20 pb-20 md:pt-28 md:pb-28">
                <div className="absolute top-0 -left-36 w-96 h-96 bg-purple-500/20 rounded-full filter blur-3xl opacity-50 animate-blob"></div>
                <div className="absolute top-1/2 right-0 w-96 h-96 bg-indigo-500/20 rounded-full filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
                <div className="container mx-auto px-6 relative z-10 text-center">
                    <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-4xl md:text-6xl font-extrabold leading-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400">
                        Unlock Your Potential
                    </motion.h1>
                    <motion.p initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }} className="text-slate-300 mb-8 max-w-2xl mx-auto text-lg">
                        Bite-sized explanations, exam-focused content, and personalized doubt support for diploma mining students.
                    </motion.p>
                </div>
            </section>

            {/* Courses Section */}
            <section className="py-16">
                <div className="container mx-auto px-6">
                    <h2 className="text-3xl font-bold mb-8 text-center text-white">Available Courses</h2>
                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[...Array(3)].map((_, i) => <SkeletonCard key={i} />)}
                        </div>
                    ) : courses.length > 0 ? (
                        <motion.div
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
                            initial="hidden"
                            animate="visible"
                            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
                        >
                            {courses.map(c => <CourseCard key={c.id} course={c} />)}
                        </motion.div>
                    ) : (
                        <div className="text-center text-slate-400 bg-slate-800/50 py-12 rounded-lg">
                            <p>No courses available at the moment.</p>
                            <p className="text-sm mt-2">Please check back later!</p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
