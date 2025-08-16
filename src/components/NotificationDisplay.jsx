import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotification } from '../context/NotificationContext';

/**
 * A component that displays global notifications (e.g., success or error messages).
 * It listens to the NotificationContext and displays a message when one is available.
 */
export default function NotificationDisplay() {
  const { notification } = useNotification();

  // Determine the background color based on the notification type.
  // Independence Day Theme Start
  const bgColor = notification.type === 'success' 
    ? 'bg-orange-600' // Changed from green to orange
    : notification.type === 'error' 
    ? 'bg-red-600' 
    : 'bg-blue-500';
  // Independence Day Theme End

  return (
    // This container positions the notification at the top-right of the screen.
    <div className="fixed top-5 right-5 z-[100]">
      <AnimatePresence>
        {/* The notification is only rendered when `notification.show` is true. */}
        {notification.show && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 50, scale: 0.9 }}
            className={`p-4 rounded-lg text-white shadow-lg ${bgColor}`}
          >
            {notification.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
