import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { CheckCircle, User, BookOpen, Clock, Zap } from 'lucide-react';

import { db } from '../firebase';
import { useAuth } from '../App';

const CourseDetailsPage = () => {
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();
    const navigate = useNavigate();
    const { currentUser } = useAuth();

    useEffect(() => {
        const fetchCourse = async () => {
            if (!id) {
                setLoading(false);
                return;
            }
            try {
                const docRef = doc(db, 'courses', id);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setCourse({ id: docSnap.id, ...docSnap.data() });
                } else {
                    console.log("No such course found!");
                }
            } catch (error) {
                console.error("Error fetching course: ", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCourse();
    }, [id]);

    const handleRegisterClick = () => {
        const targetUrl = course.id === 'bundle' ? '/bundle-register' : `/register/${id}`;
        if (currentUser) {
            navigate(targetUrl);
        } else {
            sessionStorage.setItem('redirectUrl', targetUrl);
            navigate('/student-login');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[80vh]">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    if (!course) {
        return <div className="text-center py-20 text-xl text-gray-600">Course not found.</div>;
    }

    const currentPrice = course.specialOfferPrice || course.earlyBirdPrice;
    const discount = course.basePrice && currentPrice
        ? Math.round(((course.basePrice - currentPrice) / course.basePrice) * 100)
        : 0;

    return (
        <div className="bg-white">
            {/* Mobile Optimization: Reduced padding */}
            <div className="bg-slate-900 text-white py-8 sm:py-12">
                <div className="container mx-auto px-4">
                    {/* Mobile Optimization: Responsive text size */}
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">{course.name}</h1>
                    <div className="flex items-center mt-4 text-base sm:text-lg text-slate-300">
                        <User size={20} className="mr-2" />
                        <span>Taught by {course.instructor}</span>
                    </div>
                </div>
            </div>

            {/* Mobile Optimization: Reduced padding */}
            <div className="container mx-auto px-4 py-8 md:py-12">
                {/* This grid already stacks correctly on mobile */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
                    <div className="lg:col-span-2">
                        <img 
                            src={course.thumbnail || 'https://placehold.co/600x400/E2E8F0/4A5568?text=PMA+Course'} 
                            alt={course.name} 
                            className="w-full rounded-lg shadow-2xl mb-8 aspect-video object-cover"
                        />
                        <div className="space-y-8 md:space-y-10">
                            <div>
                                {/* Mobile Optimization: Responsive heading size */}
                                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 flex items-center gap-3">
                                    <BookOpen size={28} /> About This Course
                                </h2>
                                <p className="text-gray-700 leading-relaxed whitespace-pre-line">{course.description}</p>
                            </div>
                            <div>
                                {/* Mobile Optimization: Responsive heading size */}
                                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">What You'll Learn</h2>
                                <ul className="space-y-3">
                                    {course.highlights?.map((highlight, index) => (
                                        <li key={index} className="flex items-start">
                                            <CheckCircle className="text-green-500 mt-1 mr-3 flex-shrink-0" size={20} />
                                            <span className="text-gray-700">{highlight}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-1">
                        {/* Mobile Optimization: Sticky only on large screens */}
                        <div className="bg-slate-50 border border-slate-200 rounded-lg shadow-lg p-6 lg:sticky lg:top-28 relative">
                            
                            {discount > 0 && (
                                <div className="absolute top-0 right-0 m-4 bg-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md flex items-center gap-1">
                                    <Zap size={14}/> Early Bird Offer! Save {discount}%
                                </div>
                            )}

                            {/* Mobile Optimization: Responsive heading size */}
                            <h3 className={`text-xl sm:text-2xl font-bold text-center mb-4 text-slate-800 ${discount > 0 ? 'mt-8' : ''}`}>
                                Enroll Now
                            </h3>
                            
                            <div className="text-center mb-4">
                                {/* Mobile Optimization: Responsive price size */}
                                <span className="text-3xl sm:text-4xl font-bold text-orange-600">₹{currentPrice}</span>
                                <span className="text-lg sm:text-xl text-slate-500 line-through ml-2">₹{course.basePrice}</span>
                            </div>

                            <div className="text-center bg-orange-50 border border-orange-200 text-orange-800 p-3 rounded-md mb-4 text-sm">
                                <p>
                                    Or, lock your price for just <span className="font-bold">₹99</span> and pay later!
                                </p>
                                <div className="font-bold mt-1">
                                    Register Now!!!
                                </div>
                            </div>

                            <button 
                                onClick={handleRegisterClick}
                                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-lg"
                            >
                                Register Now
                            </button>
                            
                            <div className="text-center mt-4 text-sm text-slate-500 flex items-center justify-center">
                                <Clock size={16} className="mr-1.5" />
                                <span> Hurry Up! Only {course.earlyBirdSlots} Early Bird offer slots remaining!</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseDetailsPage;
