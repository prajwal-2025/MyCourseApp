import React from 'react';

/**
 * A reusable component to display a feature with an icon, title, and description.
 * This version includes enhanced styling and support for custom icon backgrounds.
 *
 * @param {object} props - The component's props.
 * @param {React.ReactNode} props.icon - The icon element to display (e.g., from lucide-react).
 * @param {string} props.title - The title of the feature.
 * @param {React.ReactNode} props.children - The descriptive text for the feature.
 * @param {string} props.iconBgClass - The Tailwind CSS classes for the icon's background.
 */
export default function Feature({ icon, title, children, iconBgClass }) {
  return (
    <div className="
      p-6 md:p-8 
      bg-white
      rounded-xl 
      shadow-lg 
      hover:shadow-2xl 
      hover:-translate-y-2 
      transition-all 
      duration-300 
      cursor-pointer
      text-center
      h-full 
      flex 
      flex-col
    ">
      <div className={`p-4 rounded-full inline-block mb-4 mx-auto ${iconBgClass}`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-800 mb-2">
        {title}
      </h3>
      <p className="text-slate-600">
        {children}
      </p>
    </div>
  );
}
