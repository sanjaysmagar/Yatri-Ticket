
const searchTicketss = require('../../services/flightEngine/oneFlightDetail')

const searchFlight1 = async (req, res) => {
    const {ticketId} = req.body;

    console.log(req.body)

    try{
    const flightOffers = req.session.flightOffers;

     console.log("flightOffers from session", flightOffers)

    if (!flightOffers) {
        return res.status(404).json(null);
    }

    // Find the flight offer that matches the given id
    const flightOffer = flightOffers.find(offer => offer.id === ticketId);

    if (!flightOffer) {
        return res.status(404).json(null);
    }

    // console.log("one selected flight offer ", flightOffer)
    // res.status(200).json(flightOffer);

        const {transformedData, pricingResponse} = await searchTicketss([flightOffer]);

        if (!transformedData) {
            return res.status(404).json(null);
        }
        req.session.pricingResponse = pricingResponse.data
        res.status(200).json(transformedData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = searchFlight1