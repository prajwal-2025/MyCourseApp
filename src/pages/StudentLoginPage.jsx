import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Smartphone, KeyRound } from 'lucide-react';

// --- Import Firebase, Context, and Components ---
import { auth, db } from '../firebase';
import { useNotification } from '../context/NotificationContext.jsx';

const StudentLoginPage = () => {
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [confirmationResult, setConfirmationResult] = useState(null);
    const navigate = useNavigate();
    const { showNotification } = useNotification();

    // Function to set up reCAPTCHA
    const setupRecaptcha = () => {
        if (!window.recaptchaVerifier) {
            window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
                'size': 'invisible',
                'callback': () => console.log("reCAPTCHA verified"),
                'expired-callback': () => showNotification('reCAPTCHA expired. Please try again.', 'error')
            });
        }
    };

    // Handle sending the OTP
    const handleSendOtp = async () => {
        if (!/^\d{10}$/.test(phone)) {
            showNotification('Please enter a valid 10-digit phone number.', 'error');
            return;
        }
        setLoading(true);
        try {
            setupRecaptcha();
            const appVerifier = window.recaptchaVerifier;
            const fullPhoneNumber = `+91${phone}`;
            const result = await signInWithPhoneNumber(auth, fullPhoneNumber, appVerifier);
            setConfirmationResult(result);
            setOtpSent(true);
            showNotification('OTP sent successfully!', 'success');
        } catch (error) {
            console.error("Error sending OTP:", error);
            showNotification('Failed to send OTP. Please check the number or try again.', 'error');
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        if (phone.length === 10 && !otpSent && !loading) {
            handleSendOtp();
        }
    }, [phone, otpSent, loading]);

    // Handle verifying the OTP
    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        if (!otp || otp.length !== 6) {
            showNotification('Please enter a valid 6-digit OTP.', 'error');
            setLoading(false);
            return;
        }

        try {
            await confirmationResult.confirm(otp);
            sessionStorage.setItem('studentPhone', phone);
            const q = query(collection(db, 'registrations'), where('phone', '==', phone));
            const querySnapshot = await getDocs(q);
            const redirectUrl = sessionStorage.getItem('redirectUrl');
            sessionStorage.removeItem('redirectUrl');

            if (!querySnapshot.empty) {
                const studentData = querySnapshot.docs[0].data();
                showNotification(`Welcome back, ${studentData.name}!`, 'success');
                navigate(redirectUrl || '/student-home');
            } else {
                sessionStorage.setItem('loggedInPhone', phone);
                showNotification('Welcome! Please complete your registration.', 'info');
                navigate(redirectUrl || '/');
            }
        } catch (error) {
            console.error("Error verifying OTP:", error);
            showNotification('Invalid OTP. Please try again.', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-slate-900 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            <div id="recaptcha-container"></div>
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#475569_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
            
            {/* Mobile Optimization: Reduced padding on small screens */}
            <div className="max-w-md w-full space-y-8 bg-slate-800/80 backdrop-blur-sm p-6 sm:p-10 rounded-2xl shadow-2xl border border-slate-700 relative z-10">
                <div className="text-center">
                    <div className="mx-auto bg-orange-500/10 text-orange-400 h-16 w-16 flex items-center justify-center rounded-full mb-4">
                        {otpSent ? <KeyRound size={32} /> : <Smartphone size={32} />}
                    </div>
                    {/* Mobile Optimization: Responsive text size */}
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                        {otpSent ? 'Enter OTP' : 'Student Login'}
                    </h2>
                    <p className="mt-2 text-slate-400 text-sm sm:text-base">
                        {otpSent ? `We've sent a code to +91 ${phone}` : 'Enter your phone number to continue.'}
                    </p>
                </div>
                
                {!otpSent ? (
                    <form className="mt-8 space-y-6" onSubmit={(e) => { e.preventDefault(); handleSendOtp(); }}>
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-slate-300 mb-2">Phone Number</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <span className="text-slate-400 sm:text-sm">+91</span>
                                </div>
                                <input type="tel" name="phone" id="phone" value={phone} onChange={(e) => setPhone(e.target.value)}
                                    className="focus:ring-orange-500 focus:border-orange-500 block w-full pl-14 pr-4 sm:text-sm border-slate-600 bg-slate-700/50 rounded-lg py-3 text-white placeholder-slate-400"
                                    placeholder="98765 43210" required maxLength="10" />
                            </div>
                        </div>
                        <div>
                            <button type="submit" disabled={loading}
                                className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-orange-500 disabled:opacity-50 transition-all duration-300 transform hover:scale-105">
                                {loading ? 'Sending...' : 'Send OTP'}
                            </button>
                        </div>
                    </form>
                ) : (
                    <form className="mt-8 space-y-6" onSubmit={handleVerifyOtp}>
                        <div>
                            <label htmlFor="otp" className="block text-sm font-medium text-slate-300 mb-2">6-Digit OTP</label>
                            <input type="text" name="otp" id="otp" value={otp} onChange={(e) => setOtp(e.target.value)}
                                className="focus:ring-orange-500 focus:border-orange-500 block w-full text-center tracking-[0.5em] sm:text-lg border-slate-600 bg-slate-700/50 rounded-lg py-3 text-white placeholder-slate-400"
                                placeholder="------" required maxLength="6" />
                        </div>
                        <div>
                            <button type="submit" disabled={loading}
                                className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-orange-500 disabled:opacity-50 transition-all duration-300 transform hover:scale-105">
                                {loading ? 'Verifying...' : 'Verify & Continue'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default StudentLoginPage;
