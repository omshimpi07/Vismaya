import React, { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { fetchUserData } from '../firebaseHelpers';

import Navbar from './Navbar';

const auth = getAuth();

const Dashboard = () => {
  const [user, loading] = useAuthState(auth);
  const [userData, setUserData] = useState(null);
  const [location, setLocation] = useState(null); // For storing live location

  useEffect(() => {
    const loadUserData = async () => {
      if (user) {
        const data = await fetchUserData(user.uid);
        setUserData(data);
      }
    };
    if (!loading) loadUserData();
  }, [user, loading]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }, []);

  if (loading || !user) {
    return <div className="min-h-screen flex items-center justify-center bg-pink-50">Loading your dashboard...</div>;
  }

  if (!userData) {
    return <div className="min-h-screen flex items-center justify-center bg-pink-50">No user data found.</div>;
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen mt-16 bg-pink-50 py-10 px-6 sm:px-12 lg:px-24">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-lg space-y-6">
          {/* Profile Section */}
          <div className="flex flex-col items-center gap-6 sm:gap-8 lg:gap-10">
            <img
              src={userData.photoURL || `https://api.dicebear.com/6.x/initials/svg?seed=${userData.name || 'User'}`}
              alt="Profile"
              className="w-25 h-25 md:w-32 md:h-32 rounded-full object-cover shadow-lg"
            />
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-800">Welcome, {userData.name}</h2>
            <p className="text-sm md:text-base mt-0 text-gray-600">You're safe with us. Here's your info:</p>
          </div>

          {/* User Info Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
            <Info label="Email" value={userData.email} />
            <Info label="Name" value={userData.name} />
            <Info label="Last Live Location" value={location ? `Lat: ${location.lat}, Lng: ${location.lng}` : 'Fetching location...'} />
            <Info label="More Info Coming Soon" value={<a href="/">Go to Home</a>}/>
          </div>
        </div>
      </div>
    </>
  );
};

const Info = ({ label, value }) => (
  <div className="p-4 rounded-lg border bg-pink-100 text-gray-700 shadow-sm">
    <p className="text-xs sm:text-sm text-gray-500 mb-2">{label}</p>
    <p className="text-base sm:text-lg font-medium text-gray-800">{value || '—'}</p>
  </div>
);

export default Dashboard;
