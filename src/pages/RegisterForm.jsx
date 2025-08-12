// src/pages/RegisterForm.jsx (DEMO MODE)
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useNotification } from '../context/NotificationContext';
import { motion } from 'framer-motion';
import { onAuthStateChanged } from 'firebase/auth';

// Icons
const UploadCloudIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"></path><path d="M12 12v9"></path><path d="m16 16-4-4-4 4"></path></svg>;
const CopyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path></svg>;

const CLOUDINARY_CLOUD_NAME = "drddwst2w";
const CLOUDINARY_UPLOAD_PRESET = "course_screenshot";

export default function RegisterForm() {
    const { id: courseId } = useParams();
    const navigate = useNavigate();
    const { showNotification } = useNotification();

    const [currentUser, setCurrentUser] = useState(null);
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', college: '' });
    const [screenshotFile, setScreenshotFile] = useState(null);
    const [paymentOption, setPaymentOption] = useState('full');
    const [priceToPay, setPriceToPay] = useState(0);

    useEffect(() => {
        const fetchData = async (user) => {
            // **FIX: This now handles both real and mock users**
            if (!user) {
                localStorage.setItem('intendedPath', `/register/${courseId}`);
                navigate('/student-login');
                return;
            }
            setCurrentUser(user);
            setFormData(prev => ({ ...prev, phone: user.phoneNumber?.replace('+91', '') || '' }));

            try {
                const courseRef = doc(db, 'courses', courseId);
                const courseSnap = await getDoc(courseRef);

                if (!courseSnap.exists()) {
                    setError('Course not found.');
                    showNotification('Course not found.', 'error');
                    navigate('/');
                    return;
                }
                const courseData = courseSnap.data();
                setCourse(courseData);
                setPriceToPay(courseData.earlyBirdPrice || courseData.basePrice);

            } catch (err) {
                console.error("Error fetching data:", err);
                setError('Failed to load registration details.');
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
    }, [courseId, navigate, showNotification]);

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            showNotification('UPI ID copied to clipboard!', 'success');
        });
    };

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleFileChange = (e) => setScreenshotFile(e.target.files[0]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!screenshotFile) {
            showNotification("Please upload a screenshot of your payment.", "error");
            return;
        }
        setIsSubmitting(true);
        try {
            const uploadFormData = new FormData();
            uploadFormData.append('file', screenshotFile);
            uploadFormData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

            const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
                method: 'POST',
                body: uploadFormData,
            });

            if (!response.ok) throw new Error('Image upload failed');
            
            const data = await response.json();
            const screenshotUrl = data.secure_url;
            
            if (!screenshotUrl) throw new Error("Cloudinary did not return a URL.");
            
            const docId = `${currentUser.uid}_${courseId}`;
            const finalPrice = paymentOption === 'full' ? priceToPay : 99;
            
            await setDoc(doc(db, 'registrations', docId), {
                userId: currentUser.uid,
                courseId,
                ...formData,
                screenshotUrl,
                priceOffered: priceToPay,
                amountPaid: finalPrice,
                paymentStatus: paymentOption === 'full' ? 'full_payment_pending' : 'seat_lock_pending',
                confirmed: false,
                registeredAt: new Date(),
            });
            navigate('/confirmation');
        } catch (error) {
            console.error('Error submitting form:', error);
            showNotification('There was an error submitting your registration.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return <div className="bg-slate-900 min-h-screen flex items-center justify-center text-white text-lg">Loading registration details...</div>;
    }
    
    if (error) return <div className="bg-slate-900 min-h-screen flex items-center justify-center text-red-500 font-semibold text-lg">{error}</div>;

    return (
        <div className="bg-slate-900 text-white min-h-screen font-sans pt-12 pb-12 md:pt-20 md:pb-20">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto px-4">
                <div className="bg-slate-800/50 border border-slate-700 p-6 md:p-8 rounded-2xl">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl md:text-4xl font-bold">{course?.name}</h2>
                        <p className="text-slate-400 mt-2">Complete the steps below to secure your spot.</p>
                    </div>
                    <div className="mb-8">
                        <h3 className="text-xl font-bold text-slate-100 mb-4">Step 1: Choose Payment Option</h3>
                        <div className="grid sm:grid-cols-2 gap-4 mt-4">
                            {[
                                { type: 'full', label: 'Pay in Full', price: priceToPay },
                                { type: 'lock', label: 'Lock Your Seat', price: 99 }
                            ].map(opt => (
                                <label key={opt.type} className={`relative flex items-center p-4 rounded-lg border-2 cursor-pointer ${paymentOption === opt.type ? 'bg-purple-500/10 border-purple-500' : 'bg-slate-800 border-slate-600'}`}>
                                    <input type="radio" name="paymentOption" value={opt.type} checked={paymentOption === opt.type} onChange={(e) => setPaymentOption(e.target.value)} className="opacity-0 absolute" />
                                    <div>
                                        <p className="font-semibold text-slate-100">{opt.label}</p>
                                        <p className="text-purple-400 font-bold text-2xl">₹{opt.price}</p>
                                    </div>
                                </label>
                            ))}
                        </div>
                        <div className="mt-6 text-center bg-slate-900 p-4 rounded-lg">
                            <p className="font-semibold text-slate-300">Pay using UPI to the ID below:</p>
                            <div className="flex items-center justify-center bg-slate-700/50 p-2 rounded-md mt-2">
                                <p className="font-mono text-purple-300">pathanminingacademy.62732523@hdfcbank</p>
                                <button onClick={() => copyToClipboard('pathanminingacademy.62732523@hdfcbank')} className="ml-3 text-slate-400"><CopyIcon /></button>
                            </div>
                        </div>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <h3 className="text-xl font-bold text-slate-100 mb-2">Step 2: Fill Your Details</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {[
                                { id: 'name', label: 'Full Name', type: 'text', placeholder: 'Your Name' },
                                { id: 'email', label: 'Email Address', type: 'email', placeholder: 'you@example.com' },
                                { id: 'phone', label: 'Phone Number', type: 'tel', disabled: true },
                                { id: 'college', label: 'College Name', type: 'text', placeholder: 'Your College' }
                            ].map(field => (
                                <div key={field.id}>
                                    <label htmlFor={field.id} className="block text-sm font-medium text-slate-300 mb-1">{field.label}</label>
                                    <input type={field.type} id={field.id} name={field.id} placeholder={field.placeholder} value={formData[field.id]} onChange={handleChange} required disabled={field.disabled}
                                        className="w-full p-3 bg-slate-700/50 border-2 border-slate-600 rounded-md" />
                                </div>
                            ))}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Step 3: Upload Payment Screenshot</label>
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-600 border-dashed rounded-md">
                                <div className="space-y-1 text-center">
                                    <UploadCloudIcon />
                                    <div className="flex text-sm text-slate-400">
                                        <label htmlFor="file-upload" className="relative cursor-pointer bg-slate-800 rounded-md font-medium text-purple-400 hover:text-purple-300">
                                            <span>Upload a file</span>
                                            <input id="file-upload" name="file-upload" type="file" accept="image/*" className="sr-only" onChange={handleFileChange} required />
                                        </label>
                                        <p className="pl-1">or drag and drop</p>
                                    </div>
                                    <p className="text-xs text-slate-500">{screenshotFile ? screenshotFile.name : 'PNG, JPG, GIF up to 10MB'}</p>
                                </div>
                            </div>
                        </div>
                        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={isSubmitting} className="w-full flex justify-center py-3 px-4 rounded-lg text-lg font-semibold text-white bg-purple-600 hover:bg-purple-700">
                            {isSubmitting ? 'Submitting...' : 'Submit Registration'}
                        </motion.button>
                    </form>
                </div>
            </motion.div>
        </div>
    );
}
