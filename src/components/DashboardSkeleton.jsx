import React from 'react';

/**
 * A skeleton loading component that mimics the layout of the dashboard pages.
 * It provides a visual placeholder while data is being fetched from the server,
 * improving the perceived performance and user experience.
 */
const DashboardSkeleton = () => (
    <div className="bg-slate-900 min-h-screen text-white animate-pulse">
        {/* Mobile Optimization: Reduced padding on smaller screens */}
        <div className="max-w-5xl mx-auto py-8 px-4 pt-20 sm:pt-28">
            {/* Mobile Optimization: Responsive width for the title placeholder */}
            <div className="h-8 bg-slate-700 rounded w-3/4 max-w-xs mb-6"></div>
            
            <div className="space-y-5">
                {[...Array(2)].map((_, i) => (
                    // Mobile Optimization: Reduced padding on smaller screens
                    <div key={i} className="bg-slate-800/50 border border-slate-700 p-4 sm:p-5 rounded-xl">
                        <div className="flex justify-between items-center">
                            <div className="h-6 bg-slate-700 rounded w-1/2"></div>
                            {/* Mobile Optimization: Responsive width for the status badge */}
                            <div className="h-7 bg-slate-700 rounded-full w-20 sm:w-24"></div>
                        </div>
                        <div className="mt-4 border-t border-slate-700 pt-4">
                            <div className="h-4 bg-slate-700 rounded w-3/4 mb-3"></div>
                            {/* Mobile Optimization: Responsive width for the button */}
                            <div className="h-10 bg-slate-700 rounded-lg w-36 sm:w-48"></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

export default DashboardSkeleton;
