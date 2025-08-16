import React, { createContext, useContext, useEffect, useState } from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import CourseDetailsPage from "./pages/CourseDetailsPage";
import RegisterForm from "./pages/RegisterForm";
import ConfirmationPage from "./pages/ConfirmationPage";
import StudentLoginPage from "./pages/StudentLoginPage";
import StudentHomePage from "./pages/StudentHomePage";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminPage from "./pages/AdminPage";
import BundleRegister from "./pages/BundleRegister";
import Suggestion from "./pages/Suggestion";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import ScrollToTop from './components/ScrollToTop'; // <-- Import it

// --- Auth Context & Provider ---
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [studentData, setStudentData] = useState(null); // Added state for student data
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Firebase auth listener for admin
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            setLoading(false);
        });

        // Check for student data in sessionStorage on initial load
        try {
            const studentDataString = sessionStorage.getItem('student');
            if (studentDataString) {
                setStudentData(JSON.parse(studentDataString));
            }
        } catch (error) {
            console.error("Failed to parse student data from sessionStorage", error);
            sessionStorage.removeItem('student');
        }

        return unsubscribe;
    }, []);

    // Function for student login, updates both state and sessionStorage
    const loginStudent = (student) => {
        setStudentData(student);
        sessionStorage.setItem('student', JSON.stringify(student));
    };

    // Function for student logout
    const logoutStudent = () => {
        setStudentData(null);
        sessionStorage.removeItem('student');
    };

    const value = { 
        currentUser, 
        studentData, 
        loginStudent, 
        logoutStudent, 
        loading, 
        userId: currentUser?.uid 
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

// --- Main App Component ---
export default function App() {
    return (
        <AuthProvider>
            <ScrollToTop /> {/* Ensure ScrollToTop is included for route changes */}
            <Routes>
                <Route element={<Layout />}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/course/:id" element={<CourseDetailsPage />} />
                    <Route path="/register/:id" element={<RegisterForm />} />
                    <Route path="/confirmation" element={<ConfirmationPage />} />
                    <Route path="/student-login" element={<StudentLoginPage />} />
                    <Route path="/student-home" element={<StudentHomePage />} />
                    <Route path="/admin-login" element={<AdminLoginPage />} />
                    <Route path="/admin" element={<AdminPage />} />
                    <Route path="/bundle-register" element={<BundleRegister />} />
                    <Route path="/suggestion" element={<Suggestion />} />
                </Route>
            </Routes>
        </AuthProvider>
    );
}
