'use client'
import React, { useEffect, useState } from 'react';
import './page.css'; // Create Modal.css for styling

const Modal = ({ onClose, onReload }) => {
  const handleReload = () => {
    onReload();
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Session Expired</h2>
        <p>Your session has expired.</p>
        <button onClick={handleReload}>Reload</button>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

const Page = () => {
  const [expired, setExpired] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60); // 1 minute in seconds

  const duration = 1 * 60; // 1 minute in milliseconds

  useEffect(() => {
    const timer = setTimeout(() => {
      setExpired(true);
    }, duration * 1000 );

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (expired) {
      setShowModal(true);
    }
  }, [expired]);

  useEffect(() => {
    if (timeLeft > 0 && !expired) {
      const countdownTimer = setInterval(() => {
        setTimeLeft(prevTime => prevTime - 1);
      }, 1000);

      return () => clearInterval(countdownTimer);
    }
  }, [timeLeft, expired]);

  const closeModal = () => {
    setShowModal(false);
    // Additional logic when closing the modal
  };

  const reloadPage = () => {
    window.location.reload(); // Reload the entire page
  };

  return (
    <div>
      <h1>kam garxa ki nai try matra gareko</h1>

      <div className='timerContainer'>
          Time left: {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
        </div>
      
      {showModal && <Modal onClose={closeModal} onReload={reloadPage} />}
    </div>
  );
};

export default Page;
