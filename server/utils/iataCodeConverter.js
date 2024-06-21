var Amadeus = require("amadeus");
//const { response } = require("express");
const AirlinesName = require('../model/airlinesName')

var amadeus = new Amadeus({
  clientId: process.env.CLIENTID,
  clientSecret: process.env.CLIENTSECRET
});


//Converting iataCode to BusinessName with the help of database

const fetchCarrierDetails = async () => {
  try {
    const carriers = await AirlinesName.find();
    return carriers.reduce((acc, carrier) => {
      acc[carrier.iataCode] = carrier.businessName;
      return acc;
    }, {});
  } catch (err) {
    console.error('Error fetching carrier details:', err);
    throw err;
  }
};

// const airportName = (req, res) => {
//         // Retrieve information about the LHR airport?
//         amadeus.referenceData.location('ADEL').get()
//         .then(response => {res.json(response.data)})
//         .catch(response => {res.json(response)});
// }

//converting iataCode to AirportName

async function fetchAirportDetails(iataCode) {
  try {
      const response = await amadeus.referenceData.location(`A${iataCode}`).get();
      return response.data; // Adjust based on actual response structure
  } catch (error) {
      // console.error(`Error fetching details for airport code ${iataCode}:`, error);
      return null; // Handle error appropriately
  }
}


module.exports = {fetchCarrierDetails, fetchAirportDetails};