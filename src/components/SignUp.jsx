import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { setUserData } from '../firebaseHelpers';
import { motion } from 'framer-motion';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [contact1, setContact1] = useState('');
  const [contact2, setContact2] = useState('');
  const [contact3, setContact3] = useState('');
  const [contact4, setContact4] = useState('');
  const [contact5, setContact5] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const authInstance = getAuth();
    try {
      const userCredential = await createUserWithEmailAndPassword(authInstance, email, password);
      const user = userCredential.user;
      await setUserData(user.uid, name, email, [contact1, contact2, contact3, contact4, contact5]);
      navigate('/dashboard');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-pink-200 via-white to-purple-100">
      {/* Left Side - Welcome */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 bg-gradient-to-br from-pink-500 to-purple-600 text-white relative overflow-hidden">
        <motion.div
          className="absolute bottom-0 left-0 w-[150%] h-32"
          initial={{ scale: 1 }}
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 6, repeat: Infinity }}
        >
          <svg viewBox="0 0 1440 320" className="w-full h-full" preserveAspectRatio="none">
            <path
              fill="#ffffff"
              fillOpacity="0.2"
              d="M0,96L48,112C96,128,192,160,288,186.7C384,213,480,235,576,213.3C672,192,768,128,864,128C960,128,1056,192,1152,208C1248,224,1344,192,1392,176L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ></path>
          </svg>
        </motion.div>
        <motion.div
          className="z-10 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-pink-200 bg-clip-text text-transparent">Create Your Vismaya Account</h1>
          <p className="mt-4 text-lg text-pink-100">Protect. Connect. Empower.</p>
        </motion.div>
      </div>

      {/* Right Side - Signup Form */}
      <div className="w-full md:w-1/2 flex justify-center items-center p-6 md:p-12">
        <motion.form
          onSubmit={handleSubmit}
          className="w-full max-w-lg bg-white/70 backdrop-blur-lg p-8 rounded-xl shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-semibold text-center mb-6 bg-gradient-to-br from-pink-500 to-purple-600 bg-clip-text text-transparent">Sign Up</h2>

          {/* Input group */}
          {[
            { label: 'Full Name', value: name, set: setName, type: 'text' },
            { label: 'Email', value: email, set: setEmail, type: 'email' },
            { label: 'Password', value: password, set: setPassword, type: 'password' },
            { label: 'Contact 1', value: contact1, set: setContact1 },
            { label: 'Contact 2', value: contact2, set: setContact2 },
            { label: 'Contact 3', value: contact3, set: setContact3 },
            { label: 'Contact 4', value: contact4, set: setContact4 },
            { label: 'Contact 5', value: contact5, set: setContact5 },
          ].map(({ label, value, set, type = 'text' }, index) => (
            <div key={index} className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
              <input
                type={type}
                value={value}
                onChange={(e) => set(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400 focus:outline-none bg-white/80 backdrop-blur-md shadow-md"
              />
            </div>
          ))}

          {error && <p className="text-red-600 text-sm mb-3 text-center">{error}</p>}

          <motion.button
            type="submit"
            className="w-full py-2 mt-2 bg-gradient-to-br from-pink-500 to-purple-500 text-white rounded-lg shadow-md hover:scale-[1.02] active:scale-95 transition-transform"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            Sign Up
          </motion.button>

          <p className="text-center text-sm text-gray-600 mt-4">
            Already have an account?{' '}
            <a href="/login" className="text-pink-600 hover:underline">Login</a>
          </p>
        </motion.form>
      </div>
    </div>
  );
};

export default Signup;
