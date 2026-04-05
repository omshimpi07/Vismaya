import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from "../firebase";
import { logOutUser, fetchUserData } from '../firebaseHelpers';
import { Venus, Briefcase, Menu, X } from 'lucide-react';

const Navbar = () => {
  const [user] = useAuthState(auth);
  const [userData, setUserData] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUserData = async () => {
      if (user) {
        const data = await fetchUserData(user.uid);
        setUserData(data);
      }
    };
    if (user) {
      loadUserData();
    }
  }, [user]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await logOutUser();
    navigate('/');
  };

  const sendEmergencyMessage = async () => {
    const message = "I'm not feeling safe right now , I Think I'm In Danger , can you Please call me?";
    const contacts = userData.contacts;
  
    // Get current location using Geolocation API
    navigator.geolocation.getCurrentPosition(async (position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      const locationMessage = `My Current location: https://www.google.com/maps?q=${latitude},${longitude}`;
      const fullMessage = `${message} ${locationMessage}`;
  
      // Send message with location to each contact
      contacts.forEach((contact) => {
        const url = `http://api.textmebot.com/send.php?recipient=${contact}&apikey=oNJFHzWNvPX6&text=${encodeURIComponent(fullMessage)}`;
        fetch(url);
      });
    }, (error) => {
      console.error('Error getting location:', error);
      // Optionally, you can handle the case where location is not accessible
    });
  };
  

  const getAvatarSeed = () => {
    if (user?.displayName) return user.displayName;
    if (user?.email) return user.email.split('@')[0];
    return 'User';
  };

  const NavItem = ({ to, children }) => (
    <Link
      to={to}
      className="text-gray-700 hover:text-pink-500 font-medium transition-all duration-200"
      onClick={() => setIsMenuOpen(false)}
    >
      {children}
    </Link>
  );

  const handleLoginClick = () => {
    navigate("/login");
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md py-3' : 'bg-transparent py-5'}`}>
      <div className="w-full flex justify-between items-center px-4 md:px-6">
        {/* Left Logo */}
        <div className=" text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-600">
          Vismaya
        </div>

        {/* Right Nav */}
        <div className="hidden md:flex items-center space-x-8">
          {user ? (
            <>
              <NavItem to="/Health">Health Hub</NavItem>
              <NavItem to="/Safety">Safety Tools</NavItem>
              <NavItem to="/chat">Community Connect</NavItem>
              <button
                onClick={sendEmergencyMessage}
                className="bg-red-500 text-white font-medium rounded-full px-6 py-2 shadow-lg"
              >
                Emergency
              </button>
              <div className="relative" ref={dropdownRef}>
                <img
                  src={userData?.photoURL || `https://api.dicebear.com/6.x/initials/svg?seed=${getAvatarSeed()}`}
                  alt="Profile"
                  className="w-9 h-9 rounded-full object-cover border-2 border-pink-400 cursor-pointer shadow"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                />
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 bg-white rounded-lg shadow-lg py-2 w-44 z-50 border border-gray-100">
                    <button
                      onClick={() => {
                        navigate('/dashboard');
                        setDropdownOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      View Dashboard
                    </button>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <button
              onClick={handleLoginClick}
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-90 text-white font-medium rounded-full px-6 py-2 shadow-lg hover:shadow-xl transition-all"
            >
              <div className="flex items-center gap-2">
                <Venus className="h-4 w-4" />
                Login
              </div>
            </button>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-gray-700"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg p-4 absolute top-full left-0 w-full">
          <div className="flex flex-col space-y-4">
            {user ? (
              <>
                <NavItem to="/Health">Health Hub</NavItem>
                <NavItem to="/Safety">Safety Tools</NavItem>
                <NavItem to="/chat">Community Connect</NavItem>
                <button
                  onClick={sendEmergencyMessage}
                  className="bg-red-500 text-white font-medium rounded-full px-6 py-2 shadow-lg"
                >
                  Emergency
                </button>
                <button
                  onClick={handleLogout}
                  className="text-left text-red-600 hover:bg-red-50 px-4 py-2 rounded-md transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={handleLoginClick}
                className="bg-gradient-to-r from-pink-500 to-purple-600 text-white font-medium rounded-full px-6 py-2 w-full"
              >
                Get Started
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
