import React, { useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, onSnapshot, updateDoc, deleteDoc, doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// --- Import Firebase and Context ---
import { auth, db } from '../firebase'; 
import { useNotification } from '../context/NotificationContext';

// --- Import Child Components ---
import Modal from '../components/Modal';
import CourseForm from '../components/CourseForm';
import ConfirmationModal from '../components/ConfirmationModal';
import RegistrationsList from '../components/RegistrationsList';
import { UsersIcon, BookOpenIcon, LightbulbIcon, LogOutIcon } from '../components/Icons';


// --- Main Admin Page Component ---
export default function AdminPage() {
    const { showNotification } = useNotification();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [view, setView] = useState('registrations');
    
    // State for registrations tab
    const [regs, setRegs] = useState([]);
    const [regLoading, setRegLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [search, setSearch] = useState('');
    
    // State for courses tab
    const [courses, setCourses] = useState([]);
    const [coursesLoading, setCoursesLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCourse, setEditingCourse] = useState(null);
    
    // State for suggestions tab
    const [suggestions, setSuggestions] = useState([]);
    const [suggestionsLoading, setSuggestionsLoading] = useState(true);

    // State for the confirmation modal
    const [confirmModal, setConfirmModal] = useState({ isOpen: false, onConfirm: null, title: '', message: '' });

    // --- Effects ---
    // Effect for handling user authentication and authorization
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser && currentUser.email) {
                setUser(currentUser);
            } else {
                showNotification('You must be an admin to access this page.', 'error');
                navigate('/admin-login');
            }
        });
        return () => unsubscribe();
    }, [navigate, showNotification]);

    // Effect for fetching all necessary data from Firestore in real-time
    useEffect(() => {
        if (!user) return; // Don't fetch data if there's no authenticated admin user
        
        const unsubRegs = onSnapshot(collection(db, 'registrations'), (snapshot) => {
            setRegs(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
            setRegLoading(false);
        });
        
        const unsubCourses = onSnapshot(collection(db, 'courses'), (snapshot) => {
            setCourses(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
            setCoursesLoading(false);
        });

        const unsubSuggestions = onSnapshot(collection(db, 'suggestions'), (snapshot) => {
            setSuggestions(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
            setSuggestionsLoading(false);
        });

        // Cleanup the listeners when the component unmounts
        return () => {
            unsubRegs();
            unsubCourses();
            unsubSuggestions();
        };
    }, [user]); // This effect depends on the user state

    // --- Handlers ---
    const handleConfirmRegistration = (reg) => {
        setConfirmModal({
            isOpen: true,
            title: "Confirm Registration?",
            message: `Are you sure you have verified the payment for ${reg.name}? This action cannot be undone.`,
            onConfirm: async () => {
                try {
                    await updateDoc(doc(db, 'registrations', reg.id), { confirmed: true });
                    showNotification("Registration confirmed!", "success");
                } catch (error) {
                    showNotification("Failed to confirm registration.", "error");
                    console.error(error);
                } finally {
                    setConfirmModal({ isOpen: false });
                }
            }
        });
    };
    
    const handleSaveCourse = async (courseData) => {
        if (courseData.courseCode.includes('/')) {
            showNotification('Error: Course Code cannot contain a forward slash ("/").', 'error');
            return;
        }
        try {
            const docId = editingCourse ? editingCourse.id : courseData.courseCode.toLowerCase();
            const courseRef = doc(db, 'courses', docId);
            await setDoc(courseRef, courseData, { merge: true });
            showNotification(editingCourse ? "Course updated!" : "Course added!", "success");
            closeModal();
        } catch (error) {
            showNotification("Failed to save course. Check console for details.", "error");
            console.error("Firebase save error: ", error);
        }
    };
    
    const handleDeleteCourse = (id) => {
        setConfirmModal({
            isOpen: true,
            title: "Delete Course?",
            message: `Are you sure you want to delete this course (${id.toUpperCase()})? This cannot be undone.`,
            onConfirm: async () => {
                try {
                    await deleteDoc(doc(db, 'courses', id));
                    showNotification("Course deleted.", "success");
                } catch (error) {
                    showNotification("Failed to delete course.", "error");
                    console.error(error);
                } finally {
                    setConfirmModal({ isOpen: false });
                }
            }
        });
    };

    const openModal = (course = null) => {
        setEditingCourse(course);
        setIsModalOpen(true);
    };
    const closeModal = () => {
        setIsModalOpen(false);
        setEditingCourse(null);
    };
    
    // --- Render Logic ---
    // Loading state while checking auth
    if (!user) {
        return <div className="bg-slate-900 min-h-screen flex items-center justify-center text-white">Verifying access...</div>;
    }

    const renderView = () => {
        switch (view) {
            case 'registrations':
                return (
                    <div>
                        <div className="flex flex-col md:flex-row gap-3 mb-4 items-center bg-slate-800/50 p-3 rounded-lg border border-slate-700">
                            <div className="flex gap-2">
                                {['all', 'pending', 'confirmed'].map(f => <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-md text-sm font-semibold transition ${filter === f ? 'bg-purple-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}>{f.charAt(0).toUpperCase() + f.slice(1)}</button>)}
                            </div>
                            <input type="text" placeholder="Search by name or phone..." value={search} onChange={e => setSearch(e.target.value)} className="w-full md:w-auto md:ml-auto px-3 py-2 bg-slate-700/50 border-2 border-slate-600 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 text-white"/>
                        </div>
                        {regLoading ? <p className="text-center text-slate-400 py-4">Loading registrations...</p> : <RegistrationsList regs={regs} search={search} filter={filter} onConfirm={handleConfirmRegistration} />}
                    </div>
                );
            case 'courses':
                return (
                    <div>
                        <div className="text-right mb-4">
                            <button onClick={() => openModal()} className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-md">Add New Course</button>
                        </div>
                        {coursesLoading ? <p className="text-center text-slate-400 py-4">Loading courses...</p> : (
                            <div className="space-y-4">
                                {courses.map(c => (
                                    <div key={c.id} className="bg-slate-800/50 border border-slate-700 p-4 rounded-lg flex justify-between items-center">
                                        <div>
                                            <p className="font-bold text-white">{c.name}</p>
                                            <p className="text-sm text-slate-400">{c.id.toUpperCase()}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={() => openModal(c)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded-md text-sm">Edit</button>
                                            <button onClick={() => handleDeleteCourse(c.id)} className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded-md text-sm">Delete</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                );
            case 'suggestions':
                return (
                    <div className="bg-slate-800/50 border border-slate-700 p-4 rounded-lg">
                        {suggestionsLoading ? <p className="text-center text-slate-400 py-4">Loading suggestions...</p> : (
                            <div className="space-y-4">
                                {suggestions.length === 0 ? <p className="text-center text-slate-500 py-4">No suggestions yet.</p> : suggestions.map(s => (
                                    <div key={s.id} className="border-b border-slate-700 p-4 last:border-b-0">
                                        {/* FIX: Changed s.text to s.suggestion */}
                                        <p className="font-semibold text-white">"{s.suggestion}"</p>
                                        {/* FIX: Changed fields to s.name, s.mobile, and s.createdAt */}
                                        <p className="text-xs text-slate-400 mt-2">By: {s.name} ({s.mobile}) on {s.createdAt ? new Date(s.createdAt.seconds * 1000).toLocaleString() : 'N/A'}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 text-slate-200">
            <ConfirmationModal {...confirmModal} onClose={() => setConfirmModal({ isOpen: false })} />
            <Modal isOpen={isModalOpen} onClose={closeModal}>
                <CourseForm onSave={handleSaveCourse} onCancel={closeModal} course={editingCourse} />
            </Modal>
            
            <header className="bg-slate-800/80 backdrop-blur-sm shadow-md border-b border-slate-700 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
                    <button onClick={() => signOut(auth)} className="bg-red-600/80 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg flex items-center gap-2 transition">
                        <LogOutIcon />
                        <span>Log out</span>
                    </button>
                </div>
            </header>
            
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <div className="border-b border-slate-700 mb-6">
                        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                            {[
                                { key: 'registrations', label: 'Registrations', icon: <UsersIcon /> },
                                { key: 'courses', label: 'Courses', icon: <BookOpenIcon /> },
                                { key: 'suggestions', label: 'Suggestions', icon: <LightbulbIcon /> }
                            ].map(tab => (
                                <button key={tab.key} onClick={() => setView(tab.key)} className={`flex items-center gap-2 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition ${view === tab.key ? 'border-purple-500 text-purple-400' : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-500'}`}>
                                    {tab.icon} {tab.label}
                                </button>
                            ))}
                        </nav>
                    </div>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={view}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            {renderView()}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
}
