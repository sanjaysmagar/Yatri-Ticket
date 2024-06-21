const amadeus = require('../../utils/amadeus')
const priceCheck = require('../flightEngine/priceCheck')



const searchTicketss = async (flightOffer) => {

    try {
        // const flightOffersSearchResponse = await amadeus.shopping.flightOffersSearch.post(JSON.stringify(ticketDetails));
        const {transformedData, pricingResponse} = await priceCheck(flightOffer) 

    
        // console.log("req.session.pricingResponse", req.session.pricingResponse)

        return {transformedData, pricingResponse};
    } catch (error) {
        console.error(error);
        return {transformedData: null, pricingResponse: null};
    }
};

module.exports = searchTicketss