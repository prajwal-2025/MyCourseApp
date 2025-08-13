import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase.js';
import { doc, deleteDoc } from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import CourseForm from '../components/CourseForm.jsx';
import Modal from '../components/Modal.jsx';
import { useNotification } from '../context/NotificationContext.jsx';
import useCourses from '../hooks/useCourses.js';

const Admin = () => {
  const [user, setUser] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [courseToEdit, setCourseToEdit] = useState(null);
  // 1. State to manage the delete confirmation modal
  const [courseToDelete, setCourseToDelete] = useState(null); 
  
  const navigate = useNavigate();
  const { addNotification } = useNotification();
  const { courses, loading, error } = useCourses();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        navigate('/login');
      } else {
        setUser(currentUser);
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleEdit = (course) => {
    setCourseToEdit(course);
    setIsEditModalOpen(true);
  };

  // 2. This function now just opens the confirmation modal
  const handleDeleteClick = (id) => {
    setCourseToDelete(id);
  };

  // 3. The actual deletion logic is in its own function
  const confirmDelete = async () => {
    if (!courseToDelete) return;
    try {
      await deleteDoc(doc(db, 'courses', courseToDelete));
      addNotification('Course deleted successfully!', 'success');
    } catch (error) {
      console.error('Error deleting course: ', error);
      addNotification('Error deleting course.', 'error');
    } finally {
      setCourseToDelete(null); // Close the modal
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      // The navigate call ensures a smooth, client-side redirect
      navigate('/login');
    } catch (error) {
      console.error('Logout Error:', error);
    }
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setCourseToEdit(null);
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Logout
        </button>
      </div>

      <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Add New Course</h2>
        <CourseForm />
      </div>

      <h2 className="text-2xl font-semibold mb-4">Manage Courses</h2>
      
      {loading && <p>Loading courses...</p>}
      {error && <p className="text-red-500">{error}</p>}
      
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div key={course.id} className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-xl font-bold">{course.name}</h3>
              <p className="text-gray-600 truncate">{course.description}</p>
              <div className="mt-4 flex justify-end space-x-2">
                <button
                  onClick={() => handleEdit(course)}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteClick(course.id)} // 4. Updated onClick handler
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for Editing */}
      {isEditModalOpen && (
        <Modal onClose={closeEditModal}>
          <CourseForm courseToEdit={courseToEdit} onFormSubmit={closeEditModal} />
        </Modal>
      )}

      {/* 5. Modal for Delete Confirmation */}
      {courseToDelete && (
        <Modal onClose={() => setCourseToDelete(null)}>
          <div className="p-4">
            <h3 className="text-xl font-bold mb-4">Are you sure?</h3>
            <p className="mb-6">This action cannot be undone. Do you really want to delete this course?</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setCourseToDelete(null)}
                className="py-2 px-4 bg-gray-200 hover:bg-gray-300 rounded font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded font-semibold"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Admin;
