'use client';
import PublicRoute from '../components/client/publicRoute';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from "next/link";
import Navbar from '../components/server/navbar';
import Footer from '../components/server/footer';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { useAuth } from '../components/client/auth';

const LoginForm = () => {
  const router = useRouter();
  const { setUser } = useAuth()
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // New state to track the type of message
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    let response;
    const formData = {
      email: email.toLowerCase(),
      password: password
    };

    fetch('http://localhost:5000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(formData),
    })
    .then(res => {
      response = res;
      if (response.ok) {
        setMessageType('success');
      } else {
        setMessageType('error');
      }
      return response.json();
    })
    .then(data => {
      console.log(data.user)
      setMessage(data.message);
      setUser(data.user)
      if (response.ok) {
        router.push('/')
      }
    })
    .catch(error => console.error('Fetch error:', error));
  };

  const toggleVisibility = () => {
    setShowPassword(prevData => !prevData);
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                required
              />
            </div>
            <div className="relative">
              <label className="block text-gray-700">Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                required
              />
              <span
                onClick={toggleVisibility}
                className="absolute inset-y-11 right-3 flex items-center cursor-pointer"
              >
                {showPassword ? <AiFillEyeInvisible size={20} /> : <AiFillEye size={20} />}
              </span>
            </div>
            <div>
              <button
                type="submit"
                className="w-full py-2 px-4 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Login
              </button>
            </div>
            <div className="flex justify-between items-center mt-4">
              <a href="/forgot-password" className="text-sm text-blue-600 hover:underline">Forgot Password?</a>
              <Link href="/register" className="text-sm text-blue-600 hover:underline">Sign Up</Link>
            </div>
          </form>
          {message && (
            <div className={`mt-4 p-2 text-center ${messageType === 'success' ? 'text-green-600' : 'text-red-600'}`}>
              {message}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PublicRoute(LoginForm);
