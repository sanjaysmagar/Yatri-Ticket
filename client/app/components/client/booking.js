"use client"
import { useState, useEffect, useContext } from 'react';
import { IoIosArrowDown } from "react-icons/io";
import { useFlight } from './FightContext';
import { useRouter } from 'next/navigation'
import { FlightContext } from './FightContext';
import DatePicker from "react-datepicker";
import { FaCalendarAlt, FaSearch } from 'react-icons/fa';
import 'react-datepicker/dist/react-datepicker.css';
import countryList from 'react-select-country-list'; // Import the library

const Booking = () => {
  const router = useRouter();
  const [tripType, setTripType] = useState('oneway');
  const [open, setOpen] = useState(false);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [originLocationCode, setOriginLocationCode] = useState('');
  const [destinationLocationCode, setDestinationLocationCode] = useState('');
  const [cabin, setCabin] = useState('');
  const [date, setDate] = useState(null);
  const [responseData, setResponseData] = useState();
  const { setFlightData } = useFlight();
  const [countryOptions, setCountryOptions] = useState([]);

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const countries = countryList().getData().map(country => ({
      value: country.value,
      label: country.label
    }));
    setCountryOptions(countries);
  }, []);

  const handleSearch = () => {
    if(!originLocationCode || !destinationLocationCode || !date){
      return 0;
     }
    const travelers = [];
    for (let i = 0; i < adults; i++) {
      travelers.push({ id: `${i + 1}`, travelerType: "ADULT", fareOptions: ["STANDARD"] });
    }
    for (let i = 0; i < children; i++) {
      travelers.push({ id: `${adults + i + 1}`, travelerType: "CHILD", fareOptions: ["STANDARD"] });
    }
    for (let i = 0; i < infants; i++) {
      travelers.push({ id: `${adults + children + i + 1}`, travelerType: "INFANT", fareOptions: ["STANDARD"] });
    }

    const flightData = {
      originLocationCode: originLocationCode,
      destinationLocationCode: destinationLocationCode,
      date: date,
      // cabin: cabin.toUpperCase(),
      // noOfTravelers: adults + children + infants,
      travelers: travelers,
    };

    if (cabin && cabin !== "Any Cabin") {
      flightData.cabinRestrictions = [{
        cabin: cabin.toUpperCase().replace(" ", "_"),
        coverage: "MOST_SEGMENTS",
        originDestinationIds: ["1"]
      }];
    }

    setFlightData(flightData);
    router.push('/ticketDetail');
  };

  const totalTravellers = adults + children + infants;

  return (
    <div className="max-w-6xl  mx-auto my-8 bg-blue shadow-lg rounded-md p-6 bg-white">
      <div className="flex justify-between items-center ml-7 mb-4">
        <div className="flex space-x-4">
          <button
            onClick={() => setTripType('oneway')}
            className={`px-7 py-2 rounded whitespace-nowrap ${tripType === 'oneway' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
          >
            One Way
          </button>
          <button
            onClick={() => setTripType('roundtrip')}
            className={`px-7 py-2 rounded whitespace-nowrap ${tripType === 'roundtrip' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
          >
            Round Trip
          </button>
          <button
            onClick={() => setTripType('multicity')}
            className={`px-7 py-2 rounded whitespace-nowrap ${tripType === 'multicity' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
          >
            Multi City
          </button>
        </div>
        <div className="flex space-x-4 px-4">
          <div className="relative">
            <button
              onClick={() => setOpen(prev => !prev)}
              className="flex flex-row items-center appearance-none cursor-pointer bg-gray-100 text-gray-700 py-2 px-5 pr-8 rounded-lg leading-tight focus:outline-none focus:bg-white hover:bg-blue-100 hover:text-blue-500"
            >
              <span className='px-1'>{totalTravellers}</span> Travellers
              <IoIosArrowDown size={19} className='ml-2' />
            </button>
            {open && (
              <div className="absolute top-full mt-2 w-64 p-4 border rounded-lg shadow-md bg-white z-10">
                <div className="mb-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium text-lg">Adults</h3>
                    <div className="flex items-center space-x-2">
                      <button
                        className="w-8 h-8 flex items-center justify-center border rounded bg-gray-200"
                        onClick={() => setAdults(adults > 1 ? adults - 1 : 1)}
                      >-</button>
                      <span className="text-lg">{adults}</span>
                      <button
                        className="w-8 h-8 flex items-center justify-center border rounded bg-gray-200"
                        onClick={() => setAdults(adults + 1)}
                      >+</button>
                    </div>
                  </div>
                </div>
                <div className="mb-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium text-lg">Children <br /> <span className="text-sm">(Age 2-11)</span></h3>
                    <div className="flex items-center space-x-2">
                      <button
                        className="w-8 h-8 flex items-center justify-center border rounded bg-gray-200"
                        onClick={() => setChildren(children > 0 ? children - 1 : 0)}
                      >-</button>
                      <span className="text-lg">{children}</span>
                      <button
                        className="w-8 h-8 flex items-center justify-center border rounded bg-gray-200"
                        onClick={() => setChildren(children + 1)}
                      >+</button>
                    </div>
                  </div>
                </div>
                <div className="mb-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium text-lg">Infants <br /> <span className="text-sm">(Under 2)</span></h3>
                    <div className="flex items-center space-x-2">
                      <button
                        className="w-8 h-8 flex items-center justify-center border rounded bg-gray-200"
                        onClick={() => setInfants(infants > 0 ? infants - 1 : 0)}
                      >-</button>
                      <span className="text-lg">{infants}</span>
                      <button
                        className="w-8 h-8 flex items-center justify-center border rounded bg-gray-200"
                        onClick={() => setInfants(infants + 1)}
                      >+</button>
                    </div>
                  </div>
                </div>
                <button
                  className="w-full py-2 bg-blue-500 text-white rounded-lg"
                  onClick={() => setOpen(false)}
                >Done</button>
              </div>
            )}
          </div>
          <div className="relative">
            <select
              className="appearance-none cursor-pointer bg-gray-100 text-gray-700 py-2 px-5 pr-8 rounded leading-tight focus:outline-none focus:bg-white hover:bg-blue-100 hover:text-blue-500"
              onChange={(e) => setCabin(e.target.value)}
            >
              <option>Any Cabin</option>
              <option>Economy</option>
              <option>Business</option>
              <option value="FIRST">First Class</option>
              <option value="PREMIUM_ECONOMY">Premium Economy</option>
            </select>
            <IoIosArrowDown size={19} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
          </div>
          <div className="flex flex-row justify-center items-center relative">
            <div className="relative inline-block w-full md:w-64">
              <select
                name="nationality"
                
                className="bg-gray-200 rounded text-gray-700 text-sm w-full lg:w-9/12 px-4 py-2"
              >
                <option value="">Nepali</option>
                {countryOptions.map(country => (
                  <option key={country.value} value={country.value}>{country.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 ml-8 md:grid-cols-3 gap-4 mb-4">
        <div className="relative">
          <label className="block text-gray-700">Origin</label>
          <input
            type="text"
            placeholder="Flying From"
            className="w-full mt-1 p-3 border rounded-md"
            onChange={(e) => setOriginLocationCode(e.target.value.toUpperCase())}
            value={originLocationCode}
          />
        </div>
        <div className="relative">
          <label className="block text-gray-700">Destination</label>
          <input
            type="text"
            placeholder="Flying To"
            className="w-full mt-1 p-3 border rounded-md"
            onChange={(e) => setDestinationLocationCode(e.target.value.toUpperCase())}
            value={destinationLocationCode}
          />
        </div>
        <div>
          <label className="block text-gray-700">Departure Date</label>
          <div className="relative">
            <DatePicker
              className="w-full mt-1 p-3 border rounded-md"
              onChange={(date) => setDate(date.toLocaleDateString('en-CA').split('T')[0])}
              dateFormat="yyyy-MM-dd"
              selected={date}
              minDate={new Date(today)}
              placeholderText="Select Date"
            />
          </div>
        </div>
      </div>
      <div className="flex justify-center mt-4 mb-2">
        <button className="w-1/4 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-md hover:from-blue-600 hover:to-indigo-700 flex justify-center items-center" onClick={handleSearch}>
          <FaSearch className="mr-2" /> <span>Search Flight</span>
        </button>
      </div>
    </div>
  );
};

export default Booking;
