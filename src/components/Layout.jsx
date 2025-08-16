import React, { useState } from 'react';
import { Outlet, Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { signOut } from 'firebase/auth';

// --- Import Context, Firebase, and Components ---
import { auth } from '../firebase';
import { useAuth } from '../App'; // The auth context from App.jsx
import NotificationDisplay from './NotificationDisplay';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { currentUser } = useAuth(); // Get user state from context

  const handleLogout = () => {
    signOut(auth).then(() => {
      navigate('/'); // Redirect to home after logout
    });
  };

  // Independence Day Theme Start
  const navLinkClasses = "text-gray-600 transition duration-150 ease-in-out hover:text-orange-600 hover:bg-orange-50 px-3 py-2 rounded-md text-base font-medium";
  const activeLinkClasses = "text-orange-600 bg-orange-100 font-semibold";
  // Independence Day Theme End

  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-200">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center space-x-2 sm:space-x-3">
              {/* Updated Logo URL */}
              <img className="h-12 sm:h-14 w-auto" src="https://firebasestorage.googleapis.com/v0/b/courseapp-8b8f2.firebasestorage.app/o/logo-homepage.png?alt=media&token=a97ba0f6-79e0-4a83-a349-0b2245f8b833" alt="PMA-Logo" />
              {/* Mobile Optimization: Made text smaller on mobile instead of hiding */}
              <span className="text-base sm:text-xl font-bold text-gray-800 tracking-tight">Pathan Mining Academy</span>
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-2">
              <NavLink to="/" className={({isActive}) => `${navLinkClasses} ${isActive ? activeLinkClasses : ''}`}>Home</NavLink>
              {currentUser ? (
                <>
                  <NavLink to="/student-home" className={({isActive}) => `${navLinkClasses} ${isActive ? activeLinkClasses : ''}`}>Dashboard</NavLink>
                  <button onClick={handleLogout} className="bg-red-500 shadow-sm hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">Log Out</button>
                </>
              ) : (
                <>
                  {/* Independence Day Theme Start */}
                  <Link to="/student-login" className="bg-orange-500 shadow-sm hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">Student Login</Link>
                  <Link to="/admin-login" className="bg-green-600 shadow-sm hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">Admin Login</Link>
                  {/* Independence Day Theme End */}
                </>
              )}
            </div>
          </div>
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-700 focus:outline-none">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>
      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <NavLink to="/" onClick={() => setIsOpen(false)} className={({isActive}) => `block ${navLinkClasses} ${isActive ? activeLinkClasses : ''}`}>Home</NavLink>
              {currentUser ? (
                <>
                  <NavLink to="/student-home" onClick={() => setIsOpen(false)} className={({isActive}) => `block ${navLinkClasses} ${isActive ? activeLinkClasses : ''}`}>Dashboard</NavLink>
                  <button onClick={() => { handleLogout(); setIsOpen(false); }} className="w-full text-left block bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-md text-base font-medium">Log Out</button>
                </>
              ) : (
                <>
                  {/* Independence Day Theme Start */}
                  <Link to="/student-login" onClick={() => setIsOpen(false)} className="block bg-orange-500 text-center hover:bg-orange-600 text-white px-3 py-2 rounded-md text-base font-medium">Student Login</Link>
                  <Link to="/admin-login" onClick={() => setIsOpen(false)} className="block bg-green-600 text-center hover:bg-green-700 text-white px-3 py-2 rounded-md text-base font-medium">Admin Login</Link>
                  {/* Independence Day Theme End */}
                </>
              )}
          </div>
        </div>
      )}
    </header>
  );
};

const Footer = () => (
    // Independence Day Theme Start
    <footer className="bg-gray-800 text-white border-t-4 border-orange-500">
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
        <div>
          <h3 className="text-lg font-semibold text-orange-400">Pathan Mining Academy</h3>
          <p className="mt-2 text-gray-400">Your partner in achieving excellence in the mining industry.</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-orange-400">Contact Us</h3>
          <a 
            href="https://maps.app.goo.gl/voQxkVqGUw5dMWZA7" 
            target="_blank" 
            rel="noopener noreferrer"
            className="mt-2 text-gray-400 hover:text-orange-400 transition-colors block"
          >
            Address: Behind Bank of Baroda, Gandhi Chowk, Chandrapur, Maharashtra-442403
          </a>
          <a 
            href="mailto:pathanminingacademy@gmail.com" 
            className="text-gray-400 hover:text-orange-400 transition-colors block"
          >
            Email: pathanminingacademy@gmail.com
          </a>
          <p className="text-gray-400">
            Phone: +91 89289 64320, 07172-450 128
          </p> 
        </div>
        <div>
          <h3 className="text-lg font-semibold text-orange-400">Quick Links</h3>
          <ul className="mt-2 space-y-1">
            <li><Link to="/" className="text-gray-400 hover:text-orange-400">Home</Link></li>
            <li><Link to="/Student-login" className="text-gray-400 hover:text-orange-400">Student Login</Link></li>
            <li><Link to="/admin-login" className="text-gray-400 hover:text-orange-400">Admin Login</Link></li>
          </ul>
        </div>
      </div>
      <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-500">
        <p>&copy; {new Date().getFullYear()} Pathan Mining Academy. All Rights Reserved.</p>
      </div>
    </div>
  </footer>
  // Independence Day Theme End
);

/**
 * The main layout component for the application.
 * It includes the Header, Footer, and a NotificationDisplay area.
 * The <Outlet> component renders the content of the current route.
 */
const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 font-sans">
      <Header />
      <NotificationDisplay />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
