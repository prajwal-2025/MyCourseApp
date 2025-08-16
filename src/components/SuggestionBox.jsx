import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useNotification } from '../context/NotificationContext';

/**
 * A form component that allows users to submit course suggestions.
 * It handles form state, submission, and provides user feedback.
 */
const SuggestionBox = () => {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [suggestion, setSuggestion] = useState('');
  const [loading, setLoading] = useState(false);
  const { showNotification } = useNotification();

  /**
   * Handles the form submission process.
   * It validates the input, saves the data to Firestore, and shows notifications.
   * @param {React.FormEvent} e - The form submission event.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !mobile || !suggestion) {
      showNotification('Please fill in all fields.', 'error');
      return;
    }
    setLoading(true);
    try {
      await addDoc(collection(db, 'suggestions'), {
        name,
        mobile,
        suggestion,
        createdAt: serverTimestamp(),
      });
      showNotification('Thank you for your suggestion!', 'success');
      setName('');
      setMobile('');
      setSuggestion('');
    } catch (error) {
      console.error('Error adding document: ', error);
      showNotification('Failed to submit suggestion. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white py-12 sm:py-16">
      <div className="container mx-auto px-4">
        {/* Mobile Optimization: Reduced padding on smaller screens */}
        <div className="max-w-2xl mx-auto bg-gray-50 p-6 sm:p-8 rounded-xl shadow-md">
          {/* Mobile Optimization: Responsive text size */}
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-2">Have a Suggestion?</h2>
          <p className="text-center text-gray-600 mb-8">
            Didn’t see what you need? Suggest it and we’ll notify you once it’s added.
          </p>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-700 font-semibold mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Your Name"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="mobile" className="block text-gray-700 font-semibold mb-2">
                Mobile Number
              </label>
              <input
                type="tel"
                id="mobile"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Your Mobile Number"
                required
              />
            </div>
            <div className="mb-6">
              <label htmlFor="suggestion" className="block text-gray-700 font-semibold mb-2">
                Suggestion
              </label>
              <textarea
                id="suggestion"
                value={suggestion}
                onChange={(e) => setSuggestion(e.target.value)}
                rows="4"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Tell us which course you'd like to see..."
                required
              ></textarea>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Submitting...' : 'Submit Suggestion'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SuggestionBox;
