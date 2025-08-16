// src/components/Modal.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * A reusable, animated modal component.
 * It provides a backdrop and a container for content that appears over the main page.
 *
 * @param {object} props - The component's props.
 * @param {boolean} props.isOpen - Controls whether the modal is visible.
 * @param {function} props.onClose - Function to call when the modal should be closed.
 * @param {React.ReactNode} props.children - The content to display inside the modal.
 */
export default function Modal({ isOpen, onClose, children }) {
  return (
    <AnimatePresence>
      {/* We only render the modal if the isOpen prop is true */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          // Clicking the backdrop will close the modal
          onClick={onClose}
        >
          {/* This is the actual modal content window */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            // Mobile Optimization: Reduced padding on small screens
            className="bg-slate-800 bg-gradient-to-tr from-slate-800 via-slate-800 to-orange-900/40 border border-orange-500/30 rounded-xl p-4 sm:p-6 w-full max-w-lg shadow-2xl"
            // Stop click events from bubbling up to the backdrop, which would close the modal
            onClick={(e) => e.stopPropagation()}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
