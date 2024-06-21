const searchTickets = require('../../services/flightEngine/searchFlight')

const searchFlight = async (req, res) => {
    const { originLocationCode, destinationLocationCode, date, travelers, cabinRestrictions } = req.body;

    // Log the request body
    // console.log('Request Body:', req.body);

    try {
        const { transformedData, pricingResponse } = await searchTickets(originLocationCode, destinationLocationCode, date, travelers, cabinRestrictions);

        if (!transformedData) {
            return res.status(404).json(null);
        }

        req.session.flightOffers = pricingResponse.data.flightOffers
        res.status(200).json(transformedData);
        // res.status(200).json(pricingResponse.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = searchFlight;
