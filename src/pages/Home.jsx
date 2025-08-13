import React from 'react';
import CourseCard from '../components/CourseCard.jsx'; // Corrected path
import useCourses from '../hooks/useCourses.js';

const Home = () => {
  // Use the hook to get courses, loading state, and error state
  const { courses, loading, error } = useCourses();

  const renderContent = () => {
    // 1. Show a loading message while fetching data
    if (loading) {
      return <p className="text-center text-gray-500 mt-10">Loading available courses...</p>;
    }

    // 2. Show an error message if something went wrong
    if (error) {
      return <p className="text-center text-red-500 mt-10">Error: {error}</p>;
    }

    // 3. Show a message if there are no courses in the database
    if (courses.length === 0) {
      return <p className="text-center text-gray-500 mt-10">No courses are available at the moment. Please check back later.</p>;
    }

    // 4. If everything is fine, display the list of courses
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses.map(course => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-brand-dark tracking-tight">Our Courses</h1>
        <p className="mt-4 text-lg text-gray-600">Explore our range of expert-led courses designed for the mining industry.</p>
      </div>
      {renderContent()}
    </div>
  );
};

export default Home;
