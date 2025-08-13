import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { auth, db } from './firebase'; // Make sure to import your firebase config
import { doc, getDoc } from 'firebase/firestore';

// This component will wrap your admin and student routes
const ProtectedRoute = ({ children, requiredRole }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setIsAuthenticated(true);
        // Check for admin role
        if (requiredRole === 'admin') {
            // In your system, an admin is just a user who can log in via the main /login.
            // We can assume if they are logged in and trying to access an admin route, they are an admin.
            // A more robust system might check a 'roles' field in a 'users' collection.
            setUserRole('admin');
        } else if (requiredRole === 'student') {
            // For students, we check if their data exists in the 'students' collection
            const studentRef = doc(db, 'students', user.uid);
            const studentSnap = await getDoc(studentRef);
            if (studentSnap.exists()) {
                setUserRole('student');
            }
        }
      } else {
        setIsAuthenticated(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [requiredRole]);

  if (loading) {
    return <div>Loading...</div>; // Or a spinner component
  }

  if (!isAuthenticated) {
    // If not logged in, redirect to the appropriate login page
    const loginPath = requiredRole === 'admin' ? '/login' : '/student-login';
    return <Navigate to={loginPath} />;
  }

  if (requiredRole && userRole !== requiredRole) {
    // If logged in but has the wrong role, redirect to home or a login page
    return <Navigate to="/" />;
  }

  return children; // If authenticated and has the correct role, render the component
};

export default ProtectedRoute;
