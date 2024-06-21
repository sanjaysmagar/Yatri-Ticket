"use client";
import { useContext, useEffect, useState } from 'react';
import { MdDoubleArrow } from "react-icons/md";
import Navbar from "../server/navbar";
import Footer from '../server/footer';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import countryList from 'react-select-country-list'; // Import the library
import { FiMail, FiPhone, FiSmartphone } from 'react-icons/fi';
import { useFlight } from './FightContext';
import { FlightContext } from './FightContext';
import { BsStopwatch } from "react-icons/bs";
import { useRouter } from 'next/navigation'
import './FlightForm.css'

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
  



const FlightForm = () => {
    const { ticketId } = useFlight()
    // const { ticketId } = useContext(FlightContext);
    const [ticketDetail, setTicketDetail] = useState(null)
    const [loading, setLoading] = useState(true)
    const [userData, setUserData] = useState({
        ticketId: '',
        travelers: []
    });
    const [agreed, setAgreed] = useState(false);
    const [countryOptions, setCountryOptions] = useState([]);
    const [expired, setExpired] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [timeLeft, setTimeLeft] = useState(60); // 1 minute in seconds
    const [timer, setTimer] = useState({minutes: 10, seconds: 0});
    const router = useRouter();

    

    useEffect(() => {
        if (expired) {
            setShowModal(true);
        }
    }, [expired]);

    const reloadPage = () => {
        window.location.reload(); // Reload the entire page
    };
      

    const closeModal = () =>{
        router.push('/')
      }
    


    useEffect(() => {
        const countries = countryList().getData().map(country => ({
            value: country.value,
            label: country.label
        }));
        setCountryOptions(countries);
    }, []);

    useEffect(() => {
        fetch('http://localhost:5000/flight/v1/searchPrice', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ ticketId })
        })
            .then(response => response.json())
            .then(data => {
                setTicketDetail(data[0]);
                const travelers = data[0].travelerPricings.map(() => ({
                    firstName: '',
                    lastName: '',
                    dateOfBirth: '',
                    gender: '',
                    emailAddress: '',
                    phone: {
                        deviceType: 'MOBILE',
                        countryCallingCode: '',
                        number: ''
                    },
                    passport: {
                        documentType: 'PASSPORT',
                        number: '',
                        expiryDate: '',
                        nationality: '',
                        issuanceCountry: '',
                        holder: 'true'
                    }
                }));
                setUserData({ ticketId: data[0].id, travelers });
                //line changed
                setTicketDetail(data[0])
                setLoading(false)
                console.log(data[0])
            })
            .catch(error => error);
    }, [ticketId]);

    useEffect(() => {
 
        // Start the timer when the component mounts
        const intervalId = setInterval(() => {
          setTimer(prevTimer => {
            const remainingSeconds = prevTimer.minutes * 60 + prevTimer.seconds - 1;
            if (remainingSeconds <= 0) {
              clearInterval(intervalId);
              setExpired(true)
              return { minutes: 0, seconds: 0 };
            }
            const minutes = Math.floor((remainingSeconds % 3600) / 60);
            const seconds = remainingSeconds % 60;
            return { minutes, seconds };
          });
        }, 1000);
     
        // Clear the interval when the component unmounts or when timer reaches 0
        return () => clearInterval(intervalId)
      }, []); // Empty dependency array ensures the effect runs only once on mount
     
      // Function to format time
      const formatTime = (value) => {
        return value.toString().padStart(2, '0');
      };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const contactEmail = userData.travelers[0].emailAddress;
        const contactCountryCallingCode = userData.travelers[0].phone.countryCallingCode;
        const contactPhoneNumber = userData.travelers[0].phone.number;
    
        const updatedTravelers = userData.travelers.map(traveler => ({
            ...traveler,
            emailAddress: contactEmail,
            phone: {
                ...traveler.phone,
                countryCallingCode: contactCountryCallingCode,
                number: contactPhoneNumber
            }
        }));
    
        const dataToSend = { ...userData, ticketId: ticketDetail.id, travelers: updatedTravelers };
        console.log('User Data:', JSON.stringify(dataToSend, null, 2));
    
        try {
            const response = await fetch('http://localhost:5000/flight/v1/book', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(dataToSend),
            });
            console.log(response);
    
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
    
            const result = await response.json();
            console.log(result);
        } catch (error) {
            console.error('There was a problem with your fetch operation:', error);
        }
    };
    

    const handleChange = (e, travelerIndex) => {
        const { name, value } = e.target;
        setUserData(prevState => {
            const travelers = [...prevState.travelers];
            if (name.includes('phone.')) {
                const phoneField = name.split('.')[1];
                travelers[travelerIndex].phone[phoneField] = value;
            } else if (name.includes('passport.')) {
                const passportField = name.split('.')[1];
                travelers[travelerIndex].passport[passportField] = value;
            } else {
                travelers[travelerIndex][name] = value;
            }
            return { ...prevState, travelers };
        });
    };

    const handlePhoneChange = (value, data, event, travelerIndex) => {
        const number = value.replace(/^\+/, ''); // Remove the leading '+' sign
        const countryCallingCode = number.slice(0, data.dialCode.length);

        setUserData(prevState => {
            const travelers = [...prevState.travelers];
            travelers[travelerIndex].phone.number = number.slice(data.dialCode.length); // Remove the country code part
            travelers[travelerIndex].phone.countryCallingCode = countryCallingCode;
            return { ...prevState, travelers };
        });
    };

    const handlePassportChange = (e, travelerIndex) => {
        const { name, value } = e.target;
        setUserData(prevState => {
            const travelers = [...prevState.travelers];
            travelers[travelerIndex].passport[name] = value;
            if (name === 'nationality') {
                travelers[travelerIndex].passport.issuanceCountry = value; // Sync issuanceCountry with nationality
            }
            return { ...prevState, travelers };
        });
    };

    const handleCheckboxChange = () => {
        setAgreed(!agreed);
    };

    const handleCancel = () => {
        // Handle cancel logic here
        console.log('Form cancelled');
    };

    if(loading && !ticketDetail){
        return <div>Loading....</div>
    }

    // Calculate the number of adults, children, and infants
    const adultCount = ticketDetail.travelerPricings.filter(traveler => traveler.travelerType === 'ADULT').length;
    const childCount = ticketDetail.travelerPricings.filter(traveler => traveler.travelerType === 'CHILD').length;
    const infantCount = ticketDetail.travelerPricings.filter(traveler => traveler.travelerType === 'INFANT').length;

    return (
        <div>
            <Navbar />
            {ticketDetail ? (
            <div className="h-full w-full bg-slate-200 overflow-x-hidden">
                <div className="flex flex-col justify-center items-center py-5">
                    <h1 className="text-red-400">One Way: {ticketDetail.segments[0].departureIataCode} - {ticketDetail.segments[ticketDetail.segments.length - 1].arrivalIataCode}</h1>
                    <div className="flex flex-row text-purple-700 justify-center items-center">
                        <MdDoubleArrow />
                        <span>
                            <span>
                                {ticketDetail.segments[0].departureAt.split('T')[0]} |
                                {adultCount > 0 && ` ${adultCount} ADULT`}
                                {childCount > 0 && `, ${childCount} CHILD`}
                                {infantCount > 0 && `, ${infantCount} INFANT`} |
                                {ticketDetail.segments[0].cabin}
                            </span>
                        </span>
                    </div>
                </div>
                <div className='flex flex-col lg:flex-row'>
                    <div className='flex flex-col lg:w-2/3'>
                        <div className="w-full bg-slate-200 flex flex-col items-start px-4 lg:px-12">
                            <div className="bg-white p-8 rounded-xl mt-5 shadow-lg w-full max-w-3xl">
                                <h2 className="text-2xl font-bold ml-7">Add Contact Details</h2>
                                <p className="ml-7 mb-5">E-ticket will be sent to this email address and phone number</p>
                                <form>
                                    <div className="mb-6 ml-7">
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="emailAddress">
                                            Email
                                        </label>
                                        <input
                                            placeholder='Enter your email'
                                            type="email"
                                            name="emailAddress"
                                            value={userData.travelers[0].emailAddress}
                                            onChange={(e) => handleChange(e, 0)}
                                            className="shadow appearance-none border rounded w-full text-sm lg:w-9/12 bg-gray-200 py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            required
                                        />
                                    </div>
                                    <div className="mb-6 ml-7">
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone.number">
                                            Mobile Number
                                        </label>
                                        <PhoneInput
                                            country={'np'}
                                            value={userData.travelers[0].phone.countryCallingCode + userData.travelers[0].phone.number}
                                            onChange={(value, data, event) => handlePhoneChange(value, data, event, 0)}
                                            containerStyle={{ width: '100%', maxWidth: 'none' }}
                                            inputStyle={{ width: '75%', height: '40%', maxWidth: 'none', backgroundColor: '#e2e8f0' }}
                                            inputClass="shadow appearance-none border rounded w-full lg:w-9/12 py-2 lg:py-3 px-3 text-sm bg-gray-200 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            required
                                        />
                                    </div>
                                    
                                </form>
                            </div>
                        </div>
                        <div className="bg-slate-200 flex flex-col items-start px-4 lg:px-12">
                            <div className="mt-5 w-full max-w-3xl">
                                <h2 className="text-2xl font-bold ml-3 mt-10 mb-6">Enter Travelers Details</h2>
                                {userData.travelers.map((traveler, index) => (
                                    <div key={index} className="mb-6 bg-white p-8 rounded-xl">
                                        <h2 className="text-lg font-bold mb-3">Traveler {index + 1}</h2>

<form>
    <div className="mb-4 flex flex-wrap -mx-3">
        <div className="w-full lg:w-1/2 px-3 mb-4 lg:mb-0">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={`firstName-${index}`}>
                First Name
            </label>
            <input
                type="text"
                name="firstName"
                value={traveler.firstName}
                onChange={(e) => handleChange(e, index)}
                className="shadow appearance-none border rounded w-full text-sm bg-gray-200 py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
            />
        </div>
        <div className="w-full lg:w-1/2 px-3">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={`lastName-${index}`}>
                Last Name
            </label>
            <input
                type="text"
                name="lastName"
                value={traveler.lastName}
                onChange={(e) => handleChange(e, index)}
                className="shadow appearance-none border rounded w-full text-sm bg-gray-200 py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
            />
        </div>
    </div>
    <div className="mb-4 flex flex-wrap -mx-3">
        <div className="w-full lg:w-1/2 px-3 mb-4 lg:mb-0">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={`dateOfBirth-${index}`}>
                Date of Birth
            </label>
            <input
                type="date"
                name="dateOfBirth"
                value={traveler.dateOfBirth}
                onChange={(e) => handleChange(e, index)}
                className="shadow appearance-none border rounded w-full text-sm bg-gray-200 py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
            />
        </div>
        <div className="w-full lg:w-1/2 px-3">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={`passport.nationality-${index}`}>
                Nationality
            </label>
            <select
                name="nationality"
                value={traveler.passport.nationality}
                onChange={(e) => handlePassportChange(e, index)}
                className="shadow appearance-none border rounded w-full text-sm bg-gray-200 py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
            >
                <option value="">Select Nationality</option>
                {countryOptions.map(country => (
                    <option key={country.value} value={country.value}>
                        {country.label}
                    </option>
                ))}
            </select>
        </div>
    </div>

    <div className="mb-4 flex flex-wrap -mx-3">
        <div className="w-full lg:w-1/2 px-3 mb-4 lg:mb-0">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={`passport.number-${index}`}>
                Passport Number
            </label>
            <input
                type="text"
                name="number"
                value={traveler.passport.number}
                onChange={(e) => handlePassportChange(e, index)}
                className="shadow appearance-none border rounded w-full text-sm bg-gray-200 py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
            />
        </div>
        <div className="w-full lg:w-1/2 px-3">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={`passport.expiryDate-${index}`}>
                Passport Expiry Date
            </label>
            <input
                type="date"
                name="expiryDate"
                value={traveler.passport.expiryDate}
                onChange={(e) => handlePassportChange(e, index)}
                className="shadow appearance-none border rounded w-full text-sm bg-gray-200 py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
            />
        </div>

    </div>
    <div className="mb-4 flex flex-wrap -mx-3">
    <div className="w-full lg:w-1/2 px-3 mb-4 lg:mb-0">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="uploadTravelDocument">Upload Travel Document</label>
                <input type="file" name="uploadTravelDocument" value={userData.travelers[0].passport.uploadTravelDocument} onChange={(e) => handleChange(e, 0)} className="shadow appearance-none border rounded w-full text-sm py-2 bg-gray-200 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
    </div>

        <div className="w-full lg:w-1/2 px-3">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={`gender-${index}`}>
                Gender
            </label>
            <div className="flex items-center">
                <label className="inline-flex items-center mr-4">
                    <input
                        type="radio"
                        name="gender"
                        value="MALE"
                        checked={traveler.gender === "MALE"}
                        onChange={(e) => handleChange(e, index)}
                        className="form-radio"
                        required
                    />
                    <span className="ml-2 text-gray-700">Male</span>
                </label>
                <label className="inline-flex items-center">
                    <input
                        type="radio"
                        name="gender"
                        value="FEMALE"
                        checked={traveler.gender === "FEMALE"}
                        onChange={(e) => handleChange(e, index)}
                        className="form-radio"
                        required
                    />
                    <span className="ml-2 text-gray-700">Female</span>
                </label>
            </div>
        </div>
    </div>
</form>

                                    </div>
                                ))}
                                <div className="ml-3 mt-4 flex items-center">
                                    <input
                                        type="checkbox"
                                        id="agree"
                                        name="agree"
                                        checked={agreed}
                                        onChange={handleCheckboxChange}
                                        className="mr-2"
                                    />
                                    <label htmlFor="agree" className="text-gray-700 text-sm">I agree to the terms and conditions</label>
                                </div>
                                <div className="ml-2 mt-3 mb-10">
                                    <button
                                        type="button"
                                        onClick={handleSubmit}
                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                        disabled={!agreed}
                                    >
                                        Submit
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleCancel}
                                        className="ml-4 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='lg:w-1/3 p-5 mr-8'>
                        <div className='w-full lg:w-auto sticky top-0'>
                            <div className="p-4 bg-white rounded-xl shadow-lg">
                                <h2 className="text-xl font-bold mb-2">Flight Fare</h2>
                                <table className="border-collapse border-t border-gray-200 w-full">
                                    <thead>
                                        <tr className="text-sm  text-black ">
                                            <th className="py-2 px-4 text-left">PASSENGER</th>
                                            <th className="py-2 px-4 text-left">NO.</th>
                                            <th className="py-2 px-4 text-right">PRICE</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr >
                                            <td className=" py-2 text-sm text-gray-700 px-4">Adult</td>
                                            <td className="py-2 text-sm text-gray-700  px-4">1</td>
                                            <td className="py-2 text-sm text-gray-700 px-4 text-right">{ticketDetail.price} {ticketDetail.currency}</td>
                                        </tr>
                                    </tbody>
                                </table>

                                <div className="border-t border-gray-200 mt-2 py-2">
                                    <div className="flex justify-between text-sm font-bold">
                                        <span className='text-gray-900'>TOTAL PRICE</span>
                                        <span className='text-gray-900'>{ticketDetail.price} {ticketDetail.currency}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="max-w-md mx-auto mt-6 bg-white rounded-xl shadow-md overflow-hnameden md:max-w-2xl">
                                <div className="p-4">
                                    <h2 className="text-xl font-bold mb-4">Baggage Information</h2>

                                    <div className="mb-4 border-t  border-gray-200">
                                        <h3 className="text-lg text-gray-700 font-semibold">Checked Baggage</h3>
                                        <table className="min-w-full bg-white">
                                            <thead>
                                                <tr>
                                                    <th className="py-2 text-lg text-left">Segment</th>
                                                    <th className="py-2 text-lg text-left">Weight</th>
                                                </tr>
                                            </thead>
                                            {ticketDetail.segments.map((segment, index) => (
                                            <tbody key={index}>
                                                <tr>
                                                    <td className="py-2 text-gray-700 text-sm">{segment.departureIataCode} - {segment.arrivalIataCode}</td>
                                                    <td className="py-2 text-gray-700 text-sm">{segment.checkedBaggage}/Person</td>
                                                </tr>
                                            </tbody>
                                            ))}
                                        </table>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-semibold border-t text-gray-700 border-gray-200">Hand Baggage</h3>
                                        <table className="min-w-full bg-white">
                                            <thead>
                                                <tr>
                                                    <th className="py-2 text-lg text-left">Segment</th>
                                                    <th className="py-2 text-lg text-left">Weight</th>
                                                </tr>
                                            </thead>
                                            {ticketDetail.segments.map((segment, index) => (
                                            <tbody key={index}>
                                                <tr>
                                                    <td className="py-2 text-gray-700 text-sm">{segment.departureIataCode} - {segment.arrivalIataCode}</td>
                                                    <td className="py-2 text-gray-700 text-sm">{segment.carryBaggage}/Person</td>
                                                </tr>
                                            </tbody>
                                            ))}
                                        </table>
                                    </div>
                                </div>
                            </div>

                            <div className="max-w-md mx-auto mt-6 bg-white rounded-xl shadow-md overflow-hnameden md:max-w-2xl p-4">
                                <h2 className="text-xl font-bold mb-4">Cancellation Policies</h2>
                                <div>
                                    <p className="font-semibold border-t text-gray-800 mb-2">Contact us for below services:</p>
                                    <ul className="list-decimal list-insnamee mb-4 text-sm p-1">
                                        <li className='py-1 ml-1'>In case of cancellations or changes to your flight.</li>
                                        <li className='py-1 ml-1' >For extra optional services such as meal plan, preferred seat selection and frequent flyer number update.</li>
                                        <li className='py-1 ml-1'>For information regarding visa and travel regulations of your destination and transiting country.</li>
                                    </ul>
                                    <p className="text-red-500 font-bold border-t  border-gray-200 mb-4">PENALTY APPLIES</p>
                                    <div className="space-y-2 text-sm ">
                                        <div className="flex items-center">
                                            <FiMail className="mr-2" />
                                            <span>Email: support@Yatri-Tickets.com</span>
                                        </div>
                                        <div className="flex items-center">
                                            <FiPhone className="mr-2" />
                                            <span>Phone: +977-01-5983981/82</span>
                                        </div>
                                        <div className="flex items-center">
                                            <FiSmartphone className="mr-2" />
                                            <span>Mobile: +977 9826486158</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                        </div>
                    </div>
                </div>
            </div>
            ) : (
                <div><h2>Internal Server Error</h2></div>
            )}
            <Footer />
            <div className='timerContainer'>
                <h4>You have time: {formatTime(timer.minutes)}:{formatTime(timer.seconds)} to complete this booking</h4>
            </div>
            {showModal && <Modal onClose={closeModal} onReload={reloadPage} />}
        </div>
    );
};

export default FlightForm;
