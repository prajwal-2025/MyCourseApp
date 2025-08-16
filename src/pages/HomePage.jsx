import React, {useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { BookOpen, Target, Award, Zap } from 'lucide-react';

// --- Import Firebase and Child Components ---
import { db } from '../firebase';
import CourseCard from '../components/CourseCard';
import SuggestionBox from '../components/SuggestionBox';

/**
 * A reusable component to display a feature with an icon, title, and description.
 */
const Feature = ({ icon, title, children, iconBgClass }) => (
  <div className="
    p-6 md:p-8 
    bg-white
    rounded-xl 
    shadow-lg 
    hover:shadow-2xl 
    hover:-translate-y-2 
    transition-all 
    duration-300 
    cursor-pointer
    text-center
    h-full flex flex-col
  ">
    <div className={`p-4 rounded-full inline-block mb-4 mx-auto ${iconBgClass}`}>
      {icon}
    </div>
    <h3 className="text-xl font-bold text-slate-800 mb-2">
      {title}
    </h3>
    <p className="text-slate-600">
      {children}
    </p>
  </div>
);

// SVG component for the Indian Flag to ensure consistent rendering
const IndianFlagIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 28 20"
    // Mobile optimization: Use Tailwind classes for responsive sizing
    className="inline-block ml-2 shadow-sm rounded-sm w-6 h-auto sm:w-7"
  >
    <rect width="28" height="20" fill="#fff" />
    <rect width="28" height="6.67" fill="#FF9933" />
    <rect y="13.33" width="28" height="6.67" fill="#138808" />
    <circle cx="14" cy="10" r="2.3" fill="none" stroke="#000080" strokeWidth="1" />
    {Array.from({ length: 24 }).map((_, i) => (
      <line
        key={i}
        x1="14"
        y1="10"
        x2={14 + 2.3 * Math.cos((i * 15 * Math.PI) / 180)}
        y2={10 + 2.3 * Math.sin((i * 15 * Math.PI) / 180)}
        stroke="#000080"
        strokeWidth="0.5"
      />
    ))}
  </svg>
);


/**
 * The main homepage component for the application.
 */
export default function HomePage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Effect to fetch the list of courses from Firestore when the component mounts.
  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, 'courses'));
        const coursesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setCourses(coursesData);
      } catch (error) {
        console.error("Error fetching courses: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  return (
  <div className="bg-gray-50">
    {/* Hero Section */}
    {/* Mobile optimization: Reduced vertical padding on smaller screens */}
    <section className="relative text-center py-16 sm:py-24 md:py-32 px-4 bg-white">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
      <div className="relative z-10 container mx-auto">
        {/* Mobile optimization: Responsive heading sizes are already applied */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tighter mb-4">
          Mining Diploma Courses ⛏️📘
        </h1>
        {/* Mobile optimization: Responsive text sizes are already applied */}
        <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Live + Recorded Classes, Concise Notes, Solved Papers and 24/7 Doubt Support — Designed Specially for MSBTE
        </p>
      </div>
    </section>

    {/* Features Section */}
    {/* Mobile optimization: Reduced vertical padding on smaller screens */}
    <section className="py-16 md:py-20 bg-gray-100">
      <div className="container mx-auto px-4">
        {/* Mobile optimization: This grid correctly stacks on mobile (grid-cols-1) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Feature icon={<Target size={32} className="text-orange-600"/>} title="Learn Anytime, Anywhere 📱🌏" iconBgClass="bg-orange-100">
                Access recorded lectures and notes 24/7 from your phone or laptop..
            </Feature>
            <Feature icon={<Award size={32} className="text-gray-700"/>} title="Guaranteed Results 🏆✅" iconBgClass="bg-white border-2 border-gray-200">
                We're confident in our methods. Follow our path and see guaranteed results.
            </Feature>
            <Feature icon={<BookOpen size={32} className="text-green-700"/>} title="Expert-Led Content 👷‍♂️📚" iconBgClass="bg-green-100">
                Learn from seasoned professionals with real-world mining experience.
            </Feature>
        </div>
      </div>
    </section>
  
      {/* Available Courses Section */}
      <section id="courses" className="container mx-auto px-4 py-16 sm:py-20">
        {/* Mobile optimization: Responsive heading sizes are already applied */}
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-800 mb-10">Available Courses</h2>
        {loading ? (
          <div className="text-center text-gray-600">Loading courses...</div>
        ) : (
          // Mobile optimization: This grid correctly stacks on mobile and expands on larger screens
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.length > 0 ? (
              courses.map(course => (
                <CourseCard key={course.id} course={course} />
              ))
            ) : (
              <div className="md:col-span-3 text-center text-gray-600">
                No courses are available at this time.
              </div>
            )}
          </div>
        )}
      </section>

      {/* Suggestion Box Section */}
      <SuggestionBox />
    </div>
  );
};
