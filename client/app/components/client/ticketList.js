'use client';
import React, { useEffect, useState, useContext } from 'react';
import { useFlight } from './FightContext';
import { IoMdArrowDropdown } from "react-icons/io";
import { IoMdArrowDropright } from "react-icons/io";
import { GoDotFill } from 'react-icons/go';
import { IoIosAirplane } from 'react-icons/io';
import Navbar from '../server/navbar';
import Footer from '../server/footer';
import Link from 'next/link';
import { useRouter } from 'next/navigation'
import LoginPopup from './LoginPopup'; // Adjust the import path as per your project structure
import { FaPlaneDeparture } from "react-icons/fa";
import { BsSuitcase } from "react-icons/bs";
import { PiHandbagBold } from "react-icons/pi";
import { RxCross2 } from "react-icons/rx";
import { useAuth } from './auth';
import './ticketList.css';
import { BsStopwatch } from "react-icons/bs";

//timer ko lagi,popup
const Modal = ({onClose,onReload}) =>{
  const handleReload = () =>{
    onReload();
  }
   
  return(
    <div className="modal-background">
    <div className="modal">
      <div className="modal-content">
        <div className='flex  justify-center'>
          <BsStopwatch size={70}/>
        </div>
        <h1>Your session has expired.</h1>
        <div className="button-container">
        <button onClick={handleReload}>Reload</button>
        <button onClick={onClose}>Home</button>
        </div>
      </div>
    </div>
  </div>
  )
}

// Helper function to format duration string
const formatDuration = (duration) => {
  if (!duration.startsWith('PT')) return duration;
  const time = duration.slice(2);
  return time.replace('H', 'H ').replace('M', 'M ');
};

// Helper function to calculate duration between two times
const calculateLayoverDuration = (arrivalTime, departureTime) => {
  const [arrHour, arrMinute] = arrivalTime.split(':').map(Number);
  const [depHour, depMinute] = departureTime.split(':').map(Number);

  let durationMinutes = (depHour * 60 + depMinute) - (arrHour * 60 + arrMinute);

  if (durationMinutes < 0) {
    durationMinutes += 24 * 60; // Adjust for overnight layovers
  }

  const hours = Math.floor(durationMinutes / 60);
  const minutes = durationMinutes % 60;

  return `${hours} hour${hours !== 1 ? 's' : ''} ${minutes} minute${minutes !== 1 ? 's' : ''}`;
};

const calculateTotalDuration = (ticket) => {
  let totalDuration = 0;
  for (let i = 0; i < ticket.segments.length; i++) {
    totalDuration += parseDuration(ticket.segments[i].duration);
  }
  return totalDuration;
};




