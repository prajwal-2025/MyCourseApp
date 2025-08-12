// src/components/CourseCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function CourseCard({ course }) {
    return (
        <motion.div
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            className="bg-slate-800/50 border border-slate-700 rounded-2xl overflow-hidden shadow-lg hover:shadow-purple-400/20 transition-all duration-300 group flex flex-col"
        >
            <div className="overflow-hidden">
                <img 
                    src={course.thumbnail || `https://placehold.co/600x400/1e1b4b/ffffff?text=${course.courseCode}`} 
                    alt={course.name} 
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
            </div>
            <div className="p-5 flex flex-col flex-grow">
                <h3 className="text-lg font-bold text-slate-100 mb-2 truncate">{course.name}</h3>
                <p className="text-sm text-slate-400 mb-4 flex-grow">By {course.instructor || 'PMA'}</p>
                <div className="flex justify-between items-center mt-auto">
                    <span className="text-2xl font-extrabold text-white">₹{course.earlyBirdPrice}</span>
                    <Link to={`/course/${course.id}`} className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-purple-700 transition-colors">
                        View Details
                    </Link>
                </div>
            </div>
        </motion.div>
    );
}
