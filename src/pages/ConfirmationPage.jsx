import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowRight } from 'lucide-react';

/**
 * A confirmation page shown to the user after they successfully submit their registration form.
 */
const ConfirmationPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-[80vh] flex items-center justify-center bg-slate-900 py-12 px-4 sm:px-6 lg:px-8">
            {/* Independence Day Theme Start */}
            <div className="max-w-md w-full text-center bg-slate-800/50 bg-gradient-to-br from-slate-800 to-orange-900/30 p-10 rounded-xl shadow-2xl border border-orange-500/30">
            {/* Independence Day Theme End */}
                <CheckCircle className="mx-auto h-16 w-16 text-green-400" />
                <h2 className="mt-6 text-3xl font-extrabold text-white">
                    Registration Submitted!
                </h2>
                <p className="mt-4 text-md text-slate-400">
                    Thank you! We've received your details and your registration is now pending review. You will be notified by our team upon confirmation.
                </p>
                <div className="mt-8">
                    {/* Independence Day Theme Start */}
                    <button
                        // This button now navigates the user to their personal dashboard.
                        onClick={() => navigate('/student-home')}
                        className="group relative w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-orange-500 transition-all transform hover:scale-105"
                    >
                        <span>Go to Your Dashboard</span>
                        <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                    </button>
                    {/* Independence Day Theme End */}
                </div>
            </div>
        </div>
    );
};

export default ConfirmationPage;
