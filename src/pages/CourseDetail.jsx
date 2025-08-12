// src/pages/CourseDetail.jsx (DEMO MODE)
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { motion } from 'framer-motion';
import { useNotification } from '../context/NotificationContext';
import { onAuthStateChanged } from 'firebase/auth';

// Icons
const CheckCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-400"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>;
const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;

const CourseDetailSkeleton = () => (
    <div className="bg-slate-900 min-h-screen text-white p-4 md:p-8 animate-pulse">
        <div className="container mx-auto max-w-7xl pt-20">
            <div className="h-10 bg-slate-800 rounded w-3/4 mb-4"></div>
            <div className="h-6 bg-slate-800 rounded w-1/2 mb-8"></div>
            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6"><div className="h-96 bg-slate-800 rounded-2xl"></div></div>
                <div className="lg:col-span-1"><div className="bg-slate-800/50 h-64 rounded-2xl"></div></div>
            </div>
        </div>
    </div>
);

export default function CourseDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { showNotification } = useNotification();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchData = async (currentUser) => {
            if (!id) {
                setLoading(false);
                return;
            }
            setLoading(true);
            setIsEnrolled(false); 
            
            try {
                const courseDocRef = doc(db, 'courses', id);
                const courseDocSnap = await getDoc(courseDocRef);

                if (courseDocSnap.exists()) {
                    setCourse({ id: courseDocSnap.id, ...courseDocSnap.data() });

                    if (currentUser) {
                        setUser(currentUser);
                        if (currentUser.uid.startsWith('mock-uid-')) {
                           setIsEnrolled(false);
                           return;
                        }
                        
                        const registrationDocRef = doc(db, 'registrations', `${currentUser.uid}_${id}`);
                        const registrationDocSnap = await getDoc(registrationDocRef);
                        setIsEnrolled(registrationDocSnap.exists());
                    }
                } else {
                    showNotification("Course not found.", "error");
                    navigate('/');
                }
            } catch (error) {
                console.error("Error fetching course data: ", error);
                showNotification("Failed to load course details.", "error");
            } finally {
                setLoading(false);
            }
        };
        
        const mockUserStr = sessionStorage.getItem('mockUser');
        if (mockUserStr) {
            fetchData(JSON.parse(mockUserStr));
        } else {
            const unsubscribe = onAuthStateChanged(auth, fetchData);
            return () => unsubscribe();
        }

    }, [id, navigate, showNotification]);

    const handleRegisterClick = () => {
        if (!user) {
            localStorage.setItem('intendedPath', `/course/${id}`);
            showNotification("Please log in to register for a course.", "info");
            navigate('/student-login');
            return;
        }

        if (isEnrolled) {
            showNotification("You are already enrolled in this course.", "info");
            navigate('/student-home');
        } else {
            navigate(`/register/${id}`);
        }
    };

    if (loading) return <CourseDetailSkeleton />;
    if (!course) return null;

    const buttonText = isEnrolled ? "Go to Dashboard" : "Register Now";
    const buttonClass = isEnrolled 
        ? "w-full bg-green-600 hover:bg-green-700 text-white font-semibold text-lg py-3 px-4 rounded-xl"
        : "w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold text-lg py-3 px-4 rounded-xl";

    return (
        <motion.div className="bg-slate-900 text-white pt-12 pb-12 md:pt-20 md:pb-20" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="container mx-auto max-w-7xl px-6">
                <h1 className="text-4xl md:text-5xl font-extrabold mb-2">{course.name}</h1>
                <div className="flex items-center text-slate-400 text-lg"><UserIcon /><span className="ml-2">Taught by {course.instructor}</span></div>
                <div className="grid lg:grid-cols-3 gap-8 lg:gap-12 mt-8">
                    <div className="lg:col-span-2">
                        <div className="rounded-2xl overflow-hidden mb-8"><img src={course.thumbnail || `https://placehold.co/800x450/1e1b4b/ffffff?text=${course.name}`} alt={course.name} className="w-full h-auto object-cover" /></div>
                        <h2 className="text-2xl font-bold text-slate-100 mb-4">About This Course</h2>
                        <p className="text-slate-300 leading-relaxed mb-8">{course.description}</p>
                        <h2 className="text-2xl font-bold text-slate-100 mb-4">What You'll Learn</h2>
                        {course.highlights && course.highlights.length > 0 && (
                            <ul className="space-y-3">
                                {course.highlights.map((point, index) => (
                                    <li key={index} className="flex items-start">
                                        <div className="flex-shrink-0 mt-1"><CheckCircleIcon /></div>
                                        <span className="ml-3 text-slate-300">{point}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    <div className="lg:col-span-1">
                        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 md:p-8 shadow-lg sticky top-28">
                            <h2 className="text-2xl font-bold mb-5 text-center text-white">Enroll Now</h2>
                            <div className="text-center mb-5">
                                <p className="text-5xl font-extrabold text-white">₹{course.earlyBirdPrice}</p>
                                <p className="text-xl line-through text-slate-400 mt-1">₹{course.basePrice}</p>
                            </div>
                            <p className="text-sm text-center text-green-400 font-medium mb-6">{course.discountNote || 'Special early bird price available!'}</p>
                            <button onClick={handleRegisterClick} className={buttonClass}>{buttonText}</button>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
