import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Corrected paths for components and pages
import Layout from './components/Layout.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Admin from './pages/Admin.jsx';
import StudentLogin from './pages/StudentLogin.jsx';
import StudentHome from './pages/StudentHome.jsx';
import CourseDetail from './pages/CourseDetail.jsx';
import RegisterForm from './pages/RegisterForm.jsx';
import BundleRegister from './pages/BundleRegister.jsx';
import Confirmation from './pages/Confirmation.jsx';
import ProtectedRoute from './ProtectedRoute.jsx'; // Assuming this is in src/

function App() {
  return (
    <Layout>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/student-login" element={<StudentLogin />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/course/:id" element={<CourseDetail />} />
        <Route path="/confirmation" element={<Confirmation />} />
        
        {/* Admin Protected Route */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute requiredRole="admin">
              <Admin />
            </ProtectedRoute>
          } 
        />

        {/* Student Protected Routes */}
        <Route 
          path="/student-home" 
          element={
            <ProtectedRoute requiredRole="student">
              <StudentHome />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/bundle-register" 
          element={
            <ProtectedRoute requiredRole="student">
              <BundleRegister />
            </ProtectedRoute>
          } 
        />

        {/* Catch-all Route */}
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </Layout>
  );
}

export default App;
