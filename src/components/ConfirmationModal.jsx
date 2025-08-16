import React from 'react';
import Modal from './Modal'; // We use the base Modal component

/**
 * A specialized modal for confirming user actions.
 * It displays a title, a message, and cancel/confirm buttons.
 *
 * @param {object} props - The component's props.
 * @param {boolean} props.isOpen - Controls whether the modal is visible.
 * @param {function} props.onClose - Function to call when the cancel button or backdrop is clicked.
 * @param {function} props.onConfirm - Function to call when the confirm button is clicked.
 * @param {string} props.title - The title of the confirmation dialog.
 * @param {string} props.message - The descriptive message for the confirmation.
 */
export default function ConfirmationModal({ isOpen, onClose, onConfirm, title, message }) {
  // We don't render anything if the modal is not open
  if (!isOpen) {
    return null;
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      {/* Modal Content */}
      <div className="text-white">
        <h3 className="text-lg font-bold">{title}</h3>
        <p className="text-slate-400 mt-2 text-sm">{message}</p>
        
        {/* Action Buttons */}
        {/* Mobile Optimization: Buttons stack on small screens */}
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 mt-6">
          <button 
            onClick={onClose} 
            className="w-full sm:w-auto px-4 py-2 rounded-md text-sm font-semibold bg-slate-600 hover:bg-slate-500 text-white transition"
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm} 
            className="w-full sm:w-auto px-4 py-2 rounded-md text-sm font-semibold bg-orange-600 hover:bg-orange-500 text-white transition"
          >
            Confirm
          </button>
        </div>
      </div>
    </Modal>
  );
}
