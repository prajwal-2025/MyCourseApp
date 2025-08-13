import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot } from 'firebase/firestore';

/**
 * A custom hook to fetch the list of courses from Firestore in real-time.
 * It handles loading and error states automatically.
 * @returns {{courses: Array, loading: boolean, error: string|null}}
 */
const useCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Set up the real-time listener for the 'courses' collection
    const unsubscribe = onSnapshot(collection(db, 'courses'), 
      (snapshot) => {
        // Map the documents to an array of course objects
        const coursesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setCourses(coursesData);
        setLoading(false);
      },
      (err) => {
        // Handle any errors during fetching
        console.error("Error fetching courses: ", err);
        setError("Failed to load courses. Please try again later.");
        setLoading(false);
      }
    );

    // Cleanup: Unsubscribe from the listener when the component unmounts
    // This prevents memory leaks.
    return () => unsubscribe();
  }, []); // The empty dependency array ensures this effect runs only once

  return { courses, loading, error };
};

export default useCourses;
