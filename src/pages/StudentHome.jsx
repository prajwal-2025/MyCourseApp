import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase.js';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import CourseCard from '../components/CourseCard.jsx';
import useCourses from '../hooks/useCourses.js'; // 1. Import the custom hook

const StudentHome = () => {
  const [student, setStudent] = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loadingStudent, setLoadingStudent] = useState(true);

  // 2. Use the hook for the list of all available courses
  const { courses, loading: loadingCourses, error: errorCourses } = useCourses();

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const studentRef = doc(db, 'students', user.uid);
          const studentSnap = await getDoc(studentRef);
          if (studentSnap.exists()) {
            const studentData = { id: studentSnap.id, ...studentSnap.data() };
            setStudent(studentData);
            setEnrolledCourses(studentData.courses || []);
          }
        } catch (error) {
          console.error("Error fetching student data:", error);
        } finally {
          setLoadingStudent(false);
        }
      } else {
        setLoadingStudent(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  // Filter out the courses the student is already enrolled in
  const availableCourses = courses.filter(course => !enrolledCourses.includes(course.id));

  if (loadingStudent) {
    return <div className="text-center mt-10">Loading your profile...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      {student ? (
        <>
          <h1 className="text-3xl font-bold mb-2">Welcome, {student.name}!</h1>
          <p className="text-lg text-gray-600 mb-8">Your student ID is: {student.id}</p>

          <div className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">Your Enrolled Courses</h2>
            {enrolledCourses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses
                  .filter(course => enrolledCourses.includes(course.id))
                  .map(course => (
                    <CourseCard key={course.id} course={course} />
                  ))}
              </div>
            ) : (
              <p>You are not enrolled in any courses yet.</p>
            )}
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">Available Courses to Enroll</h2>
            {/* 3. Handle loading and error for the available courses list */}
            {loadingCourses && <p>Loading available courses...</p>}
            {errorCourses && <p className="text-red-500">{errorCourses}</p>}
            {!loadingCourses && !errorCourses && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {availableCourses.map(course => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="text-center">
          <p>Could not load student profile. Please log in.</p>
          <Link to="/student-login" className="text-blue-500 hover:underline">Go to Login</Link>
        </div>
      )}
    </div>
  );
};

export default StudentHome;
