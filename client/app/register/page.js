
'use client'

import PublicRoute from '../components/client/publicRoute';
import { useState } from 'react';
import Navbar from '../components/server/navbar';
import Footer from '../components/server/footer';
import { useRouter } from 'next/navigation'
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { useAuth } from '../components/client/auth';



  const RegisterForm = () => {
  const router = useRouter()
  const { setUser } = useAuth()
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    countryCode: '',
    nationality: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value.replace(/\s/g, '')
    });
  };


  const toggleVisibility = (setVisibility) => {
    setVisibility(prevData => !prevData);
  };

  
  const handleSubmit = (e) => {
    e.preventDefault();

    const trimPassword = formData.password.trim()
    const trimConfirmPassword = formData.confirmPassword.trim()

    if(trimPassword !== trimConfirmPassword){
      setMessageType('error')
        return setMessage( "Password and confirm password not matched")
}

// Checks if password meets the requirement
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/

    if (!passwordRegex.test(trimPassword)) {
        setMessageType('error')
        return setMessage('Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.')
    }
    
    let response 

    fetch('http://localhost:5000/register', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(formData)
  })
  .then(res => {
    response = res
    if(response.ok){
      setMessageType('success')
    }
    else{
      setMessageType('error')
    }
    return response.json()
  })
  .then(data => {
     setMessage(data.message)
     setUser(data.user)
     if(response.ok){
      router.push('/')
    }
  })
   .catch(error => console.log(error))
}


  return (
    <div>
      <Navbar />
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block text-gray-700">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700">Phone Number</label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block text-gray-700">Country Code</label>
              <input
                type="text"
                name="countryCode"
                value={formData.countryCode}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700">Nationality</label>
              <input
                type="text"
                name="nationality"
                value={formData.nationality}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div className="relative">
        <label className="block text-gray-700">Password</label>
        <input
          type={showPassword ? 'text' : 'password'}
          name="password"
          value={formData.password}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
          required
        />
        <span
          onClick={() => toggleVisibility(setShowPassword)}
          className="absolute inset-y-11 right-0 flex items-center px-2 cursor-pointer"
        >
          {showPassword ? <AiFillEyeInvisible size={20} /> : <AiFillEye size={20} />}
        </span>
      </div>
      <div className="relative">
        <label className="block text-gray-700">Confirm Password</label>
        <input
          type={showConfirmPassword ? 'text' : 'password'}
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
          required
        />
        <span
          onClick={() => toggleVisibility(setShowConfirmPassword)}
          className="absolute inset-y-11 right-0 flex items-center px-2 cursor-pointer"
        >
          {showConfirmPassword ? <AiFillEyeInvisible size={20} /> : <AiFillEye size={20} />}
        </span>
      </div>
    </div>
          <div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Register
            </button>
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
}

export default PublicRoute(RegisterForm)
