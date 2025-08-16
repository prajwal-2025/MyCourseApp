import React, {useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { Zap } from 'lucide-react';

// --- Import Firebase, Context, and Components ---
import { db, auth } from '../firebase';
import { useNotification } from '../context/NotificationContext';
import { WhatsAppIcon } from '../components/Icons';
import DashboardSkeleton from '../components/DashboardSkeleton';

export default function StudentHomePage() {
    const navigate = useNavigate();
    const { showNotification } = useNotification();

    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const user = auth.currentUser;

        if (!user) {
            showNotification('You need to be logged in to view this page.', 'error');
            navigate('/login');
            return;
        }

        const fetchRegistrations = async () => {
            setLoading(true);
            try {
                const regsQuery = query(collection(db, "registrations"), where("userId", "==", user.uid));
                const regsSnap = await getDocs(regsQuery);
                const regsData = regsSnap.docs.map(d => ({ id: d.id, ...d.data() }));

                const detailedRegs = await Promise.all(
                    regsData.map(async (reg) => {
                        if (reg.courseId === 'bundle') {
                            return { ...reg, course: { name: 'Combined Course Bundle' } };
                        }
                        const courseRef = doc(db, 'courses', reg.courseId);
                        const courseSnap = await getDoc(courseRef);
                        return { ...reg, course: courseSnap.exists() ? courseSnap.data() : null };
                    })
                );
                setRegistrations(detailedRegs);
            } catch (error) {
                console.error("Error fetching student registrations: ", error);
                showNotification("Could not fetch your registrations.", "error");
            } finally {
                setLoading(false);
            }
        };

        fetchRegistrations();
    }, [navigate, showNotification]);

    if (loading) {
        return <DashboardSkeleton />;
    }

    return (
        <div className="min-h-screen bg-slate-900 text-slate-200">
            {/* Mobile Optimization: Reduced padding */}
            <main className="max-w-5xl mx-auto py-8 px-4 pt-20 sm:pt-28">
                
                {/* Mobile Optimization: Responsive text size */}
                <h3 className="text-xl sm:text-2xl font-semibold mb-6 text-white">Your Enrolled Courses</h3>
                
                {registrations.length > 0 ? (
                    <div className="space-y-5">
                        {registrations.map(reg => (
                            <motion.div 
                                key={reg.id} 
                                className="bg-slate-800/50 border border-slate-700 p-4 sm:p-5 rounded-xl shadow-lg" 
                                initial={{ opacity: 0, y: 20 }} 
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <div className="flex flex-col sm:flex-row justify-between sm:items-center">
                                    <div>
                                        {/* Mobile Optimization: Responsive text size */}
                                        <h4 className="font-bold text-lg sm:text-xl text-white">{reg.course?.name || reg.courseId.toUpperCase()}</h4>
                                        {reg.isFromBundle && <p className="text-xs font-semibold text-purple-400">(Included in your bundle)</p>}
                                    </div>
                                    {reg.confirmed ? (
                                        <span className="mt-2 sm:mt-0 px-3 py-1 text-sm font-semibold text-green-300 bg-green-500/20 rounded-full self-start">Confirmed</span>
                                    ) : (
                                        <span className="mt-2 sm:mt-0 px-3 py-1 text-sm font-semibold text-yellow-300 bg-yellow-500/20 rounded-full self-start">Pending Review</span>
                                    )}
                                </div>
                                <div className="mt-4 border-t border-slate-700 pt-4">
                                    {reg.confirmed ? (
                                        <div>
                                            <p className="text-sm text-slate-300 mb-3">Welcome! You can now join the exclusive WhatsApp group for this course.</p>
                                            <a href={reg.course?.whatsappLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-green-600 text-white font-bold py-2 px-4 sm:px-5 rounded-lg hover:bg-green-700">
                                                <WhatsAppIcon />
                                                <span>Join WhatsApp Group</span>
                                            </a>
                                        </div>
                                    ) : (
                                        <p className="text-sm text-slate-400">Thank you for Registration, we have received your details. Your registration will be confirmed shortly after we verify your details. Come back in a little while to see your updated registration status.</p>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center p-6 sm:p-8 border-dashed border-2 border-slate-700 rounded-lg bg-slate-800/50">
                        <p className="text-slate-400">You haven't registered for any courses yet.</p>
                        <button 
                            onClick={() => navigate('/')} 
                            className="mt-4 bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-5 rounded-lg transition-all duration-300 shadow-lg"
                        >
                            View Available Courses
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
}
