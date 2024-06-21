const searchTickets = require('../../services/flightEngine/search2wayFlight')

const search2wayFlight = async () => {
    const {originLocationCode, destinationLocationCode, departureDate, arrivalDate, cabin, nationality, travelers } = req.body;
     
    const tickets = await searchTickets(originLocationCode, destinationLocationCode, departureDate, arrivalDate, cabin, nationality, travelers)

    if(!tickets){
        return res.status(404).json(null)
    }

    res.status(200).json(tickets)
}

module.exports = search2wayFlight