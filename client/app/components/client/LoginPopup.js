import React from 'react';
import './LoginPopup.css'
import { useRouter } from 'next/navigation'

const LoginPopup = ({ isOpen, onClose }) => {
    const router = useRouter()

     const handleLogin = () =>{
        router.push('/login')
     }

  return (
    <div className={`fixed inset-0 flex items-center justify-center ${isOpen ? 'block' : 'hidden'}`}>
      <div className="backdrop-blur"></div> {/* Backdrop for the blur effect */}
      <div className="relative  bg-white p-6 rounded shadow-lg popup-container">
        <h2 className="text-xl font-bold mb-4">You must login first to Book flight.</h2>
          <div className='flex items-center justify-center'>
          <button onClick={handleLogin} type="submit" className="bg-blue-500 text-white text-sm px-4 py-2 rounded hover:bg-blue-600">
            Login Here
          </button>
          <button type="button" onClick={onClose} className="ml-6 border-gray-400 text-gray-600 hover:text-purple-800">
            Cancel
          </button>
          </div>
      </div>
    </div>
  );
}

export default LoginPopup;
