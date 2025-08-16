import React, { useState, useEffect } from 'react';

/**
 * A form for creating and editing course details.
 * It handles its own state for form inputs and communicates save/cancel actions
 * back to the parent component.
 *
 * @param {object} props - The component's props.
 * @param {function} props.onSave - Callback function to execute when the form is submitted.
 * @param {function} props.onCancel - Callback function to execute when the form is cancelled.
 * @param {object|null} props.course - The course object to edit, or null if creating a new course.
 */
export default function CourseForm({ onSave, onCancel, course }) {
  const [formData, setFormData] = useState({
    name: '',
    courseCode: '',
    description: '',
    instructor: 'PMA',
    basePrice: 0,
    earlyBirdPrice: 0,
    earlyBirdSlots: 0,
    totalSlots: 0,
    whatsappLink: '',
    thumbnail: '',
    highlights: [],
    offerText: '',
  });
  const [highlightInput, setHighlightInput] = useState('');

  // This effect pre-fills the form when a course object is passed for editing.
  // It also resets the form when the `course` prop is null (for creating a new course).
  useEffect(() => {
    if (course) {
      setFormData({
        name: course.name || '',
        courseCode: course.id || '', // Use the document ID for the courseCode
        description: course.description || '',
        instructor: course.instructor || 'PMA',
        basePrice: course.basePrice || 0,
        earlyBirdPrice: course.earlyBirdPrice || 0,
        earlyBirdSlots: course.earlyBirdSlots || 0,
        totalSlots: course.totalSlots || 0,
        whatsappLink: course.whatsappLink || '',
        thumbnail: course.thumbnail || '',
        highlights: course.highlights || [],
        offerText: course.offerText || '',
      });
    } else {
      // Reset to initial state for a new course
      setFormData({
        name: '', courseCode: '', description: '', instructor: 'PMA',
        basePrice: 0, earlyBirdPrice: 0, earlyBirdSlots: 0, totalSlots: 0,
        whatsappLink: '', thumbnail: '', highlights: [], offerText: ''
      });
    }
  }, [course]);

  // Handles changes for all form inputs.
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value, 10) || 0 : value,
    }));
  };

  // Adds a new highlight to the list.
  const handleAddHighlight = () => {
    if (highlightInput.trim()) {
      setFormData(prev => ({
        ...prev,
        highlights: [...prev.highlights, highlightInput.trim()]
      }));
      setHighlightInput(''); // Clear the input field
    }
  };

  // Removes a highlight from the list by its index.
  const handleRemoveHighlight = (index) => {
    setFormData(prev => ({
      ...prev,
      highlights: prev.highlights.filter((_, i) => i !== index)
    }));
  };

  // Prevents default form submission and calls the onSave callback with the form data.
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-slate-300">
      <h2 className="text-2xl font-bold text-white">{course ? 'Edit Course' : 'Add New Course'}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input name="name" value={formData.name} onChange={handleChange} placeholder="Course Name" className="w-full p-3 bg-slate-700/50 border-2 border-slate-600 rounded-md focus:ring-purple-500 focus:border-purple-500" required />
        <input name="courseCode" value={formData.courseCode} onChange={handleChange} placeholder="Course Code (e.g., UCM)" className="w-full p-3 bg-slate-700/50 border-2 border-slate-600 rounded-md disabled:bg-slate-800 disabled:text-slate-400" required disabled={!!course} />
      </div>
      
      <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" className="w-full h-24 p-3 bg-slate-700/50 border-2 border-slate-600 rounded-md focus:ring-purple-500 focus:border-purple-500" required />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input name="instructor" value={formData.instructor} onChange={handleChange} placeholder="Instructor Name" className="w-full p-3 bg-slate-700/50 border-2 border-slate-600 rounded-md focus:ring-purple-500 focus:border-purple-500" required />
        <input name="thumbnail" value={formData.thumbnail} onChange={handleChange} placeholder="Thumbnail Image URL" className="w-full p-3 bg-slate-700/50 border-2 border-slate-600 rounded-md focus:ring-purple-500 focus:border-purple-500" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Base Price (₹)</label>
          <input name="basePrice" type="number" value={formData.basePrice} onChange={handleChange} placeholder="1999" className="w-full p-3 bg-slate-700/50 border-2 border-slate-600 rounded-md" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Early Bird Price (₹)</label>
          <input name="earlyBirdPrice" type="number" value={formData.earlyBirdPrice} onChange={handleChange} placeholder="1499" className="w-full p-3 bg-slate-700/50 border-2 border-slate-600 rounded-md" required />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Early Bird Slots</label>
          <input name="earlyBirdSlots" type="number" value={formData.earlyBirdSlots} onChange={handleChange} placeholder="10" className="w-full p-3 bg-slate-700/50 border-2 border-slate-600 rounded-md" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Total Slots</label>
          <input name="totalSlots" type="number" value={formData.totalSlots} onChange={handleChange} placeholder="50" className="w-full p-3 bg-slate-700/50 border-2 border-slate-600 rounded-md" required />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">WhatsApp Group Link</label>
        <input name="whatsappLink" value={formData.whatsappLink} onChange={handleChange} placeholder="https://chat.whatsapp.com/..." className="w-full p-3 bg-slate-700/50 border-2 border-slate-600 rounded-md" />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Offer Text (Optional)</label>
        <input name="offerText" value={formData.offerText} onChange={handleChange} placeholder="e.g., Limited Time!" className="w-full p-3 bg-slate-700/50 border-2 border-slate-600 rounded-md" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Course Highlights</label>
        <div className="flex gap-2">
          <input 
            type="text"
            value={highlightInput}
            onChange={(e) => setHighlightInput(e.target.value)}
            placeholder="Add a learning point"
            className="flex-grow p-3 bg-slate-700/50 border-2 border-slate-600 rounded-md"
          />
          <button type="button" onClick={handleAddHighlight} className="px-4 py-2 rounded-md font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition">Add</button>
        </div>
        <ul className="mt-3 space-y-2">
          {formData.highlights.map((h, i) => (
            <li key={i} className="flex justify-between items-center bg-slate-700 p-2 rounded-md">
              <span>{h}</span>
              <button type="button" onClick={() => handleRemoveHighlight(i)} className="text-red-400 hover:text-red-300">✕</button>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="flex justify-end gap-4 pt-4">
        <button type="button" onClick={onCancel} className="px-4 py-2 rounded-md font-semibold bg-slate-600 hover:bg-slate-500 text-white transition">
          Cancel
        </button>
        <button type="submit" className="px-4 py-2 rounded-md font-semibold bg-purple-600 hover:bg-purple-500 text-white transition">
          Save Course
        </button>
      </div>
    </form>
  );
}