const TicketList = () => {
  const { flightData } = useFlight()
  const { setTicketId } = useFlight()
  const { user } = useAuth()
  const [ticketDetail, setTicketDetail] = useState(null);
  const [loading, setLoading] = useState(true)
  const [stops, setStops] = useState('All');
  const [selectedAirline, setSelectedAirline] = useState('All');
  const [sortBy, setSortBy] = useState('0');
  const [isVisibleStops, setIsVisibleStops] = useState(true);
  const [isVisibleAirline, setIsVisibleAirline] = useState(true);
  const [isVisibleSortBy, setIsVisibleSortBy] = useState(true);
  const [flightDetailsVisible, setFlightDetailsVisible] = useState({});
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [sessionExpired, setSessionExpired] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);
  const [expired, setExpired] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  const duration = 1*60*1000;// 1 minute in milliseconds

  useEffect(() =>{
    const timer = setTimeout(()=>{
      setExpired(true);
    },duration);

    return () => clearTimeout(timer);
  },[]);

  useEffect(() =>{
    if(expired){
      setShowModal(true);
    }
  },[expired]);

  const closeModal = () =>{
    router.push('/')
  }

  const reloadPage = () =>{
    window.location.reload(); //reload entire page
  }

  useEffect(() => {
    if (!flightData) return;

    fetch('http://localhost:5000/flight/v1/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(flightData),
    })
      .then(response => response.json())
      .then(data => {
        setTicketDetail(data)
        console.log('this is searchflight data:', data)
        setLoading(false)
      })
      .catch(error => console.log(error));
  }, [flightData]);

  const toggleFlightDetails = (index) => {
    setFlightDetailsVisible(prevState => ({
      ...prevState,
      [index]: !prevState[index]
    }));
  };

  // Function to clear all filters
  const clearAllFilters = () => {
    setStops('All');
    setSelectedAirline('All');
    setSortBy('1');
  };

  // Helper function to parse duration for sorting
  const parseDuration = (duration) => {
    const match = duration.match(/PT(\d+H)?(\d+M)?/);
    const hours = parseInt(match[1]) || 0;
    const minutes = parseInt(match[2]) || 0;
    return hours * 60 + minutes;
  };

  // Function to sort flights based on selected criteria
  const sortFlights = (flights, sortBy) => {
    return flights.sort((a, b) => {
      if (sortBy === '0') {
        return parseFloat(a.price) - parseFloat(b.price);
      } else if (sortBy === '1') {
        const durationA = a.segments.reduce((total, segment) => total + parseDuration(segment.duration), 0);
        const durationB = b.segments.reduce((total, segment) => total + parseDuration(segment.duration), 0);
        return durationA - durationB;
      }
      return 0;
    });
  };

  // Filtering the flights based on stops and selected airline
 const filteredFlights = ticketDetail
  ? sortFlights(
    ticketDetail.filter(flight => {
      const stopsCount = flight.segments.length - 1;
      const airlineMatch = selectedAirline === 'All' || flight.segments[0].businessName === selectedAirline;
      const stopsMatch = stops === 'All' || stopsCount === parseInt(stops);
      return airlineMatch && stopsMatch;
    }),
    sortBy
  )
  : [];

  if (loading && !ticketDetail) {
    return <div>Loading...</div>;
  }


  const getAirlines = (ticketDetail) => {
    return [
      ...new Set(ticketDetail.map(ticket => ticket.segments[0].businessName))
    ].map(name => ({ name }));
  };

  const airlines = ticketDetail ? getAirlines(ticketDetail) : null

  const toggleVisibility = (setIsVisible) => {
    setIsVisible(prevData => !prevData);
  };

  // Function to toggle login popup
  const handleBook = (id) => {
    if (!user) {
      return setShowLoginPopup((prev) => !prev);
    }
    setTicketId(id)
    router.push('/flightBook')

  };

  return (
    <div>
      <Navbar />
      <div className="flex flex-row space-x-4 bg-slate-100">
        <div className="w-80 mt-12">
          <div className="p-6 border bg-white rounded-lg w-full">
            <div className="flex justify-between items-center mb-4 border-b   decoration-sky-500">
              <h2 className="text-xl font-bold mb-3">Filter</h2>
              <button onClick={clearAllFilters} className="text-blue-500 text-sm mb-3">Clear All</button>
            </div>

            <div className="mb-2 border-b">
              <div className='flex justify-between items-center mb-2'>
              <h3 className="flex flex-row font-bold text-sm cursor-pointer" onClick={() => toggleVisibility(setIsVisibleStops)}>
                Stops
                <span className=" items-center justify-center">
                  {isVisibleStops ? (< IoMdArrowDropdown size={20} />) : (<IoMdArrowDropright size={20} />)}
                </span>
              </h3>
              <button className="text-blue-500 text-sm">Clear</button>
              </div>
              <div className={`transition-container ${isVisibleStops ? 'open' : ''}`} >
                <label className="block mb-3 text-sm">
                  <input
                    type="radio"
                    name="stops"
                    value="All"
                    checked={stops === 'All'}
                    onChange={() => setStops('All')}
                    className="mr-2"
                  />
                  All
                </label>
                <label className="block mb-3 text-sm">
                  <input
                    type="radio"
                    name="stops"
                    value="0"
                    checked={stops === '0'}
                    onChange={() => setStops('0')}
                    className="mr-2"
                  />
                  Non-stop Flights only
                </label>
                <label className="block mb-3 text-sm">
                  <input
                    type="radio"
                    name="stops"
                    value="1"
                    checked={stops === '1'}
                    onChange={() => setStops('1')}
                    className="mr-2"
                  />
                  Max 1 stop only
                </label>
                <label className="block mb-4 text-sm">
                  <input
                    type="radio"
                    name="stops"
                    value="2"
                    checked={stops === '2'}
                    onChange={() => setStops('2')}
                    className="mr-2"
                  />
                  Max 2 stops only
                </label>
              </div>
            </div>

            <div className='mb-3 border-b'>
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold flex flex-row text-sm cursor-pointer" onClick={() => toggleVisibility(setIsVisibleAirline)}>
                  Airline
                  <span className={` items-center justify-center`}>
                    {isVisibleAirline ? (<IoMdArrowDropdown size={20} />) : (<IoMdArrowDropright size={20} />)}
                  </span>
                </h3>
                <button onClick={() => setSelectedAirline('All')} className="text-blue-500 text-sm">Clear</button>
              </div>
              <div className={`transition-max-height ${isVisibleAirline ? 'open' : ''}`}>
                <label className="block mb-3 text-sm">
                  <input
                    type="radio"
                    name="airline"
                    value="All"
                    checked={selectedAirline === 'All'}
                    onChange={() => setSelectedAirline('All')}
                    className="mr-2"
                  />
                  All
                </label>
                {airlines ? airlines.map((airline) => (
                  <label
                    className="block mb-3 text-sm"
                    key={airline.name}
                  >
                    <input
                      type="radio"
                      name="airline"
                      value={airline.name}
                      checked={selectedAirline === airline.name}
                      onChange={() => setSelectedAirline(airline.name)}
                      className="mr-2"
                    />
                    {airline.name.toLowerCase()
                      .split(' ')
                      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                      .join(' ')
                    }
                  </label>
                )) : <p>empty</p>}
              </div>
            </div>

            <div>
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                <h3 className="flex flex-row font-bold text-sm cursor-pointer" onClick={() => toggleVisibility(setIsVisibleSortBy)}>
                  Sort By
                  <span className="items-center justify-center">
                    {isVisibleSortBy ? (<IoMdArrowDropdown size={20} />) : (<IoMdArrowDropright size={20} />)}
                  </span>
                </h3>
                <button className='text-blue-500 text-sm'>Clear</button>
                </div>
                <div className={`transition-max-height ${isVisibleSortBy ? 'open' : ''}`}>
                  <label className="block mb-2 text-sm">
                    <input
                      type="radio"
                      name="sortBy"
                      value="0"
                      checked={sortBy === '0'}
                      onChange={() => setSortBy('0')}
                      className="mr-2 text-xs"
                    />
                    Cheapest
                  </label>
                  <label className="block text-sm">
                    <input
                      type="radio"
                      name="sortBy"
                      value="1"
                      checked={sortBy === '1'}
                      onChange={() => setSortBy('1')}
                      className="mr-2"
                    />
                    Fastest
                  </label>
                </div>
              </div>
            </div>
            <button className='w-full bg-green-500 text-white py-2 rounded'>FILTER</button>
          </div>
        </div>

        <div className="flex-grow  p-4">
          <h2 className="text-2xl font-semibold underline hover:underline-offset-4 text-center text-gray-800  mb-4 " style={{ fontFamily: 'Arial, sans-serif', fontStyle: 'italic' }}>Available Tickets</h2>

        { filteredFlights.length === 0 ? (<div className="text-center  text-lg text-red-500">Oops no tickets found!</div>): (filteredFlights.map((ticket, index) => {
            const firstSegment = ticket.segments[0];
            const lastSegment = ticket.segments[ticket.segments.length - 1];

            return (
              <div key={index} className="container mx-auto p-4 text-center">
                <div className='space-y-4'>
                  <div>
                    <div

                      className="bg-white rounded-lg shadow-lg p-4 flex flex-col justify-between items-center"
                    >
                      <div className="flex flex-row">
                        <div className="mx-1 flex flex-col items-center w-32">
                          <img
                            src={firstSegment.airlineLogo}
                            alt={`${firstSegment.airline} Logo`}
                            className="w-20 h-20 inline"
                          />
                          <div className="text-xs text-gray-800">
                            {firstSegment.businessName}
                          </div>
                        </div>
                        <div className="flex items-center w-48">
                          <div className="text-center mr-10">
                            <div className="text-sm text-gray-800">
                              {firstSegment.departureAirport} ({firstSegment.departureIataCode})
                            </div>
                            <div className="text-sm text-gray-800">
                              {firstSegment.departureAt.split('T')[0]}
                            </div>
                            <div className="text-xl text-black">
                              {firstSegment.departureAt.split('T')[1]}
                            </div>
                          </div>
                        </div>
                        <div className="flex-1 text-center h-20 mr-16">
                          <div className="text-sm text-gray-500 mt-2">
                            {ticket.totalFlightTime}
                          </div>
                          <div className="flex flex-row items-center justify-center">
                            <div>
                              <GoDotFill size={22} />
                            </div>
                            <div className="flex flex-row h-0.5 w-44 bg-gray-400"></div>
                            <div>
                              <IoIosAirplane size={30} />
                            </div>
                          </div>
                          <div className="text-sm text-gray-500 mb-11">
                            {ticket.noOfStops} stop(s)
                          </div>
                        </div>
                        <div className="flex items-center w-48">
                          <div className="text-center mr-12">
                            <div className="text-sm text-gray-800">
                              {lastSegment.arrivalAirport} ({lastSegment.arrivalIataCode})
                            </div>
                            <div className="text-sm text-gray-800">
                              {lastSegment.departureAt.split('T')[0]}
                            </div>
                            <div className="text-xl text-black">
                              {lastSegment.arrivalAt.split('T')[1]}
                            </div>
                          </div>
                        </div>
                        <div className="text-right mt-5 w-32">
                          <div className="text-1xl font-bold text-blue-600">
                            {ticket.currency} {ticket.price}
                          </div>
                          <button onClick={() => handleBook(ticket.id)} className="mt-2 bg-blue-500 text-white hover:bg-blue-600 px-2 py-2 rounded">
                            Book Flight
                          </button>
                        </div>
                      </div>
                      <div className="flex flex-row justify-between  space-x-60 items-center mt-5 text-sm border-t border-dashed">
                        <div onClick={() => toggleFlightDetails(index)} className="flex-grow cursor-pointer flex items-center hover:text-green-500">
                          <span className='mr-1'><FaPlaneDeparture /></span>
                          Flight Detail
                        </div>
                        <div className='flex-grow flex items-center justify-center'>
                          <BsSuitcase className='mr-1' />{firstSegment.checkedBaggage}-
                          <PiHandbagBold className='ml-1 mr-1' /> {firstSegment.carryBaggage}/person
                        </div>
                        <div className="flex-grow flex items-center justify-end text-red-600">
                          <span className='mr-1'><RxCross2 /></span>Non-Refundable
                        </div>
                      </div>

                    </div>

                    {flightDetailsVisible[index] && (
                      <div className='hover:shadow-lg hover:shadow-gray-400'>
                        {ticket.segments.map((segment, segIndex) => {
                          const nextSegment = ticket.segments[segIndex + 1];
                          const layoverDuration = nextSegment ? calculateLayoverDuration(segment.arrivalAt.split('T')[1], nextSegment.departureAt.split('T')[1]) : null;

                          return (
                            <div key={segIndex} className='subin w-full bg-slate-50'>
                              <div className="w-full mx-auto bg-slate-50 overflow-hidden border">
                                <div className="p-4 border-b border-gray-200">
                                  <h2 className="text-xl font-semibold text-blue-900">{segment.departureAirport} - {segment.arrivalAirport}</h2>
                                </div>
                                <div className="flex p-4">
                                  <div className="flex-shrink-0 flex flex-col">
                                    <img
                                      className="h-20 w-20"
                                      src={segment.airlineLogo}
                                      alt="Airline Logo"
                                    />
                                    <div className="text-sm font-semibold text-gray-900">{segment.businessName}</div>
                                  </div>
                                  <div className="ml-4 flex-grow">
                                    <div className="flex justify-between mt-3 items-center">
                                      <div>
                                        <div className="text-gray-600">{segment.departureAirport}<strong>{segment.departureIataCode}</strong></div>
                                        <div className="text-gray-600">{segment.departureAt.split('T')[0]} <br /> <strong>{segment.departureAt.split('T')[1]}</strong></div>
                                      </div>
                                      <div className="text-center">
                                        <div className="text-gray-600">Duration</div>
                                        <div className="text-xl font-bold text-gray-900">{formatDuration(segment.duration)}</div>
                                      </div>
                                      <div>
                                        <div className="text-gray-600">{segment.arrivalAirport}, <strong>{segment.arrivalIataCode}</strong></div>
                                        <div className="text-gray-600">{segment.arrivalAt.split('T')[0]} <br /> <strong>{segment.arrivalAt.split('T')[1]}</strong></div>
                                      </div>
                                    </div>
                                    <div className="flex justify-center items-center mt-4">
                                      <div className="flex items-center text-sm text-black text-center">
                                        Economy-
                                        <BsSuitcase className='mx-1' />
                                        {segment.checkedBaggage}-
                                        <PiHandbagBold className='mx-1' />
                                        {segment.carryBaggage}/person
                                      </div>
                                    </div>

                                  </div>
                                </div>
                                {nextSegment && (
                                  <div className="p-4 flex border-t border-dashed border-gray-500 justify-between">
                                    <div className="text-black font-bold">Stop in {segment.arrivalAirport}</div>
                                    <div className="text-right font-bold text-gray-900">
                                      {layoverDuration}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                    )}
                  </div>
                </div>
              </div>
            )

          }))}
        </div>
      </div>
      {showModal && <Modal onClose={closeModal} onReload={reloadPage}/>}
      <LoginPopup isOpen={showLoginPopup} onClose={handleBook} />
      <Footer />
    </div>
  );
};

export default TicketList;
