import React, { useState } from 'react';
import { loginUser } from '../firebaseHelpers';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await loginUser(form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Side - Welcome Panel */}
      <div className="w-full md:w-1/2 bg-gradient-to-br from-pink-500 to-purple-600 text-white flex flex-col justify-center items-center relative overflow-hidden p-6">
        <motion.div
          className="absolute bottom-0 left-0 w-[150%] h-32 overflow-hidden"
          initial={{ scale: 1 }}
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        >
          <svg viewBox="0 0 1440 320" className="w-full h-full" preserveAspectRatio="none">
            <path
              fill="#ffffff"
              fillOpacity="0.2"
              d="M0,96L48,112C96,128,192,160,288,186.7C384,213,480,235,576,213.3C672,192,768,128,864,128C960,128,1056,192,1152,208C1248,224,1344,192,1392,176L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ></path>
          </svg>
        </motion.div>
        <motion.h1
          className="text-3xl md:text-4xl font-bold bg-gradient-to-br from-white to-pink-200 bg-clip-text text-transparent z-10 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Welcome Back!
        </motion.h1>
        <motion.p
          className="text-lg md:text-xl mt-4 text-center px-4 z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          Secure Login with Vismaya
        </motion.p>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full md:w-1/2 flex justify-center items-center bg-white p-6 md:p-8">
        <motion.form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-white shadow-xl rounded-xl p-6 md:p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl md:text-3xl font-semibold text-center mb-6 bg-gradient-to-br from-pink-500 to-purple-600 bg-clip-text text-transparent">
            Login
          </h2>

          <motion.input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:outline-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          />

          <motion.input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:outline-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          />

          {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

          <motion.button
            type="submit"
            className="w-full bg-gradient-to-br from-pink-500 to-purple-600 text-white py-2 rounded-md hover:bg-pink-600 transition duration-300"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            Login
          </motion.button>

          <p className="text-center mt-3">
            Don't have an account? <a className="text-pink-500" href="/signup">Sign Up</a>
          </p>
        </motion.form>
      </div>
    </div>
  );
};

export default Login;
