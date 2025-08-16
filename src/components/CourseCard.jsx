import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap } from 'lucide-react'; // Import Zap icon

/**
 * A card component to display a summary of a course on the homepage.
 *
 * @param {object} props - The component's props.
 * @param {object} props.course - The course object containing details to display.
 */
const CourseCard = ({ course }) => {
  const navigate = useNavigate();

  // Navigates to the detailed page for the specific course.
  const handleRegisterClick = () => {
    navigate(`/course/${course.id}`);
  };

  // Independence Day Theme: Use specialOfferPrice if available, otherwise fall back to earlyBirdPrice
  const currentPrice = course.specialOfferPrice || course.earlyBirdPrice;

  // Calculates the discount percentage based on the base and current prices.
  const discount = course.basePrice && currentPrice
    ? Math.round(((course.basePrice - currentPrice) / course.basePrice) * 100)
    : 0;

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl overflow-hidden transform hover:-translate-y-2 transition-all duration-300 flex flex-col h-full border border-gray-200">
      <div className="relative">
        <img
          className="w-full h-48 object-cover"
          src={course.thumbnail || 'https://placehold.co/600x400/E2E8F0/4A5568?text=PMA+Course'}
          alt={course.name}
          onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/600x400/E2E8F0/4A5568?text=Image+Not+Found'; }}
        />
        {discount > 0 && (
          <div className="absolute top-0 right-0 m-3 sm:m-4 bg-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
             <Zap size={14}/> Special Offer
          </div>
        )}
      </div>
      {/* Mobile Optimization: Reduced padding */}
      <div className="p-4 sm:p-6 flex flex-col flex-grow">
        {/* Mobile Optimization: Responsive text size */}
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">{course.name}</h3>
        <p className="text-gray-600 mb-4 flex-grow text-sm leading-relaxed">{course.shortDescription || course.description.substring(0, 100) + '...'}</p>
        
        <div className="mt-auto pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-baseline space-x-2">
                {/* Mobile Optimization: Responsive text size */}
                <p className="text-xl sm:text-2xl font-bold text-orange-600">
                  ₹{currentPrice}
                </p>
                <p className="text-sm sm:text-md text-gray-400 line-through">
                  ₹{course.basePrice}
                </p>
              </div>
              {course.offerText && (
                <span className="text-xs font-bold text-red-600 bg-red-100 px-2.5 py-1 rounded-full">
                  {course.offerText}
                </span>
              )}
            </div>

            <button
              onClick={handleRegisterClick}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 sm:py-3 px-4 rounded-lg transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 shadow-md"
            >
              View Details
            </button>

            <p className="text-center text-xs text-gray-500 mt-3">
              You can book your seat for just <span className="font-bold text-orange-600">₹99</span>
            </p>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
