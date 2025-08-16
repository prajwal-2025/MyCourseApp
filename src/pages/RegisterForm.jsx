import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage, auth } from '../firebase';
import { useNotification } from '../context/NotificationContext';
import { UploadCloud, Clipboard, Check, AlertCircle, Info } from 'lucide-react';

const RegisterForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { showNotification } = useNotification();

    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [copied, setCopied] = useState(false);

    const [formData, setFormData] = useState({ name: '', email: '', phone: '', college: '' });
    const [paymentOption, setPaymentOption] = useState('full');
    const [screenshot, setScreenshot] = useState(null);

    const UPI_ID = 'pathanminingacademy.62732523@hdfcbank';
    const UPI_NAME = 'Pathan Mining Academy';

    useEffect(() => {
        const user = auth.currentUser;
        if (user && user.phoneNumber) {
            const phoneWithoutCountryCode = user.phoneNumber.replace('+91', '');
            setFormData(prev => ({ ...prev, phone: phoneWithoutCountryCode }));
        }
    }, []);

    useEffect(() => {
        const fetchCourse = async () => {
            if (!id) return;
            try {
                const docRef = doc(db, 'courses', id);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setCourse({ id: docSnap.id, ...docSnap.data() });
                } else {
                    showNotification('Course not found.', 'error');
                }
            } catch (error) {
                console.error("Error fetching course:", error);
                showNotification('Failed to load course details.', 'error');
            } finally {
                setLoading(false);
            }
        };
        fetchCourse();
    }, [id, showNotification]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setScreenshot(e.target.files[0]);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(UPI_ID);
        setCopied(true);
        showNotification('UPI ID copied to clipboard!', 'success');
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const user = auth.currentUser;
        if (!user) {
            showNotification('You are not logged in. Please log in again.', 'error');
            navigate('/login');
            return;
        }

        if (!screenshot) {
            showNotification('Please upload a payment screenshot.', 'error');
            return;
        }

        const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
        if (screenshot.size > MAX_FILE_SIZE) {
            showNotification('File is too large. Please upload an image under 5MB.', 'error');
            return;
        }
        if (!screenshot.type.startsWith('image/')) {
            showNotification('Invalid file type. Please upload an image file (PNG, JPG, etc.).', 'error');
            return;
        }

        setSubmitting(true);

        try {
            const screenshotRef = ref(storage, `screenshots/${id}/${Date.now()}_${screenshot.name}`);
            const uploadResult = await uploadBytes(screenshotRef, screenshot);
            const screenshotUrl = await getDownloadURL(uploadResult.ref);

            const currentPrice = course.specialOfferPrice || course.earlyBirdPrice;

            const registrationData = {
                ...formData,
                userId: user.uid,
                courseId: id,
                courseName: course.name,
                paymentOption,
                amountPaid: paymentOption === 'full' ? currentPrice : 99,
                priceOffered: currentPrice,
                screenshotUrl,
                confirmed: false,
                paymentStatus: paymentOption === 'full' ? 'full_payment_received' : 'seat_lock_pending',
                registeredAt: serverTimestamp(),
            };

            await addDoc(collection(db, 'registrations'), registrationData);
            
            navigate('/confirmation');

        } catch (error) {
            console.error("Error submitting registration:", error);
            showNotification('Submission failed. Please try again.', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <div className="text-center py-20 text-white">Loading course details...</div>;
    }

    if (!course) {
        return <div className="text-center py-20 text-white">Could not load course. Please go back and try again.</div>;
    }
    
    const currentPrice = course.specialOfferPrice || course.earlyBirdPrice;

    return (
        <div className="min-h-screen bg-slate-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                <div className="text-center mb-8 sm:mb-10">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-white">{course.name}</h1>
                    <p className="mt-2 text-base sm:text-lg text-slate-400">Complete the steps below to secure your spot.</p>
                </div>

                <form onSubmit={handleSubmit} className="bg-slate-800/50 p-6 sm:p-8 rounded-xl shadow-lg border border-slate-700 space-y-6 sm:space-y-8">
                    <div>
                        <h3 className="text-lg sm:text-xl font-bold text-white mb-4">Step 1: Choose Payment Option</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div onClick={() => setPaymentOption('full')} className={`p-4 sm:p-6 border-2 rounded-lg cursor-pointer transition ${paymentOption === 'full' ? 'border-orange-500 bg-orange-500/10' : 'border-slate-600 hover:border-orange-500'}`}>
                                <h4 className="font-bold text-base sm:text-lg text-white">Pay in Full</h4>
                                <p className="text-2xl sm:text-3xl font-extrabold text-orange-400 mt-2">₹{currentPrice}</p>
                            </div>
                            <div onClick={() => setPaymentOption('seat_lock')} className={`p-4 sm:p-6 border-2 rounded-lg cursor-pointer transition ${paymentOption === 'seat_lock' ? 'border-orange-500 bg-orange-500/10' : 'border-slate-600 hover:border-orange-500'}`}>
                                <h4 className="font-bold text-base sm:text-lg text-white">Lock Your Seat</h4>
                                <p className="text-2xl sm:text-3xl font-extrabold text-orange-400 mt-2">₹99</p>
                            </div>
                        </div>

                        {paymentOption === 'seat_lock' && (
                            <div className="mt-4 flex items-center gap-3 bg-blue-500/10 border border-blue-500/20 text-blue-300 text-sm p-3 rounded-lg">
                                <Info size={20} className="flex-shrink-0" />
                                <span>You will have to complete the full payment by 5th September.</span>
                            </div>
                        )}

                        <div className="mt-6 text-center bg-slate-700/50 p-4 rounded-lg">
                            <p className="text-sm text-slate-400 mb-2">Step 2: Copy our UPI ID</p>
                            <div className="flex items-center justify-center bg-slate-800 border border-slate-600 rounded-md px-3 py-2">
                                {/* FIX: Added break-all to prevent overflow on mobile */}
                                <span className="font-mono text-slate-200 text-sm sm:text-base break-all">{UPI_ID}</span>
                                <button type="button" onClick={copyToClipboard} className="ml-4 p-1.5 rounded-md hover:bg-slate-700 transition flex-shrink-0">
                                    {copied ? <Check className="text-green-400" size={16} /> : <Clipboard size={16} className="text-slate-400"/>}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg sm:text-xl font-bold text-white mb-4">Step 3: Payment</h3>
                        <div className="bg-yellow-500/10 border-l-4 border-yellow-400 p-4 rounded-r-lg">
                            <div className="flex">
                                <div className="flex-shrink-0"><AlertCircle className="h-5 w-5 text-yellow-400" /></div>
                                <div className="ml-3">
                                    <p className="text-sm text-yellow-200">
                                        Open your UPI app, paste the copied ID, and verify the name is <strong className="font-bold">"{UPI_NAME}"</strong> before paying.
                                        Take a screenshot after payment.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg sm:text-xl font-bold text-white mb-4">Step 4: Fill Your Details</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                            <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleInputChange} required className="w-full p-3 bg-slate-700/50 border-2 border-slate-600 rounded-md focus:ring-orange-500 focus:border-orange-500 text-white" />
                            <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleInputChange} required className="w-full p-3 bg-slate-700/50 border-2 border-slate-600 rounded-md focus:ring-orange-500 focus:border-orange-500 text-white" />
                            <input type="tel" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleInputChange} required className="w-full p-3 bg-slate-700/50 border-2 border-slate-600 rounded-md focus:ring-orange-500 focus:border-orange-500 text-white" />
                            <input type="text" name="college" placeholder="Your College" value={formData.college} onChange={handleInputChange} required className="w-full p-3 bg-slate-700/50 border-2 border-slate-600 rounded-md focus:ring-orange-500 focus:border-orange-500 text-white" />
                        </div>
                    </div>
                    
                    <div>
                        <h3 className="text-lg sm:text-xl font-bold text-white mb-4">Step 5: Upload Payment Screenshot</h3>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-600 border-dashed rounded-md">
                            <div className="space-y-1 text-center">
                                <UploadCloud className="mx-auto h-12 w-12 text-slate-500" />
                                <div className="flex text-sm text-slate-400 justify-center">
                                    <label htmlFor="file-upload" className="relative cursor-pointer bg-slate-800 rounded-md font-medium text-orange-400 hover:text-orange-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-orange-500 px-1">
                                        <span>Upload a file</span>
                                        <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" required />
                                    </label>
                                    <p className="pl-1">or drag and drop</p>
                                </div>
                                <p className="text-xs text-slate-500">{screenshot ? screenshot.name : 'PNG, JPG, GIF up to 5MB'}</p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <button type="submit" disabled={submitting} className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed">
                            {submitting ? 'Submitting...' : 'Submit Registration'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegisterForm;
