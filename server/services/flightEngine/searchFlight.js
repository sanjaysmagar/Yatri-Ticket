const amadeus = require('../../utils/amadeus');
const { fetchCarrierDetails, fetchAirportDetails } = require('../../utils/iataCodeConverter');
const priceCheck = require('../flightEngine/priceCheck');

const searchTickets = async (originLocationCode, destinationLocationCode, date, travelers, cabinRestrictions) => {
    // Log the parameters
   // console.log('Parameters:', { originLocationCode, destinationLocationCode, date, travelers, cabinRestrictions });

    const ticketDetails = {
        "currencyCode": "NPR",
        "originDestinations": [{
            "id": "1",
            "originLocationCode": originLocationCode,
            "destinationLocationCode": destinationLocationCode,
            "departureDateTimeRange": {
                "date": date
            }
        }],
        "travelers": travelers,
        "sources": ["GDS"],
        "searchCriteria": {
            "maxFlightOffers": 5,
            "flightFilters": {
                cabinRestrictions,
                "carrierRestrictions": {
                    "excludedCarrierCodes": ["AA", "TP", "AZ", "CX"]
                }
            }
        }
    };

    // console.log("ticketDetails:", ticketDetails);

    try {
        const flightOffersSearchResponse = await amadeus.shopping.flightOffersSearch.post(JSON.stringify(ticketDetails));

        if(!flightOffersSearchResponse.data){
            return {transformedData: null, pricingResponse: null};
        }

        const { transformedData, pricingResponse } = await priceCheck(flightOffersSearchResponse.data);

        return { transformedData, pricingResponse };
    } catch (error) {
        console.error(error);
        return {transformedData: null, pricingResponse: null};
    }
};

module.exports = searchTickets;

